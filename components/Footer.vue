<!-- components/Footer.vue -->
<template>
	<footer class="w-full border-t border-stone-200 bg-[var(--bg)]">
		<div class="max-w-6xl mx-auto px-4 sm:px-6">
			<div class="flex items-center justify-between py-4">
				<span class="footer-text">Long Beach // MS</span>

				<!-- Made in USA badge -->
				<div class="flex items-center gap-1.5">
					<svg class="w-4 h-3" viewBox="0 0 19 13" fill="none" aria-hidden="true">
						<rect width="19" height="13" rx="1" fill="#1C1917" />
						<rect y="1" width="19" height="1" fill="#F7F6F3" />
						<rect y="3" width="19" height="1" fill="#F7F6F3" />
						<rect y="5" width="19" height="1" fill="#F7F6F3" />
						<rect y="7" width="19" height="1" fill="#F7F6F3" />
						<rect y="9" width="19" height="1" fill="#F7F6F3" />
						<rect y="11" width="19" height="1" fill="#F7F6F3" />
						<rect width="8" height="7" fill="#1C1917" />
						<g fill="#F7F6F3">
							<circle cx="1.5" cy="1.2" r="0.4" /><circle cx="3" cy="1.2" r="0.4" /><circle cx="4.5" cy="1.2" r="0.4" /><circle cx="6" cy="1.2" r="0.4" />
							<circle cx="2.25" cy="2.2" r="0.4" /><circle cx="3.75" cy="2.2" r="0.4" /><circle cx="5.25" cy="2.2" r="0.4" />
							<circle cx="1.5" cy="3.2" r="0.4" /><circle cx="3" cy="3.2" r="0.4" /><circle cx="4.5" cy="3.2" r="0.4" /><circle cx="6" cy="3.2" r="0.4" />
							<circle cx="2.25" cy="4.2" r="0.4" /><circle cx="3.75" cy="4.2" r="0.4" /><circle cx="5.25" cy="4.2" r="0.4" />
							<circle cx="1.5" cy="5.2" r="0.4" /><circle cx="3" cy="5.2" r="0.4" /><circle cx="4.5" cy="5.2" r="0.4" /><circle cx="6" cy="5.2" r="0.4" />
						</g>
					</svg>
					<span class="footer-text">Made in the USA</span>
				</div>

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
