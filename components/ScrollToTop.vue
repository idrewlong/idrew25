<template>
	<Transition name="slide-up">
		<button
			v-show="showButton"
			@click="handleClick"
			class="scroll-btn"
			:class="{ 'is-clicking': isAnimating }"
			aria-label="Scroll to top"
		>
			<!-- Progress ring -->
			<svg class="progress-ring" viewBox="0 0 44 44" aria-hidden="true">
				<circle class="ring-track" cx="22" cy="22" r="18" />
				<circle
					class="ring-fill"
					cx="22"
					cy="22"
					r="18"
					:style="{ strokeDashoffset: progressOffset }"
				/>
			</svg>

			<!-- Arrow icon -->
			<svg
				class="arrow"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				aria-hidden="true"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M5 10l7-7m0 0l7 7m-7-7v18"
				/>
			</svg>

			<!-- Tooltip -->
			<span class="tooltip" aria-hidden="true">Back to top</span>
		</button>
	</Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

const showButton = ref(false);
const isAnimating = ref(false);
const scrollProgress = ref(0);
const scrollThreshold = 300;

const RADIUS = 18;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ~113.1

const progressOffset = computed(() => {
	return CIRCUMFERENCE * (1 - scrollProgress.value);
});

const checkScroll = () => {
	const scrollY = window.scrollY;
	const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
	showButton.value = scrollY > scrollThreshold;
	scrollProgress.value = maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0;
};

const handleClick = () => {
	isAnimating.value = true;
	window.scrollTo({ top: 0, behavior: 'smooth' });
	setTimeout(() => {
		isAnimating.value = false;
	}, 600);
};

onMounted(() => {
	window.addEventListener('scroll', checkScroll, { passive: true });
	checkScroll();
});

onUnmounted(() => {
	window.removeEventListener('scroll', checkScroll);
});
</script>

<style scoped>
.scroll-btn {
	position: fixed;
	bottom: 1rem;
	right: 1rem;
	width: 40px;
	height: 40px;
	border-radius: 50%;
	background: rgba(247, 246, 243, 0.88);
	backdrop-filter: blur(12px);
	-webkit-backdrop-filter: blur(12px);
	border: 1px solid var(--border);
	color: var(--text-muted);
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow:
		0 2px 8px rgba(0, 0, 0, 0.08),
		0 1px 2px rgba(0, 0, 0, 0.05);
	transition:
		color 0.15s ease,
		box-shadow 0.15s ease,
		transform 0.15s ease,
		border-color 0.15s ease;
	z-index: 50;
}

@media (min-width: 480px) {
	.scroll-btn {
		bottom: 2rem;
		right: 2rem;
		width: 44px;
		height: 44px;
	}
}

.scroll-btn:hover {
	color: var(--text);
	border-color: var(--accent);
	box-shadow:
		0 4px 16px rgba(249, 115, 22, 0.15),
		0 1px 4px rgba(0, 0, 0, 0.08);
	transform: translateY(-1px);
}

.scroll-btn.is-clicking {
	transform: scale(0.92);
}

.scroll-btn:focus-visible {
	outline: 2px solid var(--accent);
	outline-offset: 2px;
}

/* Progress ring */
.progress-ring {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	transform: rotate(-90deg);
}

.ring-track {
	fill: none;
	stroke: var(--border);
	stroke-width: 2;
}

.ring-fill {
	fill: none;
	stroke: var(--accent);
	stroke-width: 2;
	stroke-linecap: round;
	stroke-dasharray: 113.1;
	stroke-dashoffset: 113.1;
	transition: stroke-dashoffset 0.1s linear;
}

/* Arrow icon */
.arrow {
	width: 16px;
	height: 16px;
	flex-shrink: 0;
	transition: transform 0.2s ease;
}

.scroll-btn:hover .arrow {
	transform: translateY(-2px);
}

/* Tooltip */
.tooltip {
	position: absolute;
	right: calc(100% + 10px);
	top: 50%;
	transform: translateY(-50%);
	background: var(--text);
	color: var(--bg);
	font-size: 0.75rem;
	font-family: inherit;
	white-space: nowrap;
	padding: 4px 8px;
	border-radius: 4px;
	pointer-events: none;
	opacity: 0;
	transition: opacity 0.15s ease;
}

.tooltip::after {
	content: '';
	position: absolute;
	left: 100%;
	top: 50%;
	transform: translateY(-50%);
	border: 4px solid transparent;
	border-left-color: var(--text);
}

.scroll-btn:hover .tooltip {
	opacity: 1;
}

/* Entrance / exit */
.slide-up-enter-active {
	transition:
		opacity 0.25s ease,
		transform 0.25s ease;
}

.slide-up-leave-active {
	transition:
		opacity 0.2s ease,
		transform 0.2s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
	opacity: 0;
	transform: translateY(12px);
}
</style>
