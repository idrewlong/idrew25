<template>
	<section class="hero-section">
		<!-- Paper grain — carries the Preloader texture into the page -->
		<div class="hero-grain" aria-hidden="true"></div>

		<!-- Column rules — the Preloader's grid, dissolved to a whisper -->
		<div class="hero-rules" aria-hidden="true">
			<span class="hero-rule" style="left: 25%"></span>
			<span class="hero-rule" style="left: 50%"></span>
			<span class="hero-rule" style="left: 75%"></span>
		</div>

		<div class="hero-container max-w-6xl mx-auto px-4 sm:px-6">
			<!-- ── Masthead rail ────────────────────────────── -->
			<div class="hero-masthead">
				<span class="masthead-cell masthead-cell--name">Andrew Long</span>
				<span class="masthead-cell">Portfolio</span>
				<span class="masthead-cell">Long Beach, MS</span>
				<span class="masthead-cell masthead-cell--issue">2026</span>
			</div>

			<!-- ── Cover spread ─────────────────────────────── -->
			<div class="hero-grid">
				<!-- Left: type -->
				<div class="hero-content">
					<div class="hero-greeting">
						<span class="hero-star" aria-hidden="true">✦</span>
						<span
							class="text-[9px] font-mono tracking-[0.25em] uppercase text-stone-400"
							>Senior Full Stack Dev &middot; Mad Genius</span
						>
					</div>

					<h1 class="hero-title font-serif">
						<span class="hero-title-line">I like to build</span>
						<span class="hero-title-line">
							reliable<span class="hero-space">&nbsp;</span>
							<span class="typewriter">{{ currentWord }}</span>
						</span>
					</h1>

					<div class="hero-rule-heavy" aria-hidden="true"></div>

					<p class="hero-description text-stone-500">
						Go by choice. TypeScript by trade. AWS by necessity. Senior full
						stack at Mad Genius, where I own web and mobile builds and the AWS
						infrastructure behind Mississippi state agencies.
					</p>

					<div class="hero-buttons">
						<NuxtLink to="/contact" class="hero-btn-primary group">
							<span class="text-[10px] tracking-[0.25em] uppercase font-mono"
								>Get In Touch</span
							>
							<Icon
								name="heroicons:arrow-up-right-20-solid"
								class="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
								:aria-hidden="true"
							/>
						</NuxtLink>
						<a
							href="#projects"
							class="hero-btn-secondary group"
							@click.prevent="scrollTo('projects')"
						>
							<span class="text-[10px] tracking-[0.25em] uppercase font-mono"
								>View Projects</span
							>
							<Icon
								name="heroicons:arrow-down-20-solid"
								class="w-4 h-4 transition-transform duration-200 group-hover:translate-y-0.5"
								:aria-hidden="true"
							/>
						</a>
					</div>
				</div>

				<!-- Right: plate + photo + floating tech icons -->
				<div class="hero-image-area">
					<div class="hero-glow" aria-hidden="true"></div>

					<!-- Plate: the surface the photo stands on. Sits above the
					     glow but below the icons and photo, so the icons read as
					     floating in the space between viewer and backdrop. -->
					<div class="hero-plate" aria-hidden="true"></div>

					<TechIcons />

					<div class="hero-photo-wrapper">
						<img
							src="/images/me_1.webp"
							alt="Andrew Long"
							class="hero-photo"
							width="1200"
							height="1800"
							fetchpriority="high"
						/>
					</div>

				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const { $scroll } = useNuxtApp();

const words = ['tools', 'apps', 'APIs', 'platforms', 'infrastructure'];
const currentWord = ref('');

let reduceMotion = false;

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

onMounted(() => {
	reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	startTypewriter();
});

onUnmounted(() => {
	if (typewriterTimeout) clearTimeout(typewriterTimeout);
});
</script>

<style scoped>
/* ══ Shell ═══════════════════════════════════════════ */
.hero-section {
	position: relative;
	display: flex;
	flex-direction: column;
	padding-top: 1.5rem;
	padding-bottom: 1.5rem;
	isolation: isolate;
}

@media (min-width: 768px) {
	.hero-section {
		min-height: min(calc(100svh - 64px), 940px);
		padding-top: 2.25rem;
		padding-bottom: 1.75rem;
	}
}

.hero-container {
	position: relative;
	width: 100%;
	flex: 1;
	display: flex;
	flex-direction: column;
	z-index: 2;
}

/* Paper grain — same texture as the Preloader */
.hero-grain {
	position: absolute;
	inset: 0;
	z-index: 0;
	opacity: 0.028;
	pointer-events: none;
	background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
	background-size: 128px 128px;
}

/* Column rules — fade out top and bottom so they dissolve into the page */
.hero-rules {
	position: absolute;
	top: 0;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
	width: 100%;
	max-width: 72rem;
	z-index: 1;
	pointer-events: none;
	display: none;
}

@media (min-width: 768px) {
	.hero-rules {
		display: block;
	}
}

.hero-rule {
	position: absolute;
	top: 0;
	bottom: 0;
	width: 1px;
	background: linear-gradient(
		to bottom,
		transparent,
		var(--border) 12%,
		var(--border) 62%,
		transparent 96%
	);
	opacity: 0.55;
}

/* ══ Masthead rail ═══════════════════════════════════ */
.hero-masthead {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	border-top: 1px solid var(--border);
	border-bottom: 1px solid var(--border);
	margin-bottom: 2.5rem;
}

@media (min-width: 640px) {
	.hero-masthead {
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}
}

@media (min-width: 768px) {
	.hero-masthead {
		margin-bottom: 2rem;
	}
}

.masthead-cell {
	padding: 0.6rem 0.75rem;
	font-family: 'Geist Mono', monospace;
	font-size: 9px;
	letter-spacing: 0.24em;
	text-transform: uppercase;
	color: var(--text-muted);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	border-left: 1px solid var(--border);
}

.masthead-cell:first-child {
	border-left: 0;
	padding-left: 0;
}

.masthead-cell:nth-child(3) {
	border-left: 0;
	padding-left: 0;
}

@media (min-width: 640px) {
	.masthead-cell:nth-child(3) {
		border-left: 1px solid var(--border);
		padding-left: 0.75rem;
	}
}

.masthead-cell--name {
	color: var(--text);
	font-weight: 500;
}

.masthead-cell--issue {
	color: var(--accent);
	text-align: right;
	padding-right: 0;
}

/* ══ Cover spread ════════════════════════════════════ */
.hero-grid {
	position: relative;
	display: flex;
	flex-direction: column;
	gap: 2.5rem;
	flex: 1;
}

@media (min-width: 768px) {
	.hero-grid {
		flex-direction: row;
		align-items: center;
		gap: 4rem;
	}
}

.hero-content {
	flex: 1;
	min-width: 0;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	position: relative;
	z-index: 10;
}

.hero-greeting {
	display: flex;
	align-items: center;
	gap: 0.6rem;
	margin-bottom: 1.5rem;
}

.hero-star {
	color: var(--accent);
	font-size: 10px;
	line-height: 1;
}

/* ── Headline ── */
.hero-title {
	font-size: clamp(2.5rem, 7.4vw, 5.75rem);
	font-weight: 400;
	line-height: 1;
	letter-spacing: -0.03em;
	color: var(--text);
}

.hero-title-line {
	display: block;
	will-change: transform, opacity;
}

.hero-space {
	/* keeps the space between "reliable" and the typed word from collapsing */
	display: inline;
}

/* Heavy rule under the headline — same device as the Cta name block */
.hero-rule-heavy {
	height: 2px;
	width: 100%;
	max-width: 30rem; /* aligns with the description block below it */
	background: var(--text);
	margin-top: 1.75rem;
}

.hero-description {
	font-size: 0.875rem;
	line-height: 1.8;
	max-width: 30rem;
	margin-top: 1.75rem;
}

@media (min-width: 768px) {
	.hero-description {
		font-size: 0.9375rem;
	}
}

/* ── Typewriter ── */
.typewriter {
	display: inline-block;
	min-width: 60px;
	font-style: italic;
	color: var(--accent);
	border-right: 2.5px solid var(--accent);
	padding-right: 3px;
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

/* ── Buttons ── */
.hero-buttons {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	width: 100%;
	max-width: 20rem;
	margin-top: 2rem;
}

@media (min-width: 480px) {
	.hero-buttons {
		flex-direction: row;
		width: auto;
		max-width: none;
	}
}

.hero-btn-primary,
.hero-btn-secondary {
	position: relative;
	display: inline-flex;
	align-items: center;
	justify-content: space-between;
	gap: 1.5rem;
	padding: 0.9rem 1.25rem;
	overflow: hidden;
}

.hero-btn-primary {
	background: var(--text);
	color: #fafaf9;
}

/* Swipe fill on hover instead of a flat colour change */
.hero-btn-primary::before {
	content: '';
	position: absolute;
	inset: 0;
	background: var(--accent);
	transform: scaleX(0);
	transform-origin: left center;
	transition: transform 0.4s cubic-bezier(0.65, 0, 0.35, 1);
	z-index: 0;
}

.hero-btn-primary:hover::before,
.hero-btn-primary:focus-visible::before {
	transform: scaleX(1);
}

.hero-btn-primary > * {
	position: relative;
	z-index: 1;
}

.hero-btn-secondary {
	border: 1px solid #d6d3d1;
	color: #57534e;
	transition:
		border-color 0.2s ease,
		color 0.2s ease;
}

.hero-btn-secondary:hover,
.hero-btn-secondary:focus-visible {
	border-color: var(--text);
	color: var(--text);
}

/* ══ Photo plate ═════════════════════════════════════ */
.hero-image-area {
	position: relative;
	flex-shrink: 0;
	width: 100%;
	max-width: 300px;
	aspect-ratio: 4 / 5;
	margin: 0 auto;
}

@media (min-width: 480px) {
	.hero-image-area {
		max-width: 420px;
	}
}

@media (min-width: 768px) {
	.hero-image-area {
		width: 380px;
		max-width: none;
		margin: 0;
	}
}

@media (min-width: 976px) {
	.hero-image-area {
		width: 420px;
	}
}

/* Warm bloom so the icons read against something */
.hero-glow {
	position: absolute;
	left: 50%;
	bottom: 4%;
	width: 130%;
	aspect-ratio: 1;
	transform: translateX(-50%);
	background: radial-gradient(
		circle at center,
		rgba(249, 115, 22, 0.07) 0%,
		rgba(249, 115, 22, 0.03) 38%,
		transparent 68%
	);
	pointer-events: none;
	z-index: 0;
}

/* Plate — the lifted surface the photo stands on. The soft drop
   shadow plus the inset highlight is what reads as depth: the
   photo breaks out over its top edge and the icons float in
   front of it, giving three distinct planes. */
.hero-plate {
	position: absolute;
	left: 50%;
	bottom: 0;
	transform: translateX(-50%);
	width: 240px;
	height: 62%;
	z-index: 1;
	pointer-events: none;
	/* No border or drop shadow — the edges are feathered away so it
	   reads as a soft pool of light rather than a box, and the photo's
	   own white backdrop dissolves into it instead of seaming. Depth
	   comes from the icons' shadows sitting in front of it. */
	background: linear-gradient(
		180deg,
		rgba(255, 255, 255, 0.92) 0%,
		rgba(255, 255, 255, 0.72) 55%,
		rgba(255, 255, 255, 0.5) 100%
	);
	mask-image:
		linear-gradient(
			to bottom,
			transparent 0%,
			black 20%,
			black 84%,
			transparent 100%
		),
		linear-gradient(
			to right,
			transparent 0%,
			black 16%,
			black 84%,
			transparent 100%
		);
	mask-composite: intersect;
	-webkit-mask-image:
		linear-gradient(
			to bottom,
			transparent 0%,
			black 20%,
			black 84%,
			transparent 100%
		),
		linear-gradient(
			to right,
			transparent 0%,
			black 16%,
			black 84%,
			transparent 100%
		);
	-webkit-mask-composite: source-in;
}

@media (min-width: 480px) {
	.hero-plate {
		width: 300px;
	}
}

@media (min-width: 768px) {
	.hero-plate {
		width: 322px;
	}
}

.hero-photo-wrapper {
	position: absolute;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
	width: 220px;
	height: 320px;
	z-index: 10;
}

@media (min-width: 480px) {
	.hero-photo-wrapper {
		width: 280px;
		height: 400px;
	}
}

@media (min-width: 768px) {
	.hero-photo-wrapper {
		width: 300px;
		height: 425px;
	}
}

.hero-photo {
	width: 100%;
	height: 100%;
	object-fit: cover;
	object-position: top center;
	mask-image: linear-gradient(to bottom, black 76%, transparent 100%);
	-webkit-mask-image: linear-gradient(to bottom, black 76%, transparent 100%);
}

@media (prefers-reduced-motion: reduce) {
	.hero-btn-primary::before {
		transition: none;
	}

	.typewriter {
		animation: none;
	}
}
</style>
