<template>
	<div ref="ctaSection" class="relative w-full max-w-6xl mx-auto px-6">
		<!-- Notion-style section label — matches About/Experience/Skills -->
		<div ref="labelEl" class="flex items-center gap-3 mb-10">
			<span
				class="text-[10px] font-bold tracking-[0.25em] uppercase text-stone-400"
				>Contact</span
			>
			<div class="flex-1 h-px bg-stone-200"></div>
		</div>

		<!-- Main editorial split -->
		<div class="flex flex-col md:flex-row border-t border-b border-stone-200">
			<!-- Left: Giant name display -->
			<div
				ref="nameEl"
				class="flex-1 py-14 md:py-20 border-b md:border-b-0 md:border-r border-stone-200 md:pr-14"
			>
				<h2
					class="cta-name font-serif italic text-stone-900 leading-[0.88] tracking-tight select-none"
				>
					ANDREW<br />LONG
				</h2>
				<div class="mt-5 h-[2px] bg-stone-900 w-full max-w-md"></div>
			</div>

			<!-- Right: Notion-style contact blocks -->
			<div
				ref="contactEl"
				class="w-full md:w-80 lg:w-96 py-14 md:py-20 md:pl-12 flex flex-col gap-7"
			>
				<!-- Role chip -->
				<div>
					<div class="flex items-center gap-2 mb-2">
						<span class="text-orange-500 text-[10px]">✦</span>
						<span
							class="text-[9px] tracking-[0.25em] uppercase text-stone-400 font-mono"
							>Status</span
						>
					</div>
					<p
						class="text-[10px] tracking-[0.18em] uppercase text-stone-700 font-mono"
					>
						Fullstack Developer
					</p>
					<p
						class="text-[10px] tracking-[0.12em] uppercase text-stone-400 font-mono mt-1.5 leading-relaxed max-w-[18rem]"
					>
						Building solutions to complex problems.
					</p>
				</div>

				<!-- Social icons -->
				<div class="flex items-center gap-2">
					<a
						href="https://github.com/idrewlong"
						target="_blank"
						rel="noopener noreferrer"
						class="cta-social-icon"
						aria-label="GitHub"
					>
						<Icon name="ph:github-logo-fill" class="w-4 h-4" />
					</a>
					<a
						href="https://www.linkedin.com/in/idrewlong/"
						target="_blank"
						rel="noopener noreferrer"
						class="cta-social-icon"
						aria-label="LinkedIn"
					>
						<Icon name="ph:linkedin-logo-fill" class="w-4 h-4" />
					</a>
				</div>

				<!-- Divider -->
				<div class="h-px bg-stone-900 w-full"></div>

				<!-- Email block -->
				<div>
					<span
						class="text-[9px] tracking-[0.25em] uppercase text-stone-400 font-mono block mb-1.5"
						>Inquiries</span
					>
					<a
						href="mailto:idrewlong@gmail.com"
						class="text-xs text-stone-700 font-mono hover:text-orange-500 transition-colors duration-200"
					>
						idrewlong@gmail.com
					</a>
				</div>

				<!-- Buttons -->
				<div class="flex flex-col gap-3">
					<NuxtLink to="/contact" class="cta-button group">
						<span class="text-[10px] tracking-[0.25em] uppercase font-mono"
							>Get In Touch</span
						>
						<Icon
							name="heroicons:arrow-up-right-20-solid"
							class="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
						/>
					</NuxtLink>

					<a href="/resume.pdf" download class="cta-button-secondary group">
						<span class="text-[10px] tracking-[0.25em] uppercase font-mono"
							>Download Resume</span
						>
						<Icon
							name="heroicons:arrow-down-tray"
							class="w-4 h-4 transition-transform duration-200 group-hover:translate-y-0.5"
						/>
					</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';

const { $gsap } = useNuxtApp();

const ctaSection = ref(null);
const labelEl = ref(null);
const nameEl = ref(null);
const contactEl = ref(null);

onMounted(() => {
	nextTick(() => {
		if (!ctaSection.value) return;

		$gsap.set([labelEl.value, nameEl.value, contactEl.value], {
			opacity: 0,
			y: 30,
		});

		const tl = $gsap.timeline({
			scrollTrigger: {
				trigger: ctaSection.value,
				start: 'top 70%',
				toggleActions: 'play none none none',
			},
		});

		tl.to(labelEl.value, {
			opacity: 1,
			y: 0,
			duration: 0.6,
			ease: 'power2.out',
		})
			.to(
				nameEl.value,
				{ opacity: 1, y: 0, duration: 1, ease: 'expo.out' },
				'-=0.3'
			)
			.to(
				contactEl.value,
				{
					opacity: 1,
					y: 0,
					duration: 0.8,
					ease: 'power2.out',
					clearProps: 'all',
				},
				'-=0.6'
			);
	});
});
</script>

<style scoped>
.cta-name {
	font-size: clamp(3.5rem, 10vw, 9rem);
}

.cta-social-icon {
	@apply w-9 h-9 border border-stone-300 flex items-center justify-center text-stone-600
         hover:border-stone-900 hover:text-stone-900 transition-colors duration-200;
}

.cta-button {
	@apply inline-flex items-center justify-between w-full bg-stone-900 text-stone-50
         px-5 py-4 hover:bg-stone-700 transition-colors duration-200;
}

.cta-button-secondary {
	@apply inline-flex items-center justify-between w-full border border-stone-300 text-stone-700
         px-5 py-4 hover:border-stone-900 hover:text-stone-900 transition-colors duration-200;
}
</style>
