import * as THREE from 'three';

/**
 * Shared base for the site's ASCII-rendered Three.js scenes.
 *
 * Subclasses build into `this.scene`, move things in `update(dt)`, and frame
 * the camera in `layout(w, h)`. The base renders the scene into a tiny render
 * target (one texel per character cell), then a fullscreen shader draws each
 * cell as a glyph whose density follows its brightness. Warm cells keep their
 * colour (signal orange); everything else draws in off-white.
 */

const GLYPHS = ' .:-=+*#%@';
const CELL = 8; // CSS px per character cell (width)
const CELL_ASPECT = 1.6; // cell height / width, matches a monospace glyph

const ASCII_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
	vUv = uv;
	gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const ASCII_FRAG = /* glsl */ `
precision mediump float;
uniform sampler2D uScene;
uniform sampler2D uGlyphs;
uniform vec2 uCells;
uniform float uGlyphCount;
varying vec2 vUv;

void main() {
	vec2 cell = floor(vUv * uCells);
	vec2 local = fract(vUv * uCells);
	vec4 src = texture2D(uScene, (cell + 0.5) / uCells);
	float lum = dot(src.rgb, vec3(0.299, 0.587, 0.114));
	float idx = floor(clamp(pow(lum, 0.8), 0.0, 0.999) * uGlyphCount);
	vec2 guv = vec2((idx + local.x) / uGlyphCount, local.y);
	float mask = texture2D(uGlyphs, guv).r;
	vec3 tint = mix(vec3(0.93), src.rgb / max(lum, 0.001) * 0.85, step(0.25, src.r - src.b));
	gl_FragColor = vec4(tint * mask, mask);
}
`;

function makeGlyphAtlas(): THREE.CanvasTexture {
	// Each glyph gets a tall cell with the same aspect as the on-screen cells,
	// drawn in a system monospace so it never waits on a web font.
	const w = 40;
	const h = w * CELL_ASPECT;
	const canvas = document.createElement('canvas');
	canvas.width = w * GLYPHS.length;
	canvas.height = h;
	const ctx = canvas.getContext('2d')!;
	ctx.fillStyle = '#000';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = '#fff';
	ctx.font = `500 ${w * 1.25}px ui-monospace, Menlo, Consolas, monospace`;
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	[...GLYPHS].forEach((g, i) => ctx.fillText(g, i * w + w / 2, h / 2));
	const tex = new THREE.CanvasTexture(canvas);
	tex.minFilter = THREE.LinearFilter;
	tex.magFilter = THREE.LinearFilter;
	tex.generateMipmaps = false;
	return tex;
}

/** Faint starfield on a slab behind the subject. */
export function makeStars(count: number, spreadX: number, spreadY: number, color = 0x5a5a5a): THREE.Points {
	const sp = new Float32Array(count * 3);
	for (let i = 0; i < count; i++) {
		sp[i * 3] = (Math.random() - 0.5) * spreadX;
		sp[i * 3 + 1] = (Math.random() - 0.5) * spreadY;
		sp[i * 3 + 2] = -10 - Math.random() * 30;
	}
	const geo = new THREE.BufferGeometry();
	geo.setAttribute('position', new THREE.BufferAttribute(sp, 3));
	return new THREE.Points(geo, new THREE.PointsMaterial({ color, size: 0.1 }));
}

export abstract class AsciiStage {
	protected renderer: THREE.WebGLRenderer;
	protected scene = new THREE.Scene();
	protected camera = new THREE.PerspectiveCamera(35, 1, 0.1, 200);
	private target: THREE.WebGLRenderTarget;
	private asciiScene = new THREE.Scene();
	private asciiCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
	private asciiMat: THREE.ShaderMaterial;
	private clock = new THREE.Clock();
	private rafId = 0;
	private running = false;
	private resizeObserver: ResizeObserver;

	/** When true, render one still frame and stop animating. */
	reduceMotion = false;
	/** Subclasses can turn the ASCII pass off and render the scene directly. */
	protected useAscii = true;

	constructor(protected container: HTMLElement) {
		this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' });
		this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		this.renderer.setClearColor(0x000000, 0);
		this.renderer.domElement.setAttribute('aria-hidden', 'true');
		this.renderer.domElement.style.display = 'block';
		this.renderer.domElement.style.width = '100%';
		this.renderer.domElement.style.height = '100%';
		container.appendChild(this.renderer.domElement);

		this.target = new THREE.WebGLRenderTarget(16, 16, { magFilter: THREE.NearestFilter, minFilter: THREE.NearestFilter });
		this.asciiMat = new THREE.ShaderMaterial({
			vertexShader: ASCII_VERT,
			fragmentShader: ASCII_FRAG,
			transparent: true,
			uniforms: {
				uScene: { value: this.target.texture },
				uGlyphs: { value: makeGlyphAtlas() },
				uCells: { value: new THREE.Vector2(16, 16) },
				uGlyphCount: { value: GLYPHS.length },
			},
		});
		this.asciiScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.asciiMat));

		this.resizeObserver = new ResizeObserver(() => this.resize());
	}

	/** Call at the end of the subclass constructor, once the scene is built. */
	protected init() {
		this.resizeObserver.observe(this.container);
		this.resize();
	}

	protected abstract update(dt: number): void;
	protected abstract layout(width: number, height: number): void;

	private resize() {
		const w = this.container.clientWidth;
		const h = this.container.clientHeight;
		if (!w || !h) return;
		this.renderer.setSize(w, h, false);
		const cols = Math.max(8, Math.floor(w / CELL));
		const rows = Math.max(8, Math.floor(h / (CELL * CELL_ASPECT)));
		this.target.setSize(cols, rows);
		this.asciiMat.uniforms.uCells.value.set(cols, rows);
		this.camera.aspect = w / h;
		this.layout(w, h);
		this.camera.updateProjectionMatrix();
		if (!this.running) this.renderFrame(0);
	}

	start() {
		if (this.running || this.reduceMotion) {
			this.renderFrame(0);
			return;
		}
		this.running = true;
		this.clock.getDelta();
		const loop = () => {
			if (!this.running) return;
			this.renderFrame(Math.min(this.clock.getDelta(), 0.05));
			this.rafId = requestAnimationFrame(loop);
		};
		this.rafId = requestAnimationFrame(loop);
	}

	stop() {
		this.running = false;
		cancelAnimationFrame(this.rafId);
	}

	protected renderFrame(dt: number) {
		this.update(dt);
		if (!this.useAscii) {
			this.renderer.render(this.scene, this.camera);
			return;
		}
		this.renderer.setRenderTarget(this.target);
		this.renderer.render(this.scene, this.camera);
		this.renderer.setRenderTarget(null);
		this.renderer.render(this.asciiScene, this.asciiCam);
	}

	dispose() {
		this.stop();
		this.resizeObserver.disconnect();
		const disposeTree = (root: THREE.Object3D) =>
			root.traverse((o: any) => {
				o.geometry?.dispose();
				const mats = Array.isArray(o.material) ? o.material : [o.material];
				mats.forEach((m: any) => {
					if (!m) return;
					Object.values(m.uniforms ?? {}).forEach((u: any) => u?.value?.isTexture && u.value.dispose());
					m.dispose();
				});
			});
		disposeTree(this.scene);
		disposeTree(this.asciiScene);
		this.target.dispose();
		this.renderer.dispose();
		this.renderer.forceContextLoss();
		this.renderer.domElement.remove();
	}
}
