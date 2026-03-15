<template>
	<Teleport to="body">
		<div
			v-if="visible"
			ref="preloaderEl"
			class="preloader"
			aria-label="Loading"
			role="progressbar"
		>
			<!-- Grain -->
			<div class="preloader-grain" aria-hidden="true"></div>

			<!-- Grid lines background -->
			<div class="grid-lines" aria-hidden="true">
				<div
					v-for="i in verticalCount"
					:key="'v' + i"
					ref="vLines"
					class="grid-line vertical"
					:style="{ left: (i / (verticalCount + 1)) * 100 + '%' }"
				></div>
				<div
					v-for="i in horizontalCount"
					:key="'h' + i"
					ref="hLines"
					class="grid-line horizontal"
					:style="{ top: (i / (horizontalCount + 1)) * 100 + '%' }"
				></div>
			</div>

			<!-- Grid labels at intersections -->
			<div class="grid-labels" aria-hidden="true">
				<span
					v-for="(label, idx) in gridLabels"
					:key="idx"
					ref="labelEls"
					class="grid-label"
					:style="{ top: label.y + '%', left: label.x + '%' }"
				>
					{{ label.text }}
				</span>
			</div>

			<!-- Stacked words (foreground) -->
			<div ref="wordsWrap" class="words-wrap">
				<div
					v-for="(word, idx) in words"
					:key="idx"
					ref="wordEls"
					class="word-row"
				>
					<span class="word-index hidden sm:inline">{{
						String(idx + 1).padStart(2, '0')
					}}</span>
					<span class="word-text" :ref="(el) => (textEls[idx] = el)">{{
						word
					}}</span>
				</div>
			</div>

			<!-- Bottom line -->
			<div ref="bottomLine" class="bottom-line">
				<span class="bottom-dash"></span>
				<span ref="bottomLabel" class="bottom-label">Andrew Long</span>
				<span class="bottom-dash"></span>
			</div>
		</div>
	</Teleport>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';

const emit = defineEmits(['done']);
const { $gsap } = useNuxtApp();

const visible = ref(true);
const preloaderEl = ref(null);
const wordsWrap = ref(null);
const wordEls = ref([]);
const textEls = ref([]);
const bottomLine = ref(null);
const bottomLabel = ref(null);

// Grid refs
const vLines = ref([]);
const hLines = ref([]);
const labelEls = ref([]);

const words = ['Plan', 'Build', 'Ship'];
const verticalCount = 5;
const horizontalCount = 4;

const gridLabels = [
	{ text: 'PHP', x: 16.67, y: 20 },
	{ text: 'Go', x: 50, y: 20 },
	{ text: '2026', x: 83.33, y: 20 },
	{ text: 'React', x: 33.33, y: 40 },
	{ text: 'Svelte', x: 66.67, y: 40 },
	{ text: 'Typescript', x: 16.67, y: 60 },
	{ text: 'Vue', x: 83.33, y: 60 },
];

function sortFromCenter(els) {
	const mid = (els.length - 1) / 2;
	return [...els].sort(
		(a, b) => Math.abs(els.indexOf(a) - mid) - Math.abs(els.indexOf(b) - mid)
	);
}

onMounted(() => {
	nextTick(() => {
		if (!preloaderEl.value) return;

		// Force preloader to exact visual viewport width (fixes mobile viewport expansion)
		const vw = window.innerWidth;
		preloaderEl.value.style.width = vw + 'px';
		preloaderEl.value.style.maxWidth = vw + 'px';

		// --- Grid initial states ---
		vLines.value.forEach((el) => {
			$gsap.set(el, { scaleY: 0, transformOrigin: 'top center' });
		});
		hLines.value.forEach((el) => {
			$gsap.set(el, { scaleX: 0, transformOrigin: 'left center' });
		});
		labelEls.value.forEach((el) => {
			$gsap.set(el, { opacity: 0, scale: 0.8 });
		});

		// --- Word initial states ---
		wordEls.value.forEach((el, i) => {
			const dir = i % 2 === 0 ? -120 : 120;
			$gsap.set(el, { xPercent: dir, opacity: 0 });
		});
		$gsap.set(bottomLine.value, { opacity: 0, scaleX: 0 });
		$gsap.set(bottomLabel.value, { opacity: 0 });

		const tl = $gsap.timeline({
			delay: 0.2,
			onComplete: exitAnimation,
		});

		// ── Phase 1: Grid draws in ──
		const vOrder = sortFromCenter(vLines.value);
		tl.to(vOrder, {
			scaleY: 1,
			duration: 0.55,
			stagger: 0.06,
			ease: 'power2.out',
		});

		const hOrder = sortFromCenter(hLines.value);
		tl.to(
			hOrder,
			{
				scaleX: 1,
				duration: 0.45,
				stagger: 0.05,
				ease: 'power2.out',
			},
			'-=0.3'
		);

		// Grid labels pop in
		tl.to(
			labelEls.value,
			{
				opacity: 1,
				scale: 1,
				duration: 0.25,
				stagger: 0.03,
				ease: 'back.out(2)',
			},
			'-=0.15'
		);

		// ── Phase 2: Words slide in over the grid ──
		wordEls.value.forEach((el, i) => {
			tl.to(
				el,
				{
					xPercent: 0,
					opacity: 1,
					duration: 0.7,
					ease: 'power3.out',
				},
				i === 0 ? '-=0.1' : '-=0.4'
			);
		});

		// Bottom line reveals
		tl.to(
			bottomLine.value,
			{
				opacity: 1,
				scaleX: 1,
				duration: 0.5,
				ease: 'power2.out',
			},
			'-=0.2'
		);

		tl.to(
			bottomLabel.value,
			{
				opacity: 1,
				duration: 0.4,
				ease: 'power2.out',
			},
			'-=0.25'
		);

		// ── Phase 3: Grid fades back as words go orange ──
		// Grid dims down
		tl.to(
			[...vLines.value, ...hLines.value],
			{
				opacity: 0.15,
				duration: 0.6,
				ease: 'power1.inOut',
			},
			'-=0.1'
		);

		tl.to(
			labelEls.value,
			{
				opacity: 0,
				duration: 0.4,
				ease: 'power1.in',
			},
			'<'
		);

		// Words go orange
		textEls.value.forEach((el, i) => {
			tl.to(
				el,
				{
					color: '#f97316',
					duration: 0.5,
					ease: 'sine.inOut',
				},
				i === 0 ? '<' : '>-0.2'
			);
		});

		// Hold
		tl.to({}, { duration: 0.4 });

		// ── Phase 4: Words compress together ──
		tl.to(wordEls.value, {
			y: (i) => {
				const center = (words.length - 1) / 2;
				return (center - i) * 48;
			},
			opacity: 0,
			scale: 0.85,
			duration: 0.6,
			stagger: 0.04,
			ease: 'power3.in',
		});

		// Grid lines collapse simultaneously
		tl.to(
			vLines.value,
			{
				scaleY: 0,
				transformOrigin: 'center center',
				duration: 0.4,
				stagger: 0.03,
				ease: 'power2.in',
			},
			'-=0.5'
		);

		tl.to(
			hLines.value,
			{
				scaleX: 0,
				transformOrigin: 'center center',
				duration: 0.4,
				stagger: 0.03,
				ease: 'power2.in',
			},
			'<'
		);

		// Hold
		tl.to({}, { duration: 0.2 });
	});
});

function exitAnimation() {
	const tl = $gsap.timeline({
		onComplete: () => {
			visible.value = false;
			emit('done');
		},
	});

	tl.to(bottomLine.value, {
		opacity: 0,
		y: -20,
		duration: 0.3,
		ease: 'power2.in',
	});

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
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 99999;
	display: grid;
	place-items: center;
	background: var(--bg);
	overflow: hidden;
	margin: 0;
	padding: 0;
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

/* ── Grid background ── */
.grid-lines {
	position: absolute;
	inset: 0;
	z-index: 1;
	pointer-events: none;
}

.grid-line {
	position: absolute;
	background: var(--border);
}

.grid-line.vertical {
	width: 1px;
	top: 0;
	bottom: 0;
	transform: scaleY(0);
	transform-origin: top center;
}

.grid-line.horizontal {
	height: 1px;
	left: 0;
	right: 0;
	transform: scaleX(0);
	transform-origin: left center;
}

.grid-labels {
	position: absolute;
	inset: 0;
	z-index: 2;
	pointer-events: none;
}

.grid-label {
	position: absolute;
	opacity: 0;
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

/* ── Foreground words ── */
.words-wrap {
	position: relative;
	z-index: 3;
	text-align: center;
}

.word-row {
	display: block;
	text-align: center;
	position: relative;
	will-change: transform, opacity;
	opacity: 0;
}

.word-index {
	position: absolute;
	right: calc(50% + clamp(4rem, 11vw, 7.5rem));
	top: 50%;
	transform: translateY(-50%);
	font-family: 'Geist Mono', monospace;
	font-size: 10px;
	letter-spacing: 0.15em;
	color: var(--text-muted);
	opacity: 0.4;
}

.word-text {
	font-family: 'Instrument Serif', Georgia, serif;
	font-size: clamp(3.5rem, 12vw, 8rem);
	font-style: italic;
	color: var(--text);
	line-height: 1.05;
	letter-spacing: -0.03em;
	will-change: color;
	display: inline-block;
}

/* ── Bottom line ── */
.bottom-line {
	position: absolute;
	bottom: 15%;
	left: 50%;
	transform: translateX(-50%);
	display: flex;
	align-items: center;
	gap: 1rem;
	z-index: 4;
	transform-origin: center;
	opacity: 0;
}

.bottom-dash {
	width: 32px;
	height: 1px;
	background: var(--border);
}

.bottom-label {
	font-family: 'Geist Mono', monospace;
	font-size: 9px;
	letter-spacing: 0.25em;
	text-transform: uppercase;
	color: var(--text-muted);
}
</style>
