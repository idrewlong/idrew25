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

			<!-- Stacked words -->
			<div ref="wordsWrap" class="words-wrap">
				<div
					v-for="(word, idx) in words"
					:key="idx"
					ref="wordEls"
					class="word-row"
				>
					<span class="word-index hidden sm:inline">{{ String(idx + 1).padStart(2, '0') }}</span>
					<span class="word-text" :ref="(el) => (textEls[idx] = el)">{{
						word
					}}</span>
				</div>
			</div>

			<!-- Bottom line that forms after compression -->
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

const words = ['Plan', 'Build', 'Ship'];

onMounted(() => {
	nextTick(() => {
		if (!preloaderEl.value) return;

		// Force preloader to exact visual viewport width (fixes mobile viewport expansion)
		const vw = window.innerWidth;
		preloaderEl.value.style.width = vw + 'px';
		preloaderEl.value.style.maxWidth = vw + 'px';

		// Initial states — words off-screen from alternating sides
		wordEls.value.forEach((el, i) => {
			const dir = i % 2 === 0 ? -120 : 120;
			$gsap.set(el, { xPercent: dir, opacity: 0 });
		});

		$gsap.set(bottomLine.value, { opacity: 0, scaleX: 0 });
		$gsap.set(bottomLabel.value, { opacity: 0 });

		const tl = $gsap.timeline({
			delay: 0.35,
			onComplete: exitAnimation,
		});

		// 1. Words slide in from alternating sides and stack
		wordEls.value.forEach((el, i) => {
			tl.to(
				el,
				{
					xPercent: 0,
					opacity: 1,
					duration: 0.75,
					ease: 'power3.out',
				},
				i === 0 ? '+=0' : '-=0.45'
			);
		});

		// 2. Bottom line reveals right after last word lands
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

		// 3. Orange fills each word one by one — all stay orange
		textEls.value.forEach((el, i) => {
			tl.to(
				el,
				{
					color: '#f97316',
					duration: 0.5,
					ease: 'sine.inOut',
				},
				i === 0 ? '+=0.15' : '>-0.2'
			);
		});

		// 5. Hold
		tl.to({}, { duration: 0.4 });

		// 6. Words compress together toward center
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

		// 7. Hold
		tl.to({}, { duration: 0.3 });
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
}

.words-wrap {
	position: relative;
	z-index: 1;
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
	right: calc(50% + clamp(2.2rem, 7.5vw, 5.2rem));
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

.bottom-line {
	position: absolute;
	bottom: 15%;
	left: 50%;
	transform: translateX(-50%);
	display: flex;
	align-items: center;
	gap: 1rem;
	z-index: 2;
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
