<template>
	<section ref="heroSection" class="hero-section">
		<div class="hero-container max-w-6xl mx-auto px-4 sm:px-6">
			<!-- Section label — matches rest of site -->
			<div ref="labelEl" class="flex items-center gap-3 mb-6 sm:mb-10 md:mb-14">
				<span
					class="text-[10px] font-bold tracking-[0.25em] uppercase text-stone-400"
					>Portfolio</span
				>
				<div class="flex-1 h-px bg-stone-200"></div>
				<span
					class="text-[9px] font-mono tracking-[0.15em] uppercase text-stone-300"
					>2026</span
				>
			</div>

			<!-- Editorial split layout -->
			<div class="hero-grid">
				<!-- Left: Typography -->
				<div class="hero-content">
					<div ref="greeting" class="hero-greeting">
						<span
							class="text-[9px] font-mono tracking-[0.25em] uppercase text-orange-400"
							>Hi, I'm Andrew</span
						>
					</div>

					<h1 ref="title" class="hero-title font-serif">
						I like to build<br />
						amazing
						<span class="typewriter text-orange-500">{{ currentWord }}</span>
					</h1>

					<p ref="description" class="hero-description text-stone-500">
						TypeScript connoisseur. AI nerd. Animation aficionado. Fullstack
						web, mostly React, Svelte, Next or Nuxt. Backend with Laravel,
						Node.js, and PHP. Have written a Python bot or two.
					</p>

					<!-- CTA Buttons — editorial style matching Cta.vue -->
					<div ref="buttons" class="hero-buttons">
						<NuxtLink to="/contact" class="hero-btn-primary group">
							<span class="text-[10px] tracking-[0.25em] uppercase font-mono"
								>Get In Touch</span
							>
							<Icon
								name="heroicons:arrow-up-right-20-solid"
								class="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
								aria-hidden="true"
							/>
						</NuxtLink>
						<NuxtLink
							to="#projects"
							class="hero-btn-secondary group"
							@click.prevent="scrollToProjects"
						>
							<span class="text-[10px] tracking-[0.25em] uppercase font-mono"
								>View Projects</span
							>
							<Icon
								name="heroicons:arrow-down-20-solid"
								class="w-4 h-4 transition-transform duration-200 group-hover:translate-y-0.5"
								aria-hidden="true"
							/>
						</NuxtLink>
					</div>
				</div>

				<!-- Right: Photo + floating tech icons -->
				<div ref="photoEl" class="hero-image-area">
					<TechIcons />
					<div class="hero-photo-wrapper">
						<img
							src="/images/me_1.png"
							alt="Andrew's photo"
							class="hero-photo"
							loading="lazy"
						/>
					</div>
				</div>
			</div>

			<!-- Scroll indicator -->
			<div ref="scrollIndicator" class="hero-scroll hidden md:flex">
				<span
					class="text-[9px] font-mono tracking-[0.3em] uppercase text-stone-400"
					>Scroll</span
				>
				<div class="flex flex-col items-center gap-1">
					<div
						class="w-px h-8 bg-gradient-to-b from-stone-300 to-transparent"
					></div>
					<Icon
						name="heroicons:chevron-down-20-solid"
						class="w-3 h-3 text-stone-300"
					/>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';

const { $gsap } = useNuxtApp();

const currentWord = ref('');
const words = ['sites', 'apps', 'bots'];
let typewriterTimeout;

// Template refs
const labelEl = ref(null);
const greeting = ref(null);
const title = ref(null);
const description = ref(null);
const buttons = ref(null);
const photoEl = ref(null);
const scrollIndicator = ref(null);

// Typewriter state
let wordIndex = 0;
let letterIndex = 0;
let isDeleting = false;

const typewriterEffect = () => {
	const currentTargetWord = words[wordIndex];
	let newWord = '';
	let delay = 100;

	if (isDeleting) {
		newWord = currentTargetWord.substring(0, letterIndex - 1);
		letterIndex--;
		delay = 100;
	} else {
		newWord = currentTargetWord.substring(0, letterIndex + 1);
		letterIndex++;
		delay = 75;
	}

	currentWord.value = newWord;

	if (!isDeleting && newWord === currentTargetWord) {
		isDeleting = true;
		delay = 2500;
	} else if (isDeleting && newWord === '') {
		isDeleting = false;
		wordIndex = (wordIndex + 1) % words.length;
		letterIndex = 0;
		delay = 500;
	}

	typewriterTimeout = setTimeout(typewriterEffect, delay);
};

const scrollToProjects = () => {
	const projectsSection = document.getElementById('projects');
	if (projectsSection) {
		projectsSection.scrollIntoView({ behavior: 'smooth' });
	}
};

const updateScroll = () => {
	requestAnimationFrame(() => {
		if (scrollIndicator.value) {
			scrollIndicator.value.style.opacity = String(
				Math.max(0, 1 - window.scrollY / 120)
			);
		}
	});
};

const initAnimations = () => {
	// Label
	$gsap.set(labelEl.value, { opacity: 0, y: 16 });
	$gsap.set([greeting.value, title.value, description.value, buttons.value], {
		opacity: 0,
		y: 40,
	});
	$gsap.set(photoEl.value, { opacity: 0, scale: 0.92, y: 20 });

	const tl = $gsap.timeline({ delay: 0.15 });

	tl.to(labelEl.value, {
		opacity: 1,
		y: 0,
		duration: 0.6,
		ease: 'power2.out',
	})
		.to(
			greeting.value,
			{
				opacity: 1,
				y: 0,
				duration: 0.7,
				ease: 'power2.out',
			},
			'-=0.3'
		)
		.to(
			title.value,
			{
				opacity: 1,
				y: 0,
				duration: 0.9,
				ease: 'expo.out',
			},
			'-=0.5'
		)
		.to(
			description.value,
			{
				opacity: 1,
				y: 0,
				duration: 0.8,
				ease: 'power2.out',
			},
			'-=0.6'
		)
		.to(
			buttons.value,
			{
				opacity: 1,
				y: 0,
				duration: 0.7,
				ease: 'power2.out',
			},
			'-=0.5'
		)
		.to(
			photoEl.value,
			{
				opacity: 1,
				scale: 1,
				y: 0,
				duration: 1.1,
				ease: 'expo.out',
			},
			'-=0.8'
		);
};

onMounted(() => {
	window.addEventListener('scroll', updateScroll, { passive: true });
	typewriterEffect();

	nextTick(() => {
		initAnimations();
	});
});

onUnmounted(() => {
	window.removeEventListener('scroll', updateScroll);
	if (typewriterTimeout) clearTimeout(typewriterTimeout);
});
</script>

<style scoped>
.hero-section {
	position: relative;
	padding-top: 2rem;
	padding-bottom: 3rem;
	min-height: calc(100vh - 56px);
	display: flex;
	align-items: flex-start;
}

@media (min-width: 480px) {
	.hero-section {
		padding-top: 3rem;
		padding-bottom: 4rem;
	}
}

@media (min-width: 768px) {
	.hero-section {
		padding-top: 4rem;
		padding-bottom: 6rem;
		align-items: center;
	}
}

.hero-container {
	position: relative;
	width: 100%;
}

/* Grid: text left, image right */
.hero-grid {
	position: relative;
	display: flex;
	flex-direction: column;
	gap: 2rem;
}

@media (min-width: 480px) {
	.hero-grid {
		gap: 3rem;
	}
}

@media (min-width: 768px) {
	.hero-grid {
		flex-direction: row;
		align-items: center;
		gap: 4rem;
	}
}

/* Left content */
.hero-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 1.25rem;
	position: relative;
	z-index: 10;
}

@media (min-width: 480px) {
	.hero-content {
		gap: 1.75rem;
	}
}

.hero-greeting {
	display: flex;
	align-items: center;
	gap: 0.75rem;
}

.hero-title {
	font-size: clamp(2.25rem, 7vw, 5.5rem);
	font-weight: 700;
	line-height: 0.92;
	letter-spacing: -0.02em;
	color: var(--text);
}

.hero-description {
	font-size: 0.875rem;
	line-height: 1.75;
	max-width: 28rem;
}

@media (min-width: 768px) {
	.hero-description {
		font-size: 0.9375rem;
	}
}

/* Buttons — matching CTA component style */
.hero-buttons {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	max-width: 20rem;
	padding-top: 0.5rem;
}

@media (min-width: 480px) {
	.hero-buttons {
		flex-direction: row;
		max-width: none;
	}
}

.hero-btn-primary {
	display: inline-flex;
	align-items: center;
	justify-content: space-between;
	gap: 1.5rem;
	padding: 0.875rem 1.25rem;
	background: var(--text);
	color: #fafaf9;
	transition: background 0.2s ease;
}

.hero-btn-primary:hover {
	background: #44403c;
}

.hero-btn-secondary {
	display: inline-flex;
	align-items: center;
	justify-content: space-between;
	gap: 1.5rem;
	padding: 0.875rem 1.25rem;
	border: 1px solid #d6d3d1;
	color: #57534e;
	transition:
		border-color 0.2s ease,
		color 0.2s ease;
}

.hero-btn-secondary:hover {
	border-color: var(--text);
	color: var(--text);
}

/* Right: image area */
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
	mask-image: linear-gradient(to bottom, black 60%, transparent 100%);
	-webkit-mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
}

/* Scroll indicator */
.hero-scroll {
	position: absolute;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
	flex-direction: column;
	align-items: center;
	gap: 0.5rem;
	pointer-events: none;
	z-index: 10;
}

/* Typewriter cursor */
.typewriter {
	display: inline-block;
	min-width: 60px;
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
</style>
