<template>
	<div
		class="container mx-auto px-4 md:px-8 pt-16 mb-16 sm:pt-36 sm:mb-36 max-w-7xl"
	>
		<section
			class="bg-gradient-to-br from-orange-300 to-orange-500 rounded-xl overflow-hidden flex flex-col sm:flex-row justify-center items-center w-full"
		>
			<div
				class="p-12 flex flex-1 flex-col gap-y-6 self-start sm:self-end max-w-2xl"
			>
				<div class="flex flex-col gap-y-1">
					<div class="text-2xl font-medium text-gray-800">I'm Andrew.</div>
					<h1 class="text-4xl sm:text-5xl font-bold text-white">
						I like to build.
					</h1>
				</div>
				<p class="md:text-lg md:max-w-lg text-gray-800">
					TypeScript connoisseur. Animation aficionado. Frontend web, mostly
					React, Svelte and Nuxt.js. Cross-platform mobile with React Native.
					Backend with Lavarel and Node.js. Have written an SQL query or two.
				</p>
			</div>
			<div class="flex-shrink-0 relative">
				<div
					class="relative flex justify-end items-end"
					style="width: 450px; height: 450px"
				>
					<TechIcons :scroll="scrollPosition" />
					<div class="relative mt-12" style="height: 475px; width: 335px">
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
								style="height: 475px; width: 335px; top: 48px"
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
const images = ['/images/me_1.png', '/images/me_3.png'];
let transitioning = false;

// Scroll handler
const updateScroll = () => {
	scrollPosition.value = window.scrollY / 1000;
};

const changeImage = () => {
	if (transitioning) return;
	transitioning = true;
	currentImage.value = currentImage.value === images[0] ? images[1] : images[0];
	setTimeout(() => {
		transitioning = false;
	}, 4000); // Match this with your transition duration
};

let imageInterval;

onMounted(() => {
	// Set up scroll listener
	window.addEventListener('scroll', updateScroll);

	// Preload images
	images.forEach((src) => {
		const img = new Image();
		img.src = src;
		img.decode().catch(() => {}); // Wait for images to decode
	});

	// Initialize current image
	isClient.value = true;
	currentImage.value = images[0];

	// Set up image rotation with smoother timing
	imageInterval = setInterval(changeImage, 4000);
});

onUnmounted(() => {
	window.removeEventListener('scroll', updateScroll);
	if (imageInterval) clearInterval(imageInterval);
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
</style>
