<template>
	<div
		class="container mx-auto px-4 md:px-8 pt-8 mb-16 sm:pt-24 sm:mb-36 max-w-7xl"
	>
		<section
			class="relative bg-gradient-to-br from-orange-600 via-orange-500 to-orange-400 rounded-2xl overflow-hidden flex flex-col sm:flex-row justify-center items-center w-full shadow-2xl"
		>
			<!-- Background decorative elements -->
			<div class="absolute inset-0 overflow-hidden">
				<div
					class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)]"
				></div>
				<div
					class="absolute inset-0 bg-[linear-gradient(45deg,transparent_0%,rgba(255,255,255,0.05)_50%,transparent_100%)]"
				></div>
			</div>

			<!-- Content -->
			<div
				class="relative p-8 sm:p-12 flex flex-1 flex-col gap-y-6 sm:gap-y-8 self-start sm:self-end max-w-2xl"
			>
				<div class="flex flex-col gap-y-1 sm:gap-y-2">
					<div
						class="text-lg sm:text-xl font-medium text-gray-100 tracking-wide"
					>
						Hi, I'm Andrew
					</div>
					<h1
						class="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight"
					>
						I like to build
						<span
							class="text-transparent bg-clip-text bg-gradient-to-r from-orange-200 to-white"
						>
							amazing <span class="typewriter">{{ currentWord }}</span>
						</span>
					</h1>
				</div>
				<p class="text-base sm:text-lg text-gray-100 leading-relaxed max-w-xl">
					TypeScript connoisseur. Animation aficionado. Fullstack web, mostly
					React, Svelte, Nuxt.js or Laravel. Cross-platform mobile with React
					Native. Backend with Lavarel and Node.js. Have written a Python bot or
					two.
				</p>
				<div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
					<NuxtLink
						to="/contact"
						class="inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-white text-orange-600 font-medium hover:bg-gray-100 transition-colors duration-300 text-sm sm:text-base"
					>
						Let's work together
						<Icon
							name="heroicons:arrow-right"
							class="w-4 h-4 sm:w-5 sm:h-5 ml-2"
							aria-hidden="true"
						/>
					</NuxtLink>
					<NuxtLink
						to="#projects"
						@click.prevent="scrollToProjects"
						class="inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg border border-white/20 text-white font-medium hover:bg-white/10 transition-colors duration-300 text-sm sm:text-base"
					>
						View my work
					</NuxtLink>
				</div>
			</div>

			<!-- Tech Icons and Image -->
			<div class="relative flex-shrink-0 mt-8 sm:mt-0">
				<div
					class="relative flex justify-end items-end"
					style="width: 450px; height: 450px"
				>
					<TechIcons :scroll="scrollPosition" />
					<div
						class="relative mt-12 transform hover:scale-105 transition-transform duration-500"
						style="height: 475px; width: 335px"
					>
						<img
							v-if="!isClient"
							:src="images[0]"
							alt="Andrew's photo"
							class="relative z-10 w-full h-full"
							loading="lazy"
						/>
						<ClientOnly>
							<img
								v-for="(image, index) in images"
								:key="index"
								:src="image"
								alt="Andrew's photo"
								:class="[
									'absolute top-0 left-0 w-full h-full z-10 smooth-image',
									{ 'opacity-0': image !== currentImage },
								]"
								style="height: 475px; width: 335px; top: 64px"
								loading="lazy"
							/>
						</ClientOnly>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const scrollPosition = ref(0);
const isClient = ref(false);
const currentImage = ref('');
const currentWord = ref('');
const words = ['sites', 'apps', 'bots'];
let currentWordIndex = 0;
const images = ['/images/me_1.png', '/images/me_3.png'];
let transitioning = false;
let imageInterval;
let wordInterval;

const typeWord = async (word) => {
	transitioning = true;
	// Type out the word
	for (let i = 0; i < word.length; i++) {
		currentWord.value += word[i];
		await new Promise((resolve) => setTimeout(resolve, 75)); // Keep typing speed
	}

	// Pause at the end of the word
	await new Promise((resolve) => setTimeout(resolve, 2500)); // Keep display time

	// Delete the word more slowly
	while (currentWord.value.length > 0) {
		currentWord.value = currentWord.value.slice(0, -1);
		await new Promise((resolve) => setTimeout(resolve, 100)); // Slower deletion
	}

	// Very short pause before next word
	await new Promise((resolve) => setTimeout(resolve, 50));
	transitioning = false;

	// Chain to next word immediately
	currentWordIndex = (currentWordIndex + 1) % words.length;
	await typeWord(words[currentWordIndex]);
};

const changeWord = async () => {
	if (transitioning) return;
	currentWordIndex = (currentWordIndex + 1) % words.length;
	await typeWord(words[currentWordIndex]);
};

const scrollToProjects = () => {
	const projectsSection = document.getElementById('projects');
	if (projectsSection) {
		projectsSection.scrollIntoView({ behavior: 'smooth' });
	}
};

const updateScroll = () => {
	requestAnimationFrame(() => {
		scrollPosition.value = window.scrollY / 1000;
	});
};

const changeImage = () => {
	if (transitioning) return;
	transitioning = true;
	currentImage.value = currentImage.value === images[0] ? images[1] : images[0];
	setTimeout(() => {
		transitioning = false;
	}, 4000);
};

onMounted(() => {
	// Set up scroll listener with throttling
	window.addEventListener('scroll', updateScroll, { passive: true });

	// Preload images
	images.forEach((src) => {
		const img = new Image();
		img.src = src;
		img.decode().catch(() => {});
	});

	// Initialize current image and word
	isClient.value = true;
	currentImage.value = images[0];
	typeWord(words[0]); // Start with first word

	// Set up image rotation only
	imageInterval = setInterval(changeImage, 4000);
});

onUnmounted(() => {
	window.removeEventListener('scroll', updateScroll);
	if (imageInterval) clearInterval(imageInterval);
	if (wordInterval) clearInterval(wordInterval);
});
</script>

<style scoped>
.smooth-image {
	transform: translate(0, 0);
	transform: translateZ(0);
	-webkit-transform: translate3d(0, 0, 0);
	transition: opacity 2s cubic-bezier(0.4, 0, 0.2, 1);
	backface-visibility: hidden;
	will-change: opacity;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	image-rendering: -webkit-optimize-contrast;
}

.word-transition {
	display: inline-block;
	transition: all 0.5s ease;
	opacity: 1;
	transform: translateY(0);
	position: relative;
	min-width: 60px; /* Ensure space for the words */
}

.word-transition.changing {
	opacity: 0;
	transform: translateY(20px);
}

/* Prevent flickering in Webkit browsers */
@media not all and (min-resolution: 0.001dpcm) {
	@supports (-webkit-appearance: none) {
		.smooth-image {
			-webkit-transform: translate3d(0, 0, 0);
		}
	}
}

/* Improve performance in Firefox */
@-moz-document url-prefix() {
	.smooth-image {
		transform: translate(0, 0);
		transform: translate3d(0, 0, 0);
	}
}

.typewriter {
	display: inline-block;
	min-width: 80px;
	border-right: 2px solid white;
	padding-right: 4px;
	animation: blink 0.75s step-end infinite;
}

@keyframes blink {
	from,
	to {
		border-color: transparent;
	}
	50% {
		border-color: white;
	}
}
</style>
