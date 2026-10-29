<template>
	<div ref="host" class="usmap" aria-hidden="true">
		<canvas ref="canvas"></canvas>
	</div>
	<p class="usmap-readout wrap readout">
		<span class="usmap-dot" aria-hidden="true"></span>
		<template v-if="served">
			Served from <span class="text-[var(--text)]">{{ served.label }}</span>
		</template>
		<template v-else>US regions · IAD1 · CLE1 · PDX1 · SFO1</template>
		<span class="hidden sm:inline">· Long Beach, MS 30.35°N 89.15°W</span>
	</p>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

/**
 * Footer art: a dot-matrix map of the contiguous US seen from low over the
 * Gulf, looking north across it. Nodes are the US Vercel / AWS regions plus
 * Long Beach; pulses travel along arcs between them. The "served from" line
 * is real: /api/served-from reports the region that ran the request.
 */

// Vercel region → AWS region, with airport-code locations
const REGIONS = [
	{ id: 'iad1', code: 'IAD1', aws: 'us-east-1', city: 'Washington, D.C.', lat: 38.95, lon: -77.45 },
	{ id: 'cle1', code: 'CLE1', aws: 'us-east-2', city: 'Cleveland', lat: 41.41, lon: -81.85 },
	{ id: 'pdx1', code: 'PDX1', aws: 'us-west-2', city: 'Portland', lat: 45.59, lon: -122.6 },
	{ id: 'sfo1', code: 'SFO1', aws: 'us-west-1', city: 'San Francisco', lat: 37.62, lon: -122.38 },
];
const HOME = { code: 'LONG BEACH', lat: 30.35, lon: -89.15 };

// Rough contiguous-US border; the Natural Earth land mask trims the coasts
const US_OUTLINE = [
	[-124.8, 48.4], [-123.0, 49.0], [-95.2, 49.0], [-94.8, 49.4], [-89.6, 48.0], [-84.8, 46.5],
	[-82.4, 45.3], [-82.5, 41.7], [-79.0, 42.9], [-76.4, 44.2], [-74.7, 45.0], [-71.5, 45.0],
	[-70.0, 46.7], [-67.8, 47.1], [-66.8, 44.9], [-65.0, 44.0], [-75.0, 33.0], [-79.0, 24.0],
	[-82.0, 24.0], [-84.0, 28.5], [-90.0, 28.4], [-97.1, 25.8], [-99.5, 27.5], [-101.4, 29.8],
	[-103.0, 28.9], [-104.7, 29.8], [-106.5, 31.8], [-108.2, 31.3], [-111.1, 31.3], [-114.8, 32.5],
	[-117.1, 32.5], [-121.0, 32.0], [-126.0, 40.0],
];

const LON0 = -125.5;
const LON1 = -66;
const LAT0 = 24;
const LAT1 = 49.5;
const STEP = 0.5; // degrees between dots (the mask's own resolution)
const KX = Math.cos((37 * Math.PI) / 180); // longitude squeeze at mid-latitude

const host = ref(null);
const canvas = ref(null);
const served = ref(null);

let ctx;
let base; // pre-rendered dots
let w = 0;
let h = 0;
let proj;
let raf = 0;
let running = false;
let reduce = false;
let io;
let ro;
let mask;
let maskInfo;

function inOutline(lon, lat) {
	let inside = false;
	for (let i = 0, j = US_OUTLINE.length - 1; i < US_OUTLINE.length; j = i++) {
		const [xi, yi] = US_OUTLINE[i];
		const [xj, yj] = US_OUTLINE[j];
		if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
	}
	return inside;
}

function isLand(lat, lon) {
	const { W, H } = maskInfo;
	const row = Math.floor(((90 - lat) / 180) * H);
	const col = Math.floor(((lon + 180) / 360) * W);
	const i = row * W + col;
	return (mask[i >> 3] & (1 << (i & 7))) !== 0;
}

/**
 * Ground-plane perspective. The camera sits south of the map, raised, and
 * looks north: near (south) points spread wide at the bottom, far (north)
 * points converge toward the horizon. `alt` lifts a point off the ground.
 */
function makeProjection() {
	const D = 15; // camera distance south of LAT0, in degrees
	const H = 13; // camera height: higher tilts the map toward the viewer
	const spanX = (LON1 - LON0) * KX;
	// Fill the width at mid-depth; phones fill a little wider still
	const F = (w * (w < 768 ? 1.12 : 0.98) * (D + 10)) / spanX;
	// Put the southern edge near the bottom; the horizon lands above it
	const horizon = h * 0.97 - H * (F / D);
	const cx = w / 2;
	const lonC = (LON0 + LON1) / 2;
	return (lon, lat, alt = 0) => {
		const depth = D + (lat - LAT0);
		const s = F / depth;
		return { x: cx + (lon - lonC) * KX * s, y: horizon + (H - alt) * s, s };
	};
}

function drawBase() {
	base = document.createElement('canvas');
	const dpr = Math.min(window.devicePixelRatio || 1, 2);
	base.width = Math.round(w * dpr);
	base.height = Math.round(h * dpr);
	const b = base.getContext('2d');
	b.setTransform(dpr, 0, 0, dpr, 0, 0);
	// Back to front so nearer dots sit on top
	for (let lat = LAT1; lat >= LAT0; lat -= STEP) {
		for (let lon = LON0; lon <= LON1; lon += STEP) {
			if (!inOutline(lon, lat) || !isLand(lat, lon)) continue;
			const p = proj(lon, lat);
			const fade = 0.25 + 0.55 * ((LAT1 - lat) / (LAT1 - LAT0));
			b.fillStyle = `rgba(236, 237, 238, ${fade})`;
			const r = Math.max(0.7, p.s * 0.03);
			b.fillRect(p.x - r, p.y - r * 0.5, r * 2, r);
		}
	}
}

// Point on a raised arc between two ground points (t in 0..1)
function arcPoint(a, b, t) {
	const lon = a.lon + (b.lon - a.lon) * t;
	const lat = a.lat + (b.lat - a.lat) * t;
	const dist = Math.hypot((b.lon - a.lon) * KX, b.lat - a.lat);
	return proj(lon, lat, Math.sin(Math.PI * t) * dist * 0.11);
}

function frame(time) {
	if (!ctx) return;
	const dpr = Math.min(window.devicePixelRatio || 1, 2);
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
	ctx.drawImage(base, 0, 0);
	ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

	const t = time / 1000;
	const active = served.value?.id;

	// Arcs from Long Beach to each region, with a pulse travelling out
	REGIONS.forEach((r, i) => {
		ctx.beginPath();
		for (let k = 0; k <= 40; k++) {
			const p = arcPoint(HOME, r, k / 40);
			if (k === 0) ctx.moveTo(p.x, p.y);
			else ctx.lineTo(p.x, p.y);
		}
		ctx.strokeStyle = r.id === active ? 'rgba(255, 91, 31, 0.75)' : 'rgba(139, 144, 151, 0.35)';
		ctx.lineWidth = 1;
		ctx.stroke();
		if (!reduce) {
			const p = arcPoint(HOME, r, (t * 0.35 + i * 0.27) % 1);
			ctx.fillStyle = '#ff5b1f';
			ctx.fillRect(p.x - 1.5, p.y - 1.5, 3, 3);
		}
	});

	// Nodes: a stem up from the ground, a square marker, a label
	const nodes = [...REGIONS, { ...HOME, home: true }];
	for (const n of nodes) {
		const g = proj(n.lon, n.lat);
		const top = proj(n.lon, n.lat, 1.6);
		const isActive = n.home || n.id === active;
		ctx.strokeStyle = isActive ? 'rgba(255, 91, 31, 0.8)' : 'rgba(236, 237, 238, 0.4)';
		ctx.beginPath();
		ctx.moveTo(g.x, g.y);
		ctx.lineTo(top.x, top.y);
		ctx.stroke();
		const pulse = reduce ? 0 : (t * 0.8 + (n.lon + 130) / 60) % 1;
		if (isActive && !reduce) {
			ctx.strokeStyle = `rgba(255, 91, 31, ${1 - pulse})`;
			ctx.beginPath();
			ctx.ellipse(g.x, g.y, 4 + pulse * 18, (4 + pulse * 18) * 0.35, 0, 0, Math.PI * 2);
			ctx.stroke();
		}
		ctx.fillStyle = n.home ? '#ff5b1f' : isActive ? '#ff5b1f' : '#ecedee';
		ctx.fillRect(top.x - 3, top.y - 3, 6, 6);
		ctx.font = '500 10px "Geist Mono", ui-monospace, monospace';
		ctx.fillStyle = isActive ? '#ecedee' : '#8b9097';
		ctx.fillText(n.code, top.x + 8, top.y + 3);
	}
}

function loop(time) {
	if (!running) return;
	frame(time);
	raf = requestAnimationFrame(loop);
}

function resize() {
	if (!host.value || !canvas.value || !mask) return;
	const dpr = Math.min(window.devicePixelRatio || 1, 2);
	w = host.value.clientWidth;
	h = host.value.clientHeight;
	// Hidden (e.g. display:none while printing): nothing to draw, and a 0px base canvas would throw
	if (!w || !h) return;
	canvas.value.width = Math.round(w * dpr);
	canvas.value.height = Math.round(h * dpr);
	canvas.value.style.width = `${w}px`;
	canvas.value.style.height = `${h}px`;
	ctx = canvas.value.getContext('2d');
	proj = makeProjection();
	drawBase();
	frame(performance.now());
}

onMounted(async () => {
	reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	// Land data loads with the footer, not with the page
	const land = await import('~/scenes/landMask');
	const bin = atob(land.LAND_MASK_B64);
	mask = new Uint8Array(bin.length);
	for (let i = 0; i < bin.length; i++) mask[i] = bin.charCodeAt(i);
	maskInfo = { W: land.LAND_W, H: land.LAND_H };
	if (!host.value) return;

	ro = new ResizeObserver(resize);
	ro.observe(host.value);
	resize();

	$fetch('/api/served-from')
		.then(({ region }) => {
			const r = REGIONS.find((x) => x.id === region);
			served.value = r
				? { id: r.id, label: `${r.code} · ${r.aws} · ${r.city}` }
				: region === 'dev'
					? { id: null, label: 'Local dev server' }
					: { id: null, label: region.toUpperCase() };
			frame(performance.now());
		})
		.catch(() => {});

	if (reduce) return;
	io = new IntersectionObserver(([entry]) => {
		running = entry.isIntersecting;
		cancelAnimationFrame(raf);
		if (running) raf = requestAnimationFrame(loop);
	});
	io.observe(host.value);
});

onBeforeUnmount(() => {
	running = false;
	cancelAnimationFrame(raf);
	io?.disconnect();
	ro?.disconnect();
});
</script>

<style scoped>
.usmap {
	height: clamp(260px, 34vw, 480px);
}

.usmap canvas {
	display: block;
}

.usmap-readout {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 0.5rem;
	padding-top: 1rem;
	padding-bottom: 0.5rem;
	border-bottom: 1px solid var(--border);
}

.usmap-dot {
	width: 6px;
	height: 6px;
	background: #3ddc84;
}
</style>
