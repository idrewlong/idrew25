<template>
	<Transition name="fade">
		<button
			v-show="showButton"
			@click="handleClick"
			class="fixed bottom-8 right-8 p-4 bg-orange-500 text-white rounded-full shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
			aria-label="Scroll to top"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				:class="['h-6 w-6', { 'animate-bounce-once': isAnimating }]"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M5 10l7-7m0 0l7 7m-7-7v18"
				/>
			</svg>
		</button>
	</Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const showButton = ref(false);
const isAnimating = ref(false);
const scrollThreshold = 300; // Show button after scrolling 300px

const checkScroll = () => {
	showButton.value = window.scrollY > scrollThreshold;
};

const handleClick = () => {
	isAnimating.value = true;
	scrollToTop();
	// Reset animation after it completes
	setTimeout(() => {
		isAnimating.value = false;
	}, 500);
};

const scrollToTop = () => {
	window.scrollTo({
		top: 0,
		behavior: 'smooth',
	});
};

onMounted(() => {
	window.addEventListener('scroll', checkScroll);
});

onUnmounted(() => {
	window.removeEventListener('scroll', checkScroll);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

@keyframes bounce-once {
	0%,
	100% {
		transform: translateY(0);
	}
	50% {
		transform: translateY(-25%);
	}
}

.animate-bounce-once {
	animation: bounce-once 0.5s ease-in-out;
}
</style>
