<template>
	<div
		v-if="visible"
		ref="preloaderEl"
		class="preloader"
		aria-label="Loading"
		role="progressbar"
	>
		<!-- Grain -->
		<div class="preloader-grain" aria-hidden="true"></div>

		<!-- Grid lines — vertical -->
		<div class="grid-lines" aria-hidden="true">
			<div
				v-for="i in verticalCount"
				:key="'v' + i"
				ref="vLines"
				class="grid-line vertical"
				:style="{ left: (i / (verticalCount + 1)) * 100 + '%' }"
			></div>

			<!-- Horizontal lines -->
			<div
				v-for="i in horizontalCount"
				:key="'h' + i"
				ref="hLines"
				class="grid-line horizontal"
				:style="{ top: (i / (horizontalCount + 1)) * 100 + '%' }"
			></div>
		</div>

		<!-- Labels at intersections -->
		<div class="grid-labels" aria-hidden="true">
			<span
				v-for="(label, idx) in labels"
				:key="idx"
				ref="labelEls"
				class="grid-label"
				:style="{ top: label.y + '%', left: label.x + '%' }"
			>
				{{ label.text }}
			</span>
		</div>

		<!-- Center year -->
		<div ref="centerMark" class="center-mark">
			<span class="center-year">2026</span>
			<span class="center-dot"></span>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';

const emit = defineEmits(['done']);
const { $gsap } = useNuxtApp();

const visible = ref(true);
const preloaderEl = ref(null);
const vLines = ref([]);
const hLines = ref([]);
const labelEls = ref([]);
const centerMark = ref(null);

const verticalCount = 5;
const horizontalCount = 4;

const labels = [
	{ text: 'Portfolio', x: 16.67, y: 20 },
	{ text: 'Full Stack', x: 50, y: 20 },
	{ text: '2026', x: 83.33, y: 20 },
	{ text: 'React', x: 33.33, y: 40 },
	{ text: 'Nuxt', x: 66.67, y: 40 },
	{ text: 'Design', x: 16.67, y: 60 },
	{ text: 'Build', x: 50, y: 60 },
	{ text: 'Ship', x: 83.33, y: 60 },
	{ text: 'Andrew Long', x: 33.33, y: 80 },
	{ text: 'SEO', x: 66.67, y: 80 },
];

onMounted(() => {
	nextTick(() => {
		if (!preloaderEl.value) return;

		// Initial states
		vLines.value.forEach((el) => {
			$gsap.set(el, { scaleY: 0, transformOrigin: 'top center' });
		});
		hLines.value.forEach((el) => {
			$gsap.set(el, { scaleX: 0, transformOrigin: 'left center' });
		});
		labelEls.value.forEach((el) => {
			$gsap.set(el, { opacity: 0, scale: 0.8 });
		});
		$gsap.set(centerMark.value, { opacity: 0, scale: 0.5 });

		const tl = $gsap.timeline({
			delay: 0.25,
			onComplete: () => holdThenExit(),
		});

		// 1. Vertical lines draw down — staggered from center outward
		const vOrder = sortFromCenter(vLines.value);
		tl.to(vOrder, {
			scaleY: 1,
			duration: 0.6,
			stagger: 0.07,
			ease: 'power2.out',
		});

		// 2. Horizontal lines draw across — staggered from center outward
		const hOrder = sortFromCenter(hLines.value);
		tl.to(
			hOrder,
			{
				scaleX: 1,
				duration: 0.5,
				stagger: 0.06,
				ease: 'power2.out',
			},
			'-=0.35'
		);

		// 3. Labels pop in at intersections
		tl.to(
			labelEls.value,
			{
				opacity: 1,
				scale: 1,
				duration: 0.3,
				stagger: 0.04,
				ease: 'back.out(2)',
			},
			'-=0.2'
		);

		// 4. Center mark
		tl.to(
			centerMark.value,
			{
				opacity: 1,
				scale: 1,
				duration: 0.4,
				ease: 'back.out(2.5)',
			},
			'-=0.15'
		);

		// 5. Hold
		tl.to({}, { duration: 0.5 });
	});
});

function sortFromCenter(els) {
	const mid = (els.length - 1) / 2;
	return [...els].sort(
		(a, b) =>
			Math.abs(els.indexOf(a) - mid) - Math.abs(els.indexOf(b) - mid)
	);
}

function holdThenExit() {
	const tl = $gsap.timeline({
		onComplete: () => {
			visible.value = false;
			emit('done');
		},
	});

	// Labels fly to center and fade
	tl.to(labelEls.value, {
		opacity: 0,
		scale: 0.6,
		duration: 0.35,
		stagger: 0.02,
		ease: 'power2.in',
	});

	// Lines collapse
	tl.to(
		vLines.value,
		{
			scaleY: 0,
			transformOrigin: 'center center',
			duration: 0.4,
			stagger: 0.04,
			ease: 'power2.in',
		},
		'-=0.2'
	);

	tl.to(
		hLines.value,
		{
			scaleX: 0,
			transformOrigin: 'center center',
			duration: 0.4,
			stagger: 0.04,
			ease: 'power2.in',
		},
		'<'
	);

	tl.to(
		centerMark.value,
		{
			opacity: 0,
			scale: 0.3,
			duration: 0.3,
			ease: 'power2.in',
		},
		'-=0.25'
	);

	// Wipe up
	tl.to(preloaderEl.value, {
		yPercent: -100,
		duration: 0.65,
		ease: 'power3.inOut',
	});
}
</script>

<style scoped>
.preloader {
	position: fixed;
	inset: 0;
	z-index: 99999;
	display: flex;
	align-items: center;
	justify-content: center;
	background: var(--bg);
	will-change: transform;
	overflow: hidden;
}

.preloader-grain {
	position: absolute;
	inset: 0;
	opacity: 0.03;
	background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
	background-size: 128px 128px;
	pointer-events: none;
	z-index: 0;
}

.grid-lines {
	position: absolute;
	inset: 0;
	z-index: 1;
}

.grid-line {
	position: absolute;
	background: var(--border);
}

.grid-line.vertical {
	width: 1px;
	top: 0;
	bottom: 0;
}

.grid-line.horizontal {
	height: 1px;
	left: 0;
	right: 0;
}

.grid-labels {
	position: absolute;
	inset: 0;
	z-index: 2;
}

.grid-label {
	position: absolute;
	transform: translate(-50%, -50%);
	font-family: 'Geist Mono', monospace;
	font-size: 9px;
	letter-spacing: 0.2em;
	text-transform: uppercase;
	color: var(--text-muted);
	white-space: nowrap;
	padding: 4px 10px;
	background: var(--bg);
}

.center-mark {
	position: relative;
	z-index: 3;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.5rem;
}

.center-year {
	font-family: 'Instrument Serif', Georgia, serif;
	font-style: italic;
	font-size: clamp(2.5rem, 6vw, 4rem);
	color: var(--text);
	line-height: 1;
	letter-spacing: -0.02em;
}

.center-dot {
	width: 6px;
	height: 6px;
	border-radius: 50%;
	background: var(--accent);
}
</style>
