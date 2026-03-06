<!-- components/Footer.vue -->
<template>
	<footer class="w-full border-t border-stone-200 bg-[var(--bg)]">
		<div class="max-w-6xl mx-auto px-4 sm:px-6">
			<div class="flex items-center justify-between py-4">
				<span class="footer-text">Long Beach // MS</span>
				<span class="footer-text">© {{ year }} Andrew Long</span>
			</div>
		</div>
	</footer>
</template>

<script setup>
defineProps({
	isFat: {
		type: Boolean,
		default: false,
	},
});

const year = new Date().getFullYear();
</script>

<style scoped>
.footer-text {
	@apply text-[9px] tracking-[0.2em] uppercase text-stone-400 font-mono;
}
</style>
