<!-- components/Footer.vue -->
<template>
	<footer class="w-full border-t border-stone-200 bg-(--bg)">
		<div class="max-w-6xl mx-auto px-4 sm:px-6">
			<div
				class="flex flex-col gap-5 py-6 border-b border-stone-200 sm:flex-row sm:items-center sm:justify-between"
			>
				<nav aria-label="Footer navigation" class="flex flex-wrap gap-x-6 gap-y-2">
					<NuxtLink to="/" class="footer-link">Home</NuxtLink>
					<NuxtLink
						v-for="link in navigationLinks"
						:key="link.to"
						:to="link.to"
						class="footer-link"
					>
						{{ link.label }}
					</NuxtLink>
					<NuxtLink to="/contact" class="footer-link">Contact</NuxtLink>
				</nav>

				<div class="flex items-center gap-4">
					<a :href="`mailto:${contactEmail}`" class="footer-link normal-case tracking-[0.08em]">
						{{ contactEmail }}
					</a>
					<div class="flex items-center gap-1">
						<a
							v-for="social in socialLinks"
							:key="social.url"
							:href="social.url"
							target="_blank"
							rel="noopener noreferrer"
							class="footer-icon"
							:aria-label="social.label"
						>
							<Icon :name="social.icon" class="w-4 h-4" :aria-hidden="true" />
						</a>
					</div>
				</div>
			</div>

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
@reference '../assets/css/main.css';

.footer-text {
	@apply text-[9px] tracking-[0.2em] uppercase text-stone-400 font-mono;
}

.footer-link {
	@apply text-[11px] tracking-[0.2em] uppercase text-stone-500 font-mono no-underline transition-colors hover:text-orange-500;
}

.footer-icon {
	@apply inline-flex items-center justify-center w-8 h-8 text-stone-500 transition-colors hover:text-orange-500;
}
</style>
