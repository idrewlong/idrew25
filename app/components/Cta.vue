<template>
	<section
		id="contact"
		ref="root"
		class="relative wrap"
	>
		<div class="sec-rule js-reveal">
			<span class="readout text-[var(--accent)]">09</span>
			<span class="readout">Contact</span>
			<span class="readout ml-auto inline-flex items-center gap-2 !text-[var(--text)]">
				<span class="cta-dot" aria-hidden="true"></span>
				Open to software, platform, DevOps, AI &amp; cleared roles · Open to relocating
			</span>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_20rem] lg:grid-cols-[minmax(0,1fr)_22rem] border-b border-[var(--border)]">
			<!-- Giant name -->
			<div class="py-12 md:py-20 md:pr-12 md:border-r border-[var(--border)]">
				<h2 class="sr-only">Contact Andrew Long</h2>
				<!-- The name is a design element, not a heading -->
				<p class="display cta-name js-reveal" aria-hidden="true">
					Andrew<br />Long<span class="text-[var(--accent)]">.</span>
				</p>
			</div>

			<!-- Channels -->
			<div class="py-10 md:py-20 md:pl-12 flex flex-col gap-8 js-reveal">
				<div>
					<p class="readout mb-2">Inquiries</p>
					<a href="mailto:idrewlong@gmail.com" class="cta-email">
						idrewlong@gmail.com
					</a>
				</div>

				<div class="flex items-center gap-2">
					<a
						href="https://github.com/idrewlong"
						target="_blank"
						rel="noopener noreferrer"
						class="cta-social"
						aria-label="GitHub"
					>
						<Icon name="ph:github-logo-fill" class="w-4 h-4" />
					</a>
					<a
						href="https://www.linkedin.com/in/idrewlong/"
						target="_blank"
						rel="noopener noreferrer"
						class="cta-social"
						aria-label="LinkedIn"
					>
						<Icon name="ph:linkedin-logo-fill" class="w-4 h-4" />
					</a>
				</div>

				<div class="flex flex-col gap-3">
					<NuxtLink to="/contact" class="btn btn-solid w-full">
						<span>Get in touch</span>
						<Icon
							name="heroicons:arrow-up-right-20-solid"
							class="w-4 h-4"
							:aria-hidden="true"
						/>
					</NuxtLink>
					<a
						href="/Andrew%20Long%20Resume.pdf"
						download
						class="btn btn-ghost w-full"
					>
						<span>Download resume</span>
						<Icon
							name="heroicons:arrow-down-tray"
							class="w-4 h-4"
							:aria-hidden="true"
						/>
					</a>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
import { ref } from 'vue';

const root = ref(null);
useReveal(root);
</script>

<style scoped>
.cta-name {
	font-size: clamp(4rem, 14vw, 10.5rem);
	font-weight: 900;
	line-height: 0.85;
}

.cta-dot {
	width: 6px;
	height: 6px;
	background: var(--accent);
	animation: pulse-dot 2.4s ease-in-out infinite;
}

@keyframes pulse-dot {
	50% {
		opacity: 0.35;
	}
}

.cta-email {
	font-size: 1.125rem;
	color: var(--text);
	text-decoration: none;
	overflow-wrap: anywhere;
	transition: color 0.2s ease;
}

.cta-email:hover {
	color: var(--accent);
}

.cta-social {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 44px;
	height: 44px;
	border: 1px solid var(--border);
	color: var(--text-muted);
	transition:
		color 0.2s ease,
		border-color 0.2s ease;
}

.cta-social:hover {
	color: var(--accent);
	border-color: var(--accent);
}

@media (prefers-reduced-motion: reduce) {
	.cta-dot {
		animation: none;
	}
}
</style>
