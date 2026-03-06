<template>
	<section class="hero2-section">
		<div class="hero2-container max-w-6xl mx-auto px-6">
			<!-- Section label -->
			<div ref="labelEl" class="flex items-center gap-3 mb-10 md:mb-14">
				<span class="text-[10px] font-bold tracking-[0.25em] uppercase text-stone-400">Portfolio</span>
				<div class="flex-1 h-px bg-stone-200"></div>
				<span class="text-[9px] font-mono tracking-[0.15em] uppercase text-stone-300">2026</span>
			</div>

			<!-- Split: content left, physics playground right -->
			<div class="hero2-grid">
				<!-- Left: Typography -->
				<div class="hero2-content">
					<div ref="greeting" class="hero2-greeting">
						<span class="text-[9px] font-mono tracking-[0.25em] uppercase text-orange-400">Hi, I'm Andrew</span>
					</div>

					<h1 ref="titleEl" class="hero2-title font-serif">
						I like to build<br />
						amazing
						<span class="typewriter text-orange-500">{{ currentWord }}</span>
					</h1>

					<p ref="descEl" class="hero2-description text-stone-500">
						TypeScript connoisseur. AI nerd. Animation aficionado. Fullstack web,
						mostly React, Svelte, Next or Nuxt. Backend with Laravel, Node.js, and
						PHP. Have written a Python bot or two.
					</p>

					<!-- Buttons -->
					<div ref="buttonsEl" class="hero2-buttons">
						<NuxtLink to="/contact" class="hero2-btn-primary group">
							<span class="text-[10px] tracking-[0.25em] uppercase font-mono">Get In Touch</span>
							<Icon
								name="heroicons:arrow-up-right-20-solid"
								class="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
								aria-hidden="true"
							/>
						</NuxtLink>
						<NuxtLink
							to="#projects"
							class="hero2-btn-secondary group"
							@click.prevent="scrollToProjects"
						>
							<span class="text-[10px] tracking-[0.25em] uppercase font-mono">View Projects</span>
							<Icon
								name="heroicons:arrow-down-20-solid"
								class="w-4 h-4 transition-transform duration-200 group-hover:translate-y-0.5"
								aria-hidden="true"
							/>
						</NuxtLink>
					</div>
				</div>

				<!-- Right: Physics playground -->
				<div ref="playgroundEl" class="hero2-playground">
					<PhysicsIcons />
					<!-- Hint text -->
					<div ref="hintEl" class="playground-hint">
						<Icon name="heroicons:cursor-arrow-rays-20-solid" class="w-3.5 h-3.5" />
						<span>drag & toss</span>
					</div>
				</div>
			</div>

			<!-- Scroll indicator -->
			<div
				ref="scrollIndicator"
				class="hero2-scroll hidden md:flex"
			>
				<span class="text-[9px] font-mono tracking-[0.3em] uppercase text-stone-400">Scroll</span>
				<div class="flex flex-col items-center gap-1">
					<div class="w-px h-8 bg-gradient-to-b from-stone-300 to-transparent"></div>
					<Icon name="heroicons:chevron-down-20-solid" class="w-3 h-3 text-stone-300" />
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
const titleEl = ref(null);
const descEl = ref(null);
const buttonsEl = ref(null);
const playgroundEl = ref(null);
const hintEl = ref(null);
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
			scrollIndicator.value.style.opacity = String(Math.max(0, 1 - window.scrollY / 120));
		}
		if (hintEl.value) {
			hintEl.value.style.opacity = String(Math.max(0, 1 - window.scrollY / 200));
		}
	});
};

const initAnimations = () => {
	$gsap.set(labelEl.value, { opacity: 0, y: 16 });
	$gsap.set([greeting.value, titleEl.value, descEl.value, buttonsEl.value], {
		opacity: 0,
		y: 40,
	});
	$gsap.set(playgroundEl.value, { opacity: 0, scale: 0.95 });
	$gsap.set(hintEl.value, { opacity: 0 });

	const tl = $gsap.timeline({ delay: 0.15 });

	tl.to(labelEl.value, {
		opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
	})
		.to(greeting.value, {
			opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
		}, '-=0.3')
		.to(titleEl.value, {
			opacity: 1, y: 0, duration: 0.9, ease: 'expo.out',
		}, '-=0.5')
		.to(descEl.value, {
			opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
		}, '-=0.6')
		.to(buttonsEl.value, {
			opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
		}, '-=0.5')
		.to(playgroundEl.value, {
			opacity: 1, scale: 1, duration: 1, ease: 'expo.out',
		}, '-=0.8')
		.to(hintEl.value, {
			opacity: 1, duration: 0.6, ease: 'power2.out',
		}, '-=0.3');
};

onMounted(() => {
	window.addEventListener('scroll', updateScroll, { passive: true });
	typewriterEffect();
	nextTick(() => initAnimations());
});

onUnmounted(() => {
	window.removeEventListener('scroll', updateScroll);
	if (typewriterTimeout) clearTimeout(typewriterTimeout);
});
</script>

<style scoped>
.hero2-section {
	position: relative;
	padding-top: 3rem;
	padding-bottom: 4rem;
	min-height: calc(100vh - 64px);
	display: flex;
	align-items: flex-start;
}

@media (min-width: 768px) {
	.hero2-section {
		padding-top: 4rem;
		padding-bottom: 6rem;
		align-items: center;
	}
}

.hero2-container {
	position: relative;
	width: 100%;
}

/* Grid: text left, playground right */
.hero2-grid {
	display: flex;
	flex-direction: column;
	gap: 2rem;
}

@media (min-width: 768px) {
	.hero2-grid {
		flex-direction: row;
		align-items: stretch;
		gap: 3rem;
	}
}

/* Left content */
.hero2-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 1.75rem;
	position: relative;
	z-index: 10;
	justify-content: center;
}

.hero2-greeting {
	display: flex;
	align-items: center;
	gap: 0.75rem;
}

.hero2-title {
	font-size: clamp(2.75rem, 7vw, 5.5rem);
	font-weight: 700;
	line-height: 0.92;
	letter-spacing: -0.02em;
	color: var(--text);
}

.hero2-description {
	font-size: 0.875rem;
	line-height: 1.75;
	max-width: 28rem;
}

@media (min-width: 768px) {
	.hero2-description {
		font-size: 0.9375rem;
	}
}

/* Buttons */
.hero2-buttons {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	max-width: 20rem;
	padding-top: 0.5rem;
}

@media (min-width: 480px) {
	.hero2-buttons {
		flex-direction: row;
		max-width: none;
	}
}

.hero2-btn-primary {
	display: inline-flex;
	align-items: center;
	justify-content: space-between;
	gap: 1.5rem;
	padding: 0.875rem 1.25rem;
	background: var(--text);
	color: #fafaf9;
	transition: background 0.2s ease;
}

.hero2-btn-primary:hover {
	background: #44403c;
}

.hero2-btn-secondary {
	display: inline-flex;
	align-items: center;
	justify-content: space-between;
	gap: 1.5rem;
	padding: 0.875rem 1.25rem;
	border: 1px solid #d6d3d1;
	color: #57534e;
	transition: border-color 0.2s ease, color 0.2s ease;
}

.hero2-btn-secondary:hover {
	border-color: var(--text);
	color: var(--text);
}

/* Right: physics playground */
.hero2-playground {
	position: relative;
	flex-shrink: 0;
	width: 100%;
	height: 320px;
	border: 1px solid var(--border);
	border-radius: 2px;
	background: rgba(255, 255, 255, 0.3);
}

@media (min-width: 768px) {
	.hero2-playground {
		width: 380px;
		height: auto;
		min-height: 440px;
	}
}

@media (min-width: 976px) {
	.hero2-playground {
		width: 440px;
	}
}

/* Hint */
.playground-hint {
	position: absolute;
	top: 12px;
	right: 12px;
	display: flex;
	align-items: center;
	gap: 5px;
	padding: 4px 8px;
	font-size: 9px;
	font-family: 'Geist Mono', monospace;
	letter-spacing: 0.12em;
	text-transform: uppercase;
	color: #a8a29e;
	background: rgba(247, 246, 243, 0.8);
	border: 1px solid var(--border);
	border-radius: 3px;
	pointer-events: none;
	z-index: 15;
}

/* Scroll indicator */
.hero2-scroll {
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

/* Typewriter */
.typewriter {
	display: inline-block;
	min-width: 60px;
	border-right: 2.5px solid var(--accent);
	padding-right: 3px;
	animation: blink 0.75s step-end infinite;
}

@keyframes blink {
	from, to { border-color: transparent; }
	50% { border-color: var(--accent); }
}
</style>
