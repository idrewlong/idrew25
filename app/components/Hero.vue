<template>
	<section ref="root" class="hero">
		<!-- ASCII globe (decorative). Fades in once the scene has drawn. -->
		<div
			ref="canvasHost"
			class="hero-canvas"
			:class="{ 'is-ready': sceneReady }"
			aria-hidden="true"
		></div>
		<div class="hero-vignette" aria-hidden="true"></div>

		<div class="hero-inner">
			<!-- Info rail -->
			<div class="hero-rail">
				<div class="hero-cell">
					<span class="readout !text-[var(--text)]">Andrew Long</span>
					<span class="readout">Senior full stack dev</span>
				</div>
				<div class="hero-cell hidden sm:flex">
					<span class="readout !text-[var(--text)]">Long Beach, MS</span>
					<span class="readout">30.35°N · 89.15°W</span>
				</div>
				<div class="hero-cell hidden lg:flex">
					<span class="readout !text-[var(--text)]">Web · Mobile · Cloud</span>
					<span class="readout">TypeScript · Go · AWS</span>
				</div>
				<div class="hero-cell items-end text-right">
					<span class="readout">Local time</span>
					<span class="readout !text-[var(--text)] tabular-nums">{{ localTime }}</span>
				</div>
			</div>

			<div class="hero-main">
				<!-- Headline -->
				<div class="hero-copy">
					<p class="readout hero-status">
						<span class="hero-mark" aria-hidden="true"></span>
						<span class="hidden sm:inline">[ 00 ] · </span>Software · Platform · DevOps · AI
					</p>
					<h1 class="display hero-title">
						<span class="block">I build</span>
						<span class="block outline">reliable</span>
						<span class="block hero-typed"
							><span class="typewriter">{{ currentWord }}</span></span
						>
					</h1>
				</div>

				<!-- Brief panel -->
				<div class="hero-panel">
					<span class="hero-tick hero-tick--tl" aria-hidden="true">+</span>
					<span class="hero-tick hero-tick--br" aria-hidden="true">+</span>
					<p class="hero-description">
						Go by choice. TypeScript by trade. AWS by necessity. Senior full
						stack developer at Mad Genius, where I own AI tooling, web apps,
						headless sites, infra and more.
					</p>
					<div class="hero-buttons">
						<NuxtLink to="/contact" class="btn btn-solid">
							<span>Get in touch</span>
							<Icon
								name="heroicons:arrow-up-right-20-solid"
								class="w-4 h-4"
								:aria-hidden="true"
							/>
						</NuxtLink>
						<a
							href="#projects"
							class="btn btn-ghost"
							@click.prevent="scrollTo('projects')"
						>
							<span>See the work</span>
							<Icon
								name="heroicons:arrow-down-20-solid"
								class="w-4 h-4"
								:aria-hidden="true"
							/>
						</a>
					</div>
				</div>
			</div>

			<!-- Bottom rail -->
			<div class="hero-foot readout" aria-hidden="true">
				<span class="hidden sm:inline">Full stack developer — {{ year }}</span>
				<span v-if="iss" class="hero-telemetry">
					<span class="hero-live"></span>
					<span class="!text-[var(--text)]">ISS</span>
					<span class="tabular-nums">{{ iss }}</span>
				</span>
				<span class="hidden md:inline">
					<span class="hero-drag-hint">Drag to explore</span>
					<template v-if="iss"> · Live orbits · CelesTrak</template>
				</span>

			</div>
		</div>
	</section>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { onPageLeft } from '~/composables/usePageLeave';

const { $scroll } = useNuxtApp();

const root = ref(null);
const canvasHost = ref(null);
const sceneReady = ref(false);
const year = new Date().getFullYear();

const words = ['apps', 'AI agents', 'APIs', 'infrastructure', 'pipelines', 'platforms'];
const currentWord = ref('');

let reduceMotion = false;
const preloading = useState('preloader', () => false);

/* ── Local time (Long Beach, MS) ─────────────────────── */
const timeFmt = new Intl.DateTimeFormat('en-US', {
	timeZone: 'America/Chicago',
	hour: '2-digit',
	minute: '2-digit',
	hour12: false,
});
const localTime = ref('--:--');
let clockTimer = null;
const tickClock = () => {
	localTime.value = `${timeFmt.format(new Date())} CT`;
};

/* ── Typewriter ───────────────────────────────────────── */
let typewriterTimeout = null;
let wordIdx = 0;
let letterIndex = 0;
let isDeleting = false;

const typewriterEffect = () => {
	const target = words[wordIdx];
	let newWord = '';
	let delay = 100;

	if (isDeleting) {
		newWord = target.substring(0, letterIndex - 1);
		letterIndex--;
		delay = 100;
	} else {
		newWord = target.substring(0, letterIndex + 1);
		letterIndex++;
		delay = 75;
	}

	currentWord.value = newWord;

	if (!isDeleting && newWord === target) {
		isDeleting = true;
		delay = 2500;
	} else if (isDeleting && newWord === '') {
		isDeleting = false;
		wordIdx = (wordIdx + 1) % words.length;
		letterIndex = 0;
		delay = 500;
	}

	typewriterTimeout = setTimeout(typewriterEffect, delay);
};

const startTypewriter = () => {
	if (disposed) return;
	if (reduceMotion) {
		// Hold a single word rather than typing on a loop
		currentWord.value = words[0];
		return;
	}
	typewriterEffect();
};

/* ── Navigation ──────────────────────────────────────── */
/* Header offset + easing live in plugins/lenis.client.ts. */
const scrollTo = (id) => {
	const el = document.getElementById(id);
	if (!el) return;
	$scroll.to(el);
};

/* ── Live satellites ─────────────────────────────────── */
// Positions come from /api/satellites (CelesTrak TLEs, cached server-side).
// If it fails the globe keeps its decorative orbits.
const iss = ref('');

const formatLatLon = (lat, lon) =>
	`${Math.abs(lat).toFixed(1)}°${lat >= 0 ? 'N' : 'S'} ${Math.abs(lon).toFixed(1)}°${lon >= 0 ? 'E' : 'W'}`;

async function loadSatellites() {
	try {
		const data = await $fetch('/api/satellites');
		if (!scene || disposed) return;
		scene.onTelemetry = (sats) => {
			const s = sats.find((x) => x.label === 'ISS');
			iss.value = s ? `${formatLatLon(s.lat, s.lon)} · ${Math.round(s.altKm)} km` : '';
		};
		scene.setSatellites(data.featured, data.swarm);
	} catch {
		// Leave the decorative orbits in place
	}
}

/* ── Globe scene ─────────────────────────────────────── */
let scene = null;
let io = null;
let disposed = false;

const onVisibility = () => {
	if (!scene) return;
	document.hidden ? scene.stop() : scene.start();
};

function webglAvailable() {
	try {
		const c = document.createElement('canvas');
		return !!(c.getContext('webgl2') || c.getContext('webgl'));
	} catch {
		return false;
	}
}

async function mountScene() {
	if (!webglAvailable()) return;
	// Loaded after mount so three never sits in the initial bundle
	const { GlobeScene } = await import('~/scenes/GlobeScene');
	if (disposed || !canvasHost.value) return;
	scene = new GlobeScene(canvasHost.value);
	scene.reduceMotion = reduceMotion;
	sceneReady.value = true;
	loadSatellites();

	// Only animate while the hero is on screen
	io = new IntersectionObserver(([entry]) => {
		entry.isIntersecting ? scene.start() : scene.stop();
	});
	io.observe(root.value);
	document.addEventListener('visibilitychange', onVisibility);
}

onMounted(() => {
	reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	tickClock();
	clockTimer = setInterval(tickClock, 15000);
	// Type only once the preloader has gone, so visitors see it from the first word
	if (preloading.value) watch(preloading, startTypewriter, { once: true });
	else startTypewriter();
	mountScene();
});

onPageLeft(() => {
	disposed = true;
	if (typewriterTimeout) clearTimeout(typewriterTimeout);
	clearInterval(clockTimer);
	io?.disconnect();
	document.removeEventListener('visibilitychange', onVisibility);
	scene?.dispose();
	scene = null;
});
</script>

<style scoped>
.hero {
	position: relative;
	overflow: hidden;
	border-bottom: 1px solid var(--border);
	background: var(--bg);
}

.hero-canvas {
	position: absolute;
	inset: 0;
	opacity: 0;
	transition: opacity 1.2s ease;
}

.hero-canvas.is-ready {
	opacity: 0.6;
}

/* Full strength once the globe has its own side of the screen */
@media (min-width: 768px) {
	.hero-canvas.is-ready {
		opacity: 1;
	}
}

/* Darken the left/bottom so the headline always reads over the globe */
.hero-vignette {
	position: absolute;
	inset: 0;
	pointer-events: none;
	background:
		linear-gradient(to top, var(--bg) 0%, transparent 35%),
		linear-gradient(to right, rgba(10, 11, 12, 0.85) 0%, transparent 55%);
}

/* Full-bleed with the same gutters and 1600px cap as `.wrap`.
   Lets drags fall through to the globe canvas underneath; anything you
   click or read closely opts back in. */
.hero-inner {
	position: relative;
	z-index: 2;
	pointer-events: none;
	width: 100%;
	max-width: 100rem;
	margin-inline: auto;
	padding-inline: 1rem;
	display: flex;
	flex-direction: column;
	min-height: calc(100svh - 56px);
	padding-top: 1.25rem;
	padding-bottom: 1.5rem;
}

@media (min-width: 480px) {
	.hero-inner {
		min-height: calc(100svh - 64px);
		padding-inline: 1.5rem;
	}
}

@media (min-width: 976px) {
	.hero-inner {
		padding-inline: 2.5rem;
	}
}

/* ── Info rail ── */
.hero-rail {
	display: grid;
	grid-template-columns: 1fr auto;
	gap: 1rem;
	padding-bottom: 0.9rem;
	border-bottom: 1px solid var(--border);
}

@media (min-width: 640px) {
	.hero-rail {
		grid-template-columns: 1fr 1fr auto;
	}
}

@media (min-width: 976px) {
	.hero-rail {
		grid-template-columns: 1fr 1fr 1fr auto;
	}
}

.hero-cell {
	display: flex;
	flex-direction: column;
	gap: 0.3rem;
}

/* ── Main ── */
.hero-main {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	gap: 2rem;
	padding-top: 40vh;
	padding-bottom: 2rem;
}

@media (min-width: 768px) {
	.hero-main {
		flex-direction: row;
		align-items: flex-end;
		justify-content: space-between;
		padding-top: 6rem;
	}
}

.hero-status {
	display: inline-flex;
	align-items: center;
	gap: 0.6rem;
	margin-bottom: 1.25rem;
}

/* Same pulsing square as the availability lines in About and Contact */
.hero-mark {
	width: 6px;
	height: 6px;
	background: var(--accent);
	animation: hero-mark 2.4s ease-in-out infinite;
}

@keyframes hero-mark {
	50% {
		opacity: 0.35;
	}
}

.hero-live {
	width: 6px;
	height: 6px;
	background: #3ddc84;
	animation: live 2s ease-in-out infinite;
}

@keyframes live {
	50% {
		opacity: 0.25;
	}
}

.hero-title {
	font-size: clamp(4.5rem, 24vw, 9rem);
	font-weight: 900;
}

@media (min-width: 768px) {
	.hero-title {
		font-size: clamp(5rem, 10vw, 9.5rem);
	}
}

.hero-typed {
	/* "infrastructure" is ~6.3em wide at full size; 0.6em keeps it in the column down to 375px */
	font-size: 0.6em;
	line-height: 1.1;
	margin-top: 0.15em;
	color: var(--accent);
	min-height: 1.1em;
	white-space: nowrap;
}

.typewriter {
	border-right: 0.08em solid var(--accent);
	padding-right: 0.04em;
	animation: blink 0.75s step-end infinite;
}

@keyframes blink {
	from,
	to {
		border-color: transparent;
	}
	50% {
		border-color: var(--accent);
	}
}

/* ── Panel ── */
.hero-panel {
	position: relative;
	max-width: 30rem;
	padding: 1.5rem;
	border: 1px solid var(--border);
	background: rgba(10, 11, 12, 0.72);
	backdrop-filter: blur(6px);
	-webkit-backdrop-filter: blur(6px);
}

.hero-tick {
	position: absolute;
	font-family: 'Geist Mono', monospace;
	font-size: 12px;
	line-height: 1;
	color: var(--accent);
}
.hero-tick--tl { top: -7px; left: -4px; }
.hero-tick--br { bottom: -7px; right: -4px; }

.hero-description {
	font-size: 0.9375rem;
	line-height: 1.65;
	color: var(--text-muted);
}

.hero-buttons {
	display: flex;
	flex-direction: column;
	gap: 0.6rem;
	margin-top: 1.5rem;
}

.hero-buttons .btn {
	white-space: nowrap;
}

@media (min-width: 480px) {
	.hero-buttons {
		flex-direction: row;
	}
}

.hero-foot {
	display: flex;
	justify-content: space-between;
	gap: 1rem;
	padding-top: 0.9rem;
	border-top: 1px solid var(--border);
}

.hero-inner :is(a, button, .hero-panel, .hero-rail) {
	pointer-events: auto;
}

.hero-drag-hint {
	color: var(--text);
}

.hero-telemetry {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
}

@media (prefers-reduced-motion: reduce) {
	.typewriter,
	.hero-live,
	.hero-mark {
		animation: none;
	}

	.hero-canvas {
		transition: none;
	}
}
</style>
