<template>
	<div class="ticker" aria-hidden="true">
		<div class="ticker-track">
			<div v-for="n in 2" :key="n" class="ticker-set">
				<template v-for="(word, i) in words" :key="word">
					<span class="ticker-word" :class="{ 'is-outline': i % 2 }">{{ word }}</span>
					<span class="ticker-star">✳</span>
				</template>
			</div>
		</div>
	</div>
</template>

<script setup>
const words = ['Plan', 'Build', 'Ship', 'Launch'];
</script>

<style scoped>
.ticker {
	overflow: hidden;
	padding-block: 1.25rem;
	border-block: 1px solid var(--border);
}

.ticker-track {
	display: flex;
	width: max-content;
	animation: ticker 40s linear infinite;
}

.ticker-set {
	display: flex;
	align-items: center;
	gap: 2.5rem;
	padding-right: 2.5rem;
}

.ticker-word {
	font-family: var(--font-display);
	font-weight: 800;
	text-transform: uppercase;
	font-size: clamp(4rem, 12vw, 10rem);
	line-height: 0.85;
	color: var(--text);
}

.ticker-word.is-outline {
	color: transparent;
	-webkit-text-stroke: 1.5px var(--text);
}

.ticker-star {
	font-size: clamp(1.5rem, 3vw, 2.5rem);
	color: var(--accent);
}

@keyframes ticker {
	to {
		transform: translateX(-50%);
	}
}

@media (prefers-reduced-motion: reduce) {
	.ticker-track {
		animation: none;
	}
}
</style>
