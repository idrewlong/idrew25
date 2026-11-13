import * as THREE from 'three';
import { AsciiStage, makeStars } from './AsciiStage';
import { LAND_H, LAND_MASK_B64, LAND_W } from './landMask';
import { orbitPath, satellitePosition } from './orbits';

/**
 * Hero scene: a dot-matrix Earth. Dots sit on latitude rows; land dots
 * (from a Natural Earth mask) are larger and lit, ocean dots are faint.
 * An atmosphere glow wraps the rim, an orange marker pulses on Long Beach,
 * MS, and the globe leans toward the pointer. Rendered directly (no ASCII
 * pass); the dots are the texture.
 */

const HOME = { lat: 30.35, lon: -89.15 }; // Long Beach, MS
const RADIUS = 2;

const DOT_VERT = /* glsl */ `
attribute float aLand;
uniform float uPixelRatio;
uniform vec3 uLight;
varying float vBright;
void main() {
	vec3 n = normalize(mat3(modelMatrix) * normalize(position));
	vec4 world = modelMatrix * vec4(position, 1.0);
	vec3 toCam = normalize(cameraPosition - world.xyz);
	float facing = dot(n, toCam);
	float light = max(dot(n, normalize(uLight)), 0.0);
	// Land: lit with a floor so the night side still reads; ocean: faint
	vBright = aLand > 0.5 ? 0.28 + light * 0.72 : 0.12 + light * 0.14;
	// Fade dots toward the limb, hide the back hemisphere entirely
	vBright *= smoothstep(0.0, 0.25, facing);
	vec4 mv = viewMatrix * world;
	gl_PointSize = (aLand > 0.5 ? 2.6 : 1.5) * uPixelRatio * (10.0 / -mv.z);
	gl_Position = projectionMatrix * mv;
	if (facing < 0.0) gl_PointSize = 0.0;
}
`;

const DOT_FRAG = /* glsl */ `
precision mediump float;
varying float vBright;
void main() {
	if (vBright < 0.01) discard;
	gl_FragColor = vec4(vec3(0.93, 0.93, 0.94) * vBright, 1.0);
}
`;

// Atmosphere: back-face shell, brightest at the silhouette
const GLOW_VERT = /* glsl */ `
varying vec3 vNormal;
varying vec3 vView;
void main() {
	vec4 mv = modelViewMatrix * vec4(position, 1.0);
	vNormal = normalize(normalMatrix * normal);
	vView = normalize(-mv.xyz);
	gl_Position = projectionMatrix * mv;
}
`;

const GLOW_FRAG = /* glsl */ `
precision mediump float;
varying vec3 vNormal;
varying vec3 vView;
void main() {
	float rim = pow(1.0 - abs(dot(vNormal, vView)), 3.0);
	gl_FragColor = vec4(vec3(0.85, 0.88, 0.95) * rim * 0.55, rim * 0.55);
}
`;

function decodeMask(): Uint8Array {
	const bin = atob(LAND_MASK_B64);
	const bytes = new Uint8Array(bin.length);
	for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
	return bytes;
}

function isLand(mask: Uint8Array, lat: number, lon: number) {
	const row = Math.min(LAND_H - 1, Math.max(0, Math.floor(((90 - lat) / 180) * LAND_H)));
	const col = Math.min(LAND_W - 1, Math.max(0, Math.floor(((lon + 180) / 360) * LAND_W)));
	const i = row * LAND_W + col;
	return ((mask[i >> 3] ?? 0) & (1 << (i & 7))) !== 0;
}

function latLonToVec(lat: number, lon: number, r: number) {
	const phi = THREE.MathUtils.degToRad(lat);
	const theta = THREE.MathUtils.degToRad(lon);
	// Longitude increases toward -z so the map isn't mirrored when seen from +z
	return new THREE.Vector3(r * Math.cos(phi) * Math.cos(theta), r * Math.sin(phi), -r * Math.cos(phi) * Math.sin(theta));
}

/** True when the segment from `a` to `b` passes through the sphere first. */
function segmentHitsSphere(a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3, r: number) {
	const d = b.clone().sub(a);
	const len = d.length();
	d.divideScalar(len);
	const t = c.clone().sub(a).dot(d);
	if (t < 0 || t > len) return false;
	const closest = a.clone().addScaledVector(d, t);
	return closest.distanceTo(c) < r;
}

function makeDots(rowStep: number): THREE.Points {
	const mask = decodeMask();
	const pos: number[] = [];
	const land: number[] = [];
	for (let lat = -90 + rowStep / 2; lat < 90; lat += rowStep) {
		// Same arc spacing along each row as between rows
		const count = Math.max(1, Math.round((360 / rowStep) * Math.cos(THREE.MathUtils.degToRad(lat))));
		for (let k = 0; k < count; k++) {
			const lon = -180 + (k + 0.5) * (360 / count);
			const v = latLonToVec(lat, lon, RADIUS);
			pos.push(v.x, v.y, v.z);
			land.push(isLand(mask, lat, lon) ? 1 : 0);
		}
	}
	const geo = new THREE.BufferGeometry();
	geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
	geo.setAttribute('aLand', new THREE.Float32BufferAttribute(land, 1));
	return new THREE.Points(
		geo,
		new THREE.ShaderMaterial({
			vertexShader: DOT_VERT,
			fragmentShader: DOT_FRAG,
			transparent: true,
			depthWrite: false,
			uniforms: {
				uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
				uLight: { value: new THREE.Vector3(-0.5, 0.45, 1) },
			},
		})
	);
}

type Orbit = { sats: THREE.Mesh[]; speed: number };

const EARTH_RADIUS_KM = 6371;
const ORBIT_STEPS = 160;

export interface Tle {
	name: string;
	line1: string;
	line2: string;
}

export interface TrackedSatellite {
	label: string;
	lat: number;
	lon: number;
	altKm: number;
}

type Featured = {
	tle: Tle;
	label: string;
	marker: THREE.Mesh;
	trail: THREE.Line;
	el: HTMLDivElement;
	pos: TrackedSatellite | null;
};

/** Globe-local position for a ground point at an altitude, true to scale. */
function orbitVec(lat: number, lon: number, altKm: number) {
	return latLonToVec(lat, lon, RADIUS * (1 + altKm / EARTH_RADIUS_KM));
}

export class GlobeScene extends AsciiStage {
	private globe = new THREE.Group();
	private pulse: THREE.Mesh;
	private orbits: Orbit[] = [];
	private decor = new THREE.Group();
	private featured: Featured[] = [];
	private swarm: { tles: Tle[]; points: THREE.Points } | null = null;
	private labelLayer: HTMLDivElement;
	private lastPositions = 0;
	private lastTrails = 0;
	/** Called about once a second with the featured satellites' positions. */
	onTelemetry?: (sats: TrackedSatellite[]) => void;
	private pointer = new THREE.Vector2();
	private lean = new THREE.Vector2();
	// Drag-to-rotate state
	private dragging = false;
	private dragLast = new THREE.Vector2();
	private spin = new THREE.Vector2(); // radians per frame, decays after release
	private lastInteract = -Infinity;
	private time = 0;

	/** Centre the globe in its container (Teardown demo) instead of the hero offset. */
	private centered = false;

	constructor(container: HTMLElement, opts: { centered?: boolean } = {}) {
		super(container);
		this.centered = Boolean(opts.centered);
		this.useAscii = false;

		// Fewer rows on small screens: cheaper, and the dots stay distinct
		const narrow = container.clientWidth < 768;
		this.globe.add(makeDots(narrow ? 1.6 : 1.1));

		// Invisible solid core: writes depth but no colour, so the far half of
		// each orbit and any satellite behind the planet are hidden by it
		const core = new THREE.Mesh(
			new THREE.SphereGeometry(RADIUS * 0.985, 64, 48),
			new THREE.MeshBasicMaterial({ colorWrite: false })
		);
		core.renderOrder = -1;
		this.globe.add(core);

		this.scene.add(
			new THREE.Mesh(
				new THREE.SphereGeometry(RADIUS * 1.12, 64, 48),
				new THREE.ShaderMaterial({
					vertexShader: GLOW_VERT,
					fragmentShader: GLOW_FRAG,
					side: THREE.BackSide,
					transparent: true,
					depthWrite: false,
					blending: THREE.AdditiveBlending,
				})
			)
		);

		// Home marker + pulse ring lying flat on the surface
		const home = latLonToVec(HOME.lat, HOME.lon, RADIUS * 1.01);
		const marker = new THREE.Mesh(
			new THREE.CircleGeometry(0.045, 16),
			new THREE.MeshBasicMaterial({ color: 0xff5b1f, side: THREE.DoubleSide })
		);
		this.pulse = new THREE.Mesh(
			new THREE.RingGeometry(0.07, 0.085, 32),
			new THREE.MeshBasicMaterial({ color: 0xff5b1f, transparent: true, side: THREE.DoubleSide, depthWrite: false })
		);
		for (const m of [marker, this.pulse]) {
			m.position.copy(home);
			m.lookAt(home.clone().multiplyScalar(2));
			this.globe.add(m);
		}

		// Face Long Beach toward the camera (+z), tilted part way north.
		// A point at longitude L lands on +z when rotation.y = -L - 90°.
		this.globe.rotation.y = -THREE.MathUtils.degToRad(HOME.lon) - Math.PI / 2;
		this.globe.rotation.x = THREE.MathUtils.degToRad(HOME.lat * 0.6);
		this.scene.add(this.globe);

		// Two faint orbits, one satellite each
		const ringMat = new THREE.LineBasicMaterial({ color: 0x3a3f44 });
		const satMat = new THREE.MeshBasicMaterial({ color: 0xd8d8d8 });
		const rings = [
			{ r: 2.75, tilt: [1.25, 0.35], speed: 0.3 },
			{ r: 3.25, tilt: [1.8, -0.5], speed: -0.18 },
		];
		for (const ring of rings) {
			const pivot = new THREE.Group();
			pivot.rotation.set(ring.tilt[0]!, ring.tilt[1]!, 0);
			const pts = new THREE.EllipseCurve(0, 0, ring.r, ring.r).getPoints(200);
			pivot.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), ringMat));
			const sat = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.05), satMat);
			sat.userData.phase = ring.r;
			sat.userData.r = ring.r;
			pivot.add(sat);
			this.decor.add(pivot);
			this.orbits.push({ sats: [sat], speed: ring.speed });
		}
		// Decorative until real orbital data arrives (see setSatellites)
		this.scene.add(this.decor);

		this.labelLayer = document.createElement('div');
		this.labelLayer.className = 'sat-layer';
		this.labelLayer.setAttribute('aria-hidden', 'true');
		container.appendChild(this.labelLayer);

		this.scene.add(makeStars(600, 50, 30, 0x3a3f44));

		window.addEventListener('pointermove', this.onPointer, { passive: true });

		// Drag to rotate. `pan-y` keeps vertical swipes scrolling the page on
		// touch screens; horizontal drags turn the globe.
		const el = this.renderer.domElement;
		el.style.touchAction = 'pan-y';
		el.style.cursor = 'grab';
		el.addEventListener('pointerdown', this.onDragStart);
		el.addEventListener('pointermove', this.onDragMove);
		el.addEventListener('pointerup', this.onDragEnd);
		el.addEventListener('pointercancel', this.onDragEnd);
		this.init();
	}

	private static readonly DRAG_SPEED = 0.006; // radians per pixel
	private static readonly MAX_TILT = 1.2; // radians either way

	private rotateBy(dx: number, dy: number) {
		this.globe.rotation.y += dx;
		this.globe.rotation.x = THREE.MathUtils.clamp(this.globe.rotation.x + dy, -GlobeScene.MAX_TILT, GlobeScene.MAX_TILT);
	}

	private onDragStart = (e: PointerEvent) => {
		this.dragging = true;
		this.dragLast.set(e.clientX, e.clientY);
		this.spin.set(0, 0);
		this.renderer.domElement.setPointerCapture(e.pointerId);
		this.renderer.domElement.style.cursor = 'grabbing';
	};

	private onDragMove = (e: PointerEvent) => {
		if (!this.dragging) return;
		const dx = (e.clientX - this.dragLast.x) * GlobeScene.DRAG_SPEED;
		const dy = (e.clientY - this.dragLast.y) * GlobeScene.DRAG_SPEED;
		this.dragLast.set(e.clientX, e.clientY);
		this.rotateBy(dx, dy);
		this.spin.set(dx, dy);
		this.lastInteract = performance.now();
		// Reduced motion has no render loop, so draw on demand
		if (this.reduceMotion) this.renderFrame(0);
	};

	private onDragEnd = (e: PointerEvent) => {
		if (!this.dragging) return;
		this.dragging = false;
		this.lastInteract = performance.now();
		if (this.reduceMotion) this.spin.set(0, 0);
		this.renderer.domElement.releasePointerCapture?.(e.pointerId);
		this.renderer.domElement.style.cursor = 'grab';
	};

	private onPointer = (e: PointerEvent) => {
		this.pointer.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
	};

	protected layout(w: number) {
		if (this.centered) {
			this.camera.position.set(0, 0, 10);
			this.camera.lookAt(0, 0, 0);
			return;
		}
		// Wide: globe sits right of the headline. Narrow: centred above it.
		const wide = w >= 768;
		const x = wide ? -3.4 : 0;
		const y = wide ? -0.7 : -3.7;
		this.camera.position.set(x, y, wide ? 12.5 : 27);
		this.camera.lookAt(x, y, 0);
	}

	/**
	 * Swap the decorative orbits for real spacecraft. Positions come from each
	 * TLE via SGP4 and sit inside the globe group, so they track the ground.
	 */
	setSatellites(featured: (Tle & { label: string })[], swarm: Tle[]) {
		this.scene.remove(this.decor);
		this.orbits = [];

		const markerMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
		for (const tle of featured) {
			const marker = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.045, 0.045), markerMat);
			const trail = new THREE.Line(
				new THREE.BufferGeometry(),
				new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.9 })
			);
			const el = document.createElement('div');
			el.className = 'sat-label';
			el.innerHTML = `<span class="sat-name"></span><span class="sat-alt"></span>`;
			(el.firstElementChild as HTMLElement).textContent = tle.label;
			this.labelLayer.appendChild(el);
			this.globe.add(marker, trail);
			this.featured.push({ tle, label: tle.label, marker, trail, el, pos: null });
		}

		if (swarm.length) {
			const geo = new THREE.BufferGeometry();
			geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(swarm.length * 3), 3));
			const points = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0x8b9097, size: 2, sizeAttenuation: false }));
			this.globe.add(points);
			this.swarm = { tles: swarm, points };
		}

		this.lastPositions = 0;
		this.lastTrails = 0;
		this.refreshPositions(true);
		// Draw now: under reduced motion there's no loop to pick this up
		this.renderFrame(0);
	}

	private refreshPositions(force = false) {
		const now = Date.now();
		if (!force && now - this.lastPositions < 1000) return;
		this.lastPositions = now;
		const date = new Date(now);

		for (const f of this.featured) {
			f.pos = null;
			const p = satellitePosition(f.tle, date);
			f.marker.visible = !!p;
			if (!p) continue;
			f.pos = { label: f.label, ...p };
			f.marker.position.copy(orbitVec(p.lat, p.lon, p.altKm));
			(f.el.lastElementChild as HTMLElement).textContent = `${Math.round(p.altKm)} km`;
		}

		if (this.swarm) {
			const attr = this.swarm.points.geometry.attributes.position as THREE.BufferAttribute;
			this.swarm.tles.forEach((tle, i) => {
				const p = satellitePosition(tle, date);
				const v = p ? orbitVec(p.lat, p.lon, p.altKm) : new THREE.Vector3();
				attr.setXYZ(i, v.x, v.y, v.z);
			});
			attr.needsUpdate = true;
		}

		// Orbits: one full closed ring each, brightest just ahead of the
		// satellite and fading around the loop. Rebuilt every 10s so the ring
		// keeps passing through the marker as the real Earth turns.
		if (force || now - this.lastTrails > 10_000) {
			this.lastTrails = now;
			for (const f of this.featured) {
				const path = orbitPath(f.tle, date, ORBIT_STEPS);
				const pts: number[] = [];
				const cols: number[] = [];
				path.forEach((p, i) => {
					const v = orbitVec(p.lat, p.lon, p.altKm);
					pts.push(v.x, v.y, v.z);
					const k = 0.85 - 0.7 * (i / ORBIT_STEPS);
					cols.push(k, k, k);
				});
				f.trail.geometry.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
				f.trail.geometry.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
			}
		}

		this.onTelemetry?.(this.featured.flatMap((f) => (f.pos ? [f.pos] : [])));
	}

	/** Pin each label to its satellite on screen; hide it when Earth is in the way. */
	private placeLabels() {
		if (!this.featured.length) return;
		const w = this.container.clientWidth;
		const h = this.container.clientHeight;
		const camPos = this.camera.getWorldPosition(new THREE.Vector3());
		const center = this.globe.getWorldPosition(new THREE.Vector3());
		const world = new THREE.Vector3();
		// Phones only have room for one tag; the rest still show as dots + trails
		const narrow = w < 768;
		for (const f of this.featured) {
			if (!f.marker.visible || (narrow && f.label !== 'ISS')) {
				f.el.style.opacity = '0';
				continue;
			}
			f.marker.getWorldPosition(world);
			const occluded = segmentHitsSphere(camPos, world, center, RADIUS);
			const ndc = world.clone().project(this.camera);
			const x = ((ndc.x + 1) / 2) * w;
			const y = ((1 - ndc.y) / 2) * h;
			// Near the right edge, hang the tag to the left of the satellite
			f.el.classList.toggle('is-left', x > w - 140);
			f.el.style.transform = `translate(${x}px, ${y}px)`;
			f.el.style.opacity = occluded ? '0' : '1';
		}
	}

	protected update(dt: number) {
		this.time += dt;
		if (this.featured.length || this.swarm) this.refreshPositions();
		if (!this.reduceMotion && !this.dragging) {
			// Coast after a drag, then resume the slow spin once idle for 3s
			if (this.spin.lengthSq() > 1e-8) {
				this.rotateBy(this.spin.x, this.spin.y);
				this.spin.multiplyScalar(Math.pow(0.92, dt * 60));
			}
			if (performance.now() - this.lastInteract > 3000) this.globe.rotation.y += dt * 0.05;
			this.lean.lerp(this.pointer, 0.04);
		}
		this.scene.rotation.set(this.lean.y * 0.1, this.lean.x * 0.15, 0);

		// Ring expands and fades on a loop
		const t = (this.time * 0.6) % 1;
		this.pulse.scale.setScalar(1 + t * 2.2);
		(this.pulse.material as THREE.MeshBasicMaterial).opacity = 1 - t;

		for (const o of this.orbits) {
			for (const sat of o.sats) {
				const a = sat.userData.phase + this.time * o.speed;
				sat.position.set(Math.cos(a) * sat.userData.r, Math.sin(a) * sat.userData.r, 0);
			}
		}

		// World matrices must be current before projecting labels
		this.scene.updateMatrixWorld();
		this.placeLabels();
	}

	override dispose() {
		window.removeEventListener('pointermove', this.onPointer);
		const el = this.renderer.domElement;
		el.removeEventListener('pointerdown', this.onDragStart);
		el.removeEventListener('pointermove', this.onDragMove);
		el.removeEventListener('pointerup', this.onDragEnd);
		el.removeEventListener('pointercancel', this.onDragEnd);
		this.labelLayer.remove();
		super.dispose();
	}
}
