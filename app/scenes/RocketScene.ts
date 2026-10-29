import * as THREE from 'three';
import { AsciiStage, makeStars } from './AsciiStage';

/**
 * ASCII mission sequence, Falcon 9 style. `progress` (0..1, from the pinned
 * ScrollTrigger) drives everything, so scrubbing backwards plays it in reverse:
 *
 *   0.00 pad, tower arm attached        0.60 MECO, first stage separates
 *   0.12 ignition, smoke                0.64 second stage burn
 *   0.20 liftoff, arm swings away       0.78 fairing halves peel off
 *   0.20-0.60 first-stage ascent;       0.86 satellite deploys,
 *        Earth's horizon rises               panels unfold, camera closes in
 *
 * Every position is a pure function of `progress` (plus a little per-frame
 * flicker for flames), never accumulated, so any scroll position is stable.
 */

const MAT = {
	hull: new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.4, metalness: 0.2 }),
	dark: new THREE.MeshStandardMaterial({ color: 0x3a3a3a, roughness: 0.7, metalness: 0.3 }),
	steel: new THREE.MeshStandardMaterial({ color: 0x9a9a9a, roughness: 0.6, metalness: 0.5 }),
	panel: new THREE.MeshStandardMaterial({ color: 0xd6d6d6, roughness: 0.35, metalness: 0.4, side: THREE.DoubleSide }),
};

const R = 0.24; // vehicle radius

const smooth = THREE.MathUtils.smoothstep;
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const span = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

function cyl(r: number, h: number, mat: THREE.Material, y: number, r2 = r, open = false) {
	const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r2, h, 28, 1, open), mat);
	m.position.y = y + h / 2;
	return m;
}

/** First stage: body, engine section, folded legs, grid fins, interstage. */
function makeStage1() {
	const g = new THREE.Group();
	g.add(cyl(R, 0.35, MAT.dark, 0)); // engine section
	g.add(cyl(R, 4.25, MAT.hull, 0.35)); // tank
	g.add(cyl(R * 1.01, 0.5, MAT.dark, 4.6)); // interstage (black on F9)
	g.add(cyl(0.16, 0.18, MAT.dark, -0.18, 0.22, true)); // engine bells
	for (let i = 0; i < 4; i++) {
		const a = (i * Math.PI) / 2 + Math.PI / 4;
		const leg = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.1, 0.05), MAT.dark);
		leg.position.set(Math.cos(a) * (R + 0.02), 0.6, Math.sin(a) * (R + 0.02));
		g.add(leg);
		const fin = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.14, 0.03), MAT.steel);
		fin.position.set(Math.cos(a) * (R + 0.09), 4.95, Math.sin(a) * (R + 0.09));
		fin.rotation.y = -a;
		g.add(fin);
	}
	return g;
}

/** Second stage: short tank and a long vacuum nozzle hidden in the interstage. */
function makeStage2() {
	const g = new THREE.Group();
	g.add(cyl(R, 1.4, MAT.hull, 5.1));
	g.add(cyl(0.05, 0.45, MAT.steel, 4.65, 0.17, true)); // MVac nozzle
	return g;
}

/** One fairing half: cylinder + ogive nose as a half-lathe. */
function makeFairingHalf(side: 1 | -1) {
	const pts: THREE.Vector2[] = [new THREE.Vector2(R * 1.12, 0), new THREE.Vector2(R * 1.12, 0.7)];
	for (let i = 1; i <= 10; i++) {
		const t = i / 10;
		pts.push(new THREE.Vector2(Math.max(0.001, R * 1.12 * Math.cos((t * Math.PI) / 2)), 0.7 + 0.85 * Math.sin((t * Math.PI) / 2)));
	}
	const geo = new THREE.LatheGeometry(pts, 20, side === 1 ? 0 : Math.PI, Math.PI);
	const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0xf2f2f2, roughness: 0.4, side: THREE.DoubleSide }));
	const pivot = new THREE.Group();
	pivot.position.y = 6.5;
	pivot.add(mesh);
	return pivot;
}

/** Satellite: bus with antenna, two solar wings that unfold along x. */
function makeSatellite() {
	const g = new THREE.Group();
	g.add(new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.34, 0.26), MAT.steel));
	const dish = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.02, 0.06, 16), MAT.hull);
	dish.position.y = 0.22;
	g.add(dish);
	const wings: THREE.Mesh[] = [];
	for (const side of [1, -1]) {
		// Panels face the camera (xy plane) so they read as surfaces, not edges
		const wing = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.3, 0.02), MAT.panel);
		wing.geometry.translate((side * 1.1) / 2, 0, 0); // hinge at the bus
		wing.position.x = side * 0.13;
		g.add(wing);
		wings.push(wing);
	}
	g.userData.wings = wings;
	// Payload is drawn larger than true scale so it holds up as ASCII
	g.scale.setScalar(1.7);
	return g;
}

/** Lattice launch tower with a crew-access arm, and the pad deck. */
function makePad() {
	const g = new THREE.Group();
	// Mid-grey so the deck reads as a row of glyphs under the vehicle
	const deck = new THREE.Mesh(new THREE.BoxGeometry(7, 0.3, 3), MAT.steel);
	deck.position.y = -0.5;
	g.add(deck);
	const trench = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.32, 3.02), new THREE.MeshBasicMaterial({ color: 0x000000 }));
	trench.position.y = -0.5;
	g.add(trench);

	const tower = new THREE.Group();
	tower.position.set(-1.35, -0.35, 0);
	const H = 8.4;
	for (const [x, z] of [[-0.3, -0.3], [0.3, -0.3], [-0.3, 0.3], [0.3, 0.3]]) {
		const post = new THREE.Mesh(new THREE.BoxGeometry(0.06, H, 0.06), MAT.steel);
		post.position.set(x, H / 2, z);
		tower.add(post);
	}
	for (let y = 0.6; y < H; y += 0.6) {
		for (const [w, d, x, z] of [[0.6, 0.04, 0, -0.3], [0.6, 0.04, 0, 0.3], [0.04, 0.6, -0.3, 0], [0.04, 0.6, 0.3, 0]]) {
			const brace = new THREE.Mesh(new THREE.BoxGeometry(w, 0.04, d), MAT.steel);
			brace.position.set(x, y, z);
			tower.add(brace);
		}
	}
	g.add(tower);

	// Crew-access arm hinged on the tower, reaching to the second stage
	const arm = new THREE.Group();
	arm.position.set(-1.05, 6.0, 0);
	const beam = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.12, 0.2), MAT.steel);
	beam.position.x = 0.42;
	arm.add(beam);
	g.add(arm);
	g.userData.arm = arm;
	return g;
}

/** Particle plume; `life` cycles 0..1 per particle. */
function makePlume(count: number, size: number) {
	const geo = new THREE.BufferGeometry();
	geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
	geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
	const pts = new THREE.Points(
		geo,
		new THREE.PointsMaterial({ size, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })
	);
	// Positions are rewritten every frame as the vehicle climbs, so the bounds
	// computed on the first frame (at the pad) go stale and the plume gets culled
	pts.frustumCulled = false;
	return { pts, life: new Float32Array(count).map(() => Math.random()) };
}

export class RocketScene extends AsciiStage {
	private pad = makePad();
	private stage1 = makeStage1();
	private stage2 = makeStage2();
	private fairing = [makeFairingHalf(1), makeFairingHalf(-1)];
	private satellite = makeSatellite();
	private earth: THREE.Mesh;
	private stars: THREE.Points;
	private rim = new THREE.PointLight(0xff5b1f, 0, 10);
	private plume1 = makePlume(320, 0.18);
	private plume2 = makePlume(200, 0.14);
	private smoke = makePlume(260, 0.5);
	private wide = true;

	/** Scroll progress through the mission, 0..1. */
	progress = 0;

	/** Keep the vehicle centred (Teardown demo) instead of the home layout offset. */
	private centered = false;

	constructor(container: HTMLElement, opts: { centered?: boolean } = {}) {
		super(container);
		this.centered = Boolean(opts.centered);

		this.scene.add(new THREE.AmbientLight(0xffffff, 0.3));
		const sun = new THREE.DirectionalLight(0xffffff, 2.6);
		sun.position.set(5, 7, 6);
		this.scene.add(sun, this.rim);

		this.scene.add(this.pad, this.stage1, this.stage2, ...this.fairing, this.satellite);
		this.scene.add(this.plume1.pts, this.plume2.pts, this.smoke.pts);
		(this.smoke.pts.material as THREE.PointsMaterial).blending = THREE.NormalBlending;

		// Earth's limb, rising into frame as the vehicle climbs
		this.earth = new THREE.Mesh(
			new THREE.SphereGeometry(14, 96, 64),
			new THREE.MeshStandardMaterial({ color: 0x777777, roughness: 0.9 })
		);
		this.scene.add(this.earth);

		this.stars = makeStars(1100, 70, 140, 0x2a2a2a);
		this.scene.add(this.stars);

		this.init();
	}

	protected layout(w: number) {
		this.wide = w >= 768;
	}

	protected update(dt: number) {
		const p = this.progress;

		// ── Timeline ──────────────────────────────────────
		const ignition = smooth(p, 0.1, 0.18);
		const burn1 = span(p, 0.2, 0.6); // first-stage ascent
		const sep = span(p, 0.6, 0.7); // stage 1 falls away
		const burn2 = p > 0.64 && p < 0.84 ? 1 : 0;
		const fairingSep = span(p, 0.78, 0.9);
		const deploy = span(p, 0.86, 1);

		// Stack altitude (world y of the vehicle base)
		const climb1 = burn1 * burn1 * 28;
		const climb2 = span(p, 0.6, 1) * 16;
		const stackY = climb1 + climb2;
		const shake = ignition * (1 - burn1) * 0.03;
		const jitter = (Math.random() - 0.5) * shake;

		// Second stage + payload ride on stackY; stage 1 detaches at MECO
		this.stage2.position.set(jitter, stackY, 0);
		const s1Y = p < 0.6 ? stackY : stackY - sep * sep * 9;
		this.stage1.position.set(jitter + sep * 0.8, s1Y, sep * -0.6);
		this.stage1.rotation.z = sep * 0.9;

		// Fairing halves peel outward and tumble
		this.fairing.forEach((half, i) => {
			const side = i === 0 ? 1 : -1;
			half.position.set(jitter + side * fairingSep * 2.2, stackY + 6.5 - fairingSep * 1.2, 0);
			half.rotation.z = -side * fairingSep * 1.1;
		});

		// Satellite: inside the fairing, then drifts free and unfolds
		const satDrift = deploy * deploy;
		this.satellite.position.set(jitter + satDrift * 0.6, stackY + 7.1 + satDrift * 1.8, satDrift * 0.4);
		// A gentle sway rather than a spin, so the panels stay face-on
		const sway = this.reduceMotion ? 0 : Math.sin(performance.now() * 0.0004) * 0.25 * deploy;
		this.satellite.rotation.set(0.2 * deploy, -0.35 * deploy + sway, 0.08 * deploy);
		const unfold = 0.04 + 0.96 * smooth(p, 0.9, 0.97);
		for (const w of this.satellite.userData.wings as THREE.Mesh[]) w.scale.x = unfold;
		this.satellite.visible = p > 0.7; // hidden inside the fairing until then

		// Tower arm swings back before liftoff
		(this.pad.userData.arm as THREE.Group).rotation.y = smooth(p, 0.13, 0.2) * 1.35;

		// ── Camera ────────────────────────────────────────
		// Pad framing → follow the stack → close in on the satellite
		// Keep the whole vehicle (≈8 units tall) and its flame inside the band
		// between the HUD rails: aim a little below its middle and pull back
		const follow = stackY + THREE.MathUtils.lerp(3.9, 3.2, smooth(p, 0.2, 0.35));
		const onSat = this.satellite.position.y;
		const toSat = smooth(p, 0.82, 0.95);
		const target = THREE.MathUtils.lerp(follow, onSat, toSat);
		// Far enough out on the pad to see the whole stack and tower; tightens
		// after liftoff, then closes in on the satellite without cropping its wings
		const padZoom = this.wide ? 19 : 28;
		const flightZoom = this.wide ? 24 : 30;
		const satZoom = this.wide ? 10.5 : 14;
		const zoom =
			p < 0.8
				? THREE.MathUtils.lerp(padZoom, flightZoom, smooth(p, 0.2, 0.35))
				: THREE.MathUtils.lerp(flightZoom, satZoom, smooth(p, 0.8, 0.96));
		// Wide: vehicle sits right of the stage list; at deploy, slide over so
		// the satellite and its unfolded panels land centre-right
		const offset = this.wide && !this.centered;
		const baseX = offset ? -2.4 : 0;
		const camX = THREE.MathUtils.lerp(baseX, this.satellite.position.x - (offset ? 1.4 : 0), toSat);
		// Phones: aim the camera higher so the subject sits low, under the stage list
		const lift = this.wide || this.centered ? 0 : 1.3;
		this.camera.position.set(camX, target + 0.6 + lift, zoom);
		this.camera.lookAt(camX, target + lift, 0);

		// Earth's limb rises below once the pad is gone
		const limb = smooth(p, 0.45, 0.75);
		this.earth.position.set(camX + 3, target - 16.5 - (1 - limb) * 10, -6);
		this.earth.visible = p > 0.4;

		// Stars brighten from atmosphere to space; they ride with the camera
		const space = smooth(p, 0.25, 0.6);
		(this.stars.material as THREE.PointsMaterial).color.setScalar(0.16 + space * 0.38);
		this.stars.position.y = target * 0.92;

		// ── Fire and smoke ────────────────────────────────
		this.rim.intensity = ignition * (1 - sep) * 7;
		this.rim.position.set(0, s1Y - 0.6, 0.8);

		const thrust1 = ignition * (1 - smooth(p, 0.58, 0.6));
		this.updatePlume(this.plume1, dt, this.stage1.position, -0.25, thrust1 * (0.6 + burn1 * 0.8), 1.2);
		this.updatePlume(this.plume2, dt, this.stage2.position, 4.6, burn2 * 0.9, 0.7);

		// Smoke billows sideways along the pad from ignition, fading with altitude
		const smokeAmt = ignition * (1 - smooth(p, 0.3, 0.42));
		this.updateSmoke(dt, smokeAmt);
	}

	private updatePlume(
		plume: { pts: THREE.Points; life: Float32Array },
		dt: number,
		origin: THREE.Vector3,
		nozzleY: number,
		thrust: number,
		scale: number
	) {
		const pos = plume.pts.geometry.attributes.position as THREE.BufferAttribute;
		const col = plume.pts.geometry.attributes.color as THREE.BufferAttribute;
		const P = pos.array as Float32Array;
		const C = col.array as Float32Array;
		for (let i = 0; i < plume.life.length; i++) {
			// Same cone as the original launch: widens and lengthens with thrust
			let life = plume.life[i] + dt * (1.4 + thrust);
			if (life > 1) life -= 1;
			plume.life[i] = life;
			const r = life * (0.35 + thrust * 0.6) * scale * Math.random();
			const a = i * 2.399;
			P[i * 3] = origin.x + Math.cos(a) * r;
			P[i * 3 + 1] = origin.y + nozzleY - life * (1.2 + thrust * 3.5) * scale;
			P[i * 3 + 2] = origin.z + Math.sin(a) * r;
			// Hot orange at the nozzle, cooling to a dim red tail
			const heat = (1 - life) ** 1.6;
			C[i * 3] = 0.25 + heat * 0.75;
			C[i * 3 + 1] = 0.05 + heat * 0.32;
			C[i * 3 + 2] = 0.02 + heat * 0.06;
		}
		pos.needsUpdate = true;
		col.needsUpdate = true;
		(plume.pts.material as THREE.PointsMaterial).opacity = thrust > 0.02 ? 0.32 : 0;
	}

	private updateSmoke(dt: number, amount: number) {
		const pos = this.smoke.pts.geometry.attributes.position as THREE.BufferAttribute;
		const col = this.smoke.pts.geometry.attributes.color as THREE.BufferAttribute;
		const P = pos.array as Float32Array;
		const C = col.array as Float32Array;
		for (let i = 0; i < this.smoke.life.length; i++) {
			let life = this.smoke.life[i] + dt * 0.35;
			if (life > 1) life -= 1;
			this.smoke.life[i] = life;
			const dir = i % 2 ? 1 : -1;
			const a = i * 1.618;
			P[i * 3] = dir * (0.4 + life * 3.2) + Math.cos(a) * life * 0.5;
			P[i * 3 + 1] = -0.2 + life * 1.1 + Math.sin(a * 3) * 0.2;
			P[i * 3 + 2] = Math.sin(a) * (0.3 + life);
			const v = 0.5 * (1 - life);
			C[i * 3] = v;
			C[i * 3 + 1] = v;
			C[i * 3 + 2] = v;
		}
		pos.needsUpdate = true;
		col.needsUpdate = true;
		const mat = this.smoke.pts.material as THREE.PointsMaterial;
		mat.opacity = amount * 0.55;
		this.smoke.pts.visible = amount > 0.01;
	}
}
