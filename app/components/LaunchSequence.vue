<template>
	<section ref="root" class="launch" aria-label="Plan, build, ship">
		<div ref="stage" class="launch-stage">
			<!-- Canvas mounts here; the ASCII art is the fallback and first paint -->
			<div ref="canvasHost" class="launch-canvas" aria-hidden="true">
				<pre v-if="!sceneReady" class="launch-fallback">{{ fallbackArt }}</pre>
			</div>

			<div class="launch-hud wrap">
				<!-- Top rail -->
				<div class="launch-rail">
					<span class="readout !text-[var(--accent)]">Launch sequence</span>
					<span class="readout hidden sm:inline">30.35°N 89.15°W</span>
					<span class="readout tabular-nums !text-[var(--text)]">{{ clock }}</span>
				</div>

				<!-- Stages -->
				<ol class="launch-stages">
					<li
						v-for="(s, i) in stages"
						:key="s.word"
						class="launch-step"
						:class="{ 'is-active': activeStage === i, 'is-done': activeStage > i }"
					>
						<span class="readout">0{{ i + 1 }}</span>
						<span class="launch-word">{{ s.word }}</span>
						<span class="launch-line">{{ s.line }}</span>
					</li>
				</ol>

				<!-- Bottom telemetry -->
				<div class="launch-telemetry">
					<div>
						<span class="readout">Altitude</span>
						<span class="launch-num tabular-nums">{{ altitude }}<small>km</small></span>
					</div>
					<div>
						<span class="readout">Velocity</span>
						<span class="launch-num tabular-nums">{{ velocity }}<small>m/s</small></span>
					</div>
					<div class="hidden sm:block">
						<span class="readout">Status</span>
						<span class="launch-num launch-status">{{ status }}</span>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { onPageLeft } from '~/composables/usePageLeave';

const { $gsap, $ScrollTrigger } = useNuxtApp();

const root = ref(null);
const stage = ref(null);
const canvasHost = ref(null);
const sceneReady = ref(false);
const progress = ref(0);

// Stage lines are the step titles from the Process page.
const stages = [
	{ word: 'Plan', line: 'Understand the problem first' },
	{ word: 'Build', line: 'Build with intention' },
	{ word: 'Ship', line: 'Iterate and refine' },
];

// Plan: on the pad · Build: ascent and staging · Ship: fairing sep and deploy
const activeStage = computed(() =>
	progress.value < 0.2 ? 0 : progress.value < 0.78 ? 1 : 2
);

// Decorative telemetry, derived from scroll progress (matches RocketScene's timeline)
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const clock = computed(() => {
	const t = Math.round((progress.value - 0.2) * 600);
	const sign = t < 0 ? 'T−' : 'T+';
	const s = Math.abs(t);
	return `${sign}00:${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
});
const altitude = computed(() => {
	const p = progress.value;
	const stage1 = clamp01((p - 0.2) / 0.4) ** 2 * 80; // ~80 km at MECO
	const stage2 = clamp01((p - 0.6) / 0.4) * 470; // to ~550 km
	return (stage1 + stage2).toFixed(1);
});
const velocity = computed(() => {
	const p = progress.value;
	const v = p < 0.6 ? clamp01((p - 0.2) / 0.4) * 2300 : 2300 + clamp01((p - 0.6) / 0.3) * 5300;
	return Math.round(v).toString();
});
const PHASES = [
	[0.1, 'Hold'],
	[0.2, 'Ignition'],
	[0.3, 'Liftoff'],
	[0.6, 'Ascent'],
	[0.66, 'Stage sep'],
	[0.78, 'Second stage'],
	[0.86, 'Fairing sep'],
	[0.96, 'Deploy'],
	[Infinity, 'Orbit'],
];
const status = computed(() => PHASES.find(([end]) => progress.value < end)[1]);

const fallbackArt = String.raw`
          /\
         /  \
        |    |
        | ID |
        |    |
        |    |
       /| |  |\
      / | |  | \
     /__|____|__\
        /_\/_\
       ' ' ' ' '
      ' ' ' ' ' '
`;

let scene = null;
let mm;
let io;

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

onMounted(() => {
	const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	// Load three only when the section gets close to the viewport
	io = new IntersectionObserver(
		async (entries) => {
			const visible = entries[0].isIntersecting;
			if (visible && !scene && webglAvailable()) {
				const { RocketScene } = await import('~/scenes/RocketScene');
				if (!canvasHost.value) return;
				scene = new RocketScene(canvasHost.value);
				scene.reduceMotion = reduce;
				scene.progress = progress.value;
				sceneReady.value = true;
			}
			if (!scene) return;
			visible ? scene.start() : scene.stop();
		},
		{ rootMargin: '200px 0px' }
	);
	io.observe(root.value);
	document.addEventListener('visibilitychange', onVisibility);

	mm = $gsap.matchMedia(root.value);
	mm.add('(prefers-reduced-motion: no-preference)', () => {
		$ScrollTrigger.create({
			trigger: root.value,
			start: 'top top',
			end: '+=420%',
			pin: stage.value,
			scrub: true,
			onUpdate: (self) => {
				progress.value = self.progress;
				if (scene) scene.progress = self.progress;
			},
		});
	});
	mm.add('(prefers-reduced-motion: reduce)', () => {
		// No pinning or launch: hold a single frame mid-ignition
		progress.value = 0.3;
	});
});

onPageLeft(() => {
	mm?.revert();
	io?.disconnect();
	document.removeEventListener('visibilitychange', onVisibility);
	scene?.dispose();
	scene = null;
});
</script>

<style scoped>
.launch {
	position: relative;
	border-block: 1px solid var(--border);
	background: #050506;
}

.launch-stage {
	position: relative;
	height: 100svh;
	min-height: 560px;
	overflow: hidden;
}

.launch-canvas {
	position: absolute;
	inset: 0;
	display: flex;
	align-items: center;
	justify-content: center;
}

.launch-canvas :deep(canvas) {
	display: block;
}

.launch-fallback {
	font-family: 'Geist Mono', monospace;
	font-size: 14px;
	line-height: 1.1;
	color: var(--text-muted);
}

.launch-hud {
	position: relative;
	z-index: 2;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	padding-top: 5.5rem;
	padding-bottom: 2rem;
	pointer-events: none;
}

.launch-rail {
	display: flex;
	justify-content: space-between;
	gap: 1rem;
	padding-bottom: 0.75rem;
	border-bottom: 1px solid var(--border);
}

.launch-stages {
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
	max-width: 28rem;
}

/* Phones: stages sit under the rail, leaving the lower half to the rocket */
@media (max-width: 767px) {
	.launch-stages {
		margin-top: 1.25rem;
		margin-bottom: auto;
	}

	.launch-word {
		font-size: 2.75rem;
	}
}

.launch-step {
	display: grid;
	grid-template-columns: 2rem auto;
	align-items: baseline;
	column-gap: 0.75rem;
}

.launch-word {
	font-family: var(--font-display);
	font-weight: 800;
	text-transform: uppercase;
	font-size: clamp(3rem, 9vw, 6.5rem);
	line-height: 0.9;
	color: transparent;
	/* Steps not running are dimmed with a muted outline rather than opacity,
	   so their numbers and words keep readable contrast */
	-webkit-text-stroke: 1px var(--text-muted);
	transition:
		color 0.4s ease,
		-webkit-text-stroke-color 0.4s ease;
}

.launch-step.is-active .launch-word {
	color: var(--text);
	-webkit-text-stroke-color: var(--text);
}

.launch-step.is-active .readout {
	color: var(--accent);
}

.launch-line {
	grid-column: 2;
	margin-top: 0.4rem;
	font-family: 'Geist Mono', monospace;
	font-size: 11px;
	letter-spacing: 0.15em;
	text-transform: uppercase;
	color: var(--text-muted);
	max-height: 0;
	overflow: hidden;
	transition: max-height 0.4s ease;
}

.launch-step.is-active .launch-line {
	max-height: 2em;
}

.launch-telemetry {
	display: flex;
	gap: 2.5rem;
	padding-top: 0.75rem;
	border-top: 1px solid var(--border);
}

.launch-telemetry > div {
	display: flex;
	flex-direction: column;
	gap: 0.3rem;
}

.launch-num {
	font-family: var(--font-display);
	font-weight: 700;
	font-size: 1.75rem;
	line-height: 1;
	color: var(--text);
}

.launch-num small {
	margin-left: 0.25rem;
	font-family: 'Geist Mono', monospace;
	font-size: 10px;
	color: var(--text-muted);
}

.launch-status {
	text-transform: uppercase;
	color: var(--accent);
}

@media (prefers-reduced-motion: reduce) {
	.launch-step,
	.launch-word,
	.launch-line {
		transition: none;
	}
}
</style>
