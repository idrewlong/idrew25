<template>
	<section ref="aboutSection" class="max-w-6xl mx-auto px-4 sm:px-6">
		<!-- Section label -->
		<div ref="labelEl" class="flex items-center gap-3 mb-10">
			<span
				class="text-[10px] font-bold tracking-[0.25em] uppercase text-stone-400"
				>About</span
			>
			<div class="flex-1 h-px bg-stone-200"></div>
		</div>

		<!-- Pull quote -->
		<blockquote
			ref="quoteEl"
			class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif italic text-stone-900 leading-tight mb-10 sm:mb-16 max-w-4xl"
		>
			"I've always been drawn to solving problems and building things that
			<span class="text-orange-500 not-italic">actually work.</span>"
		</blockquote>

		<!-- Two-column layout -->
		<div class="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 lg:gap-20">
			<!-- Left: Bio -->
			<div ref="bioEl" class="space-y-5">
				<p class="text-sm md:text-base leading-relaxed text-stone-500">
					Andrew Long, an Ole Miss graduate living in Long Beach, MS with my
					wife, and our dog Bo. At Mad Genius, I work as a full-stack developer
					and SEO strategist with a focus on backend systems: designing
					databases, building and integrating APIs, connecting CMS platforms,
					and developing the architecture that holds apps together. I also bring
					strong frontend experience through various Javascript frameworks and
					WordPress development.
				</p>
				<p class="text-sm md:text-base leading-relaxed text-stone-500">
					What differentiates me is how I think beyond the code. I understand
					full-scale business logistics and can translate complex technical
					problems into clear, actionable direction for non-technical
					stakeholders. I approach every engagement with an entrepreneurial
					mindset, using data to inform decisions and identify real growth
					opportunities. I'm a strong researcher by nature: if I don't know
					something, I know how to find the answer.
				</p>
			</div>

			<!-- Right: Currently sidebar -->
			<div ref="sidebarEl" class="relative lg:pl-10">
				<!-- Vertical rule (desktop only) -->
				<div
					class="absolute left-0 top-0 bottom-0 w-px bg-stone-200 hidden lg:block"
					aria-hidden="true"
				></div>

				<!-- Header -->
				<div class="flex items-center gap-3 mb-6">
					<p
						class="text-[9px] font-mono tracking-[0.22em] uppercase text-orange-400"
					>
						Currently
					</p>
					<!-- <span class="flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" aria-hidden="true"></span>
            <span class="text-[9px] font-mono text-stone-400 tracking-wide">casually looking for work</span>
          </span> -->
				</div>

				<!-- Items -->
				<div ref="sidebarItemsEl" class="space-y-0">
					<div
						v-for="item in currently"
						:key="item.label"
						class="sidebar-item group py-4 border-b border-stone-100 last:border-b-0 cursor-default"
					>
						<span
							class="block text-[9px] font-mono tracking-[0.18em] uppercase text-stone-300 mb-1"
						>
							{{ item.label }}
						</span>
						<a
							v-if="item.link"
							:href="item.link"
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-1 text-sm leading-snug text-stone-700 hover:text-orange-500 transition-colors duration-200"
						>
							{{ item.value }}
							<Icon
								icon="heroicons:arrow-up-right-20-solid"
								class="w-3.5 h-3.5 shrink-0 text-stone-400 group-hover:text-orange-400 transition-colors duration-200"
								aria-hidden="true"
							/>
						</a>
						<span
							v-else
							class="text-sm leading-snug text-stone-700 group-hover:text-orange-500 transition-colors duration-200"
						>
							{{ item.value }}
						</span>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { Icon } from '@iconify/vue';

const { $gsap } = useNuxtApp();

const aboutSection = ref(null);
const labelEl = ref(null);
const quoteEl = ref(null);
const bioEl = ref(null);
const sidebarEl = ref(null);
const sidebarItemsEl = ref(null);

const currently = [
	{ label: 'Based in', value: 'Long Beach, MS' },
	{
		label: 'Day job',
		value: 'Full-stack Dev & SEO · Mad Genius',
		link: 'https://madg.com/people/andrew-long/',
	},
	{ label: 'Building', value: 'Many Things' },
	{ label: 'Hobbies', value: 'Photography & being outdoors' },
];

onMounted(() => {
	nextTick(() => {
		if (!aboutSection.value) return;

		const sidebarItems =
			sidebarItemsEl.value?.querySelectorAll('.sidebar-item') ?? [];

		$gsap.set([labelEl.value, quoteEl.value, bioEl.value], {
			opacity: 0,
			y: 30,
		});
		$gsap.set(sidebarEl.value, { opacity: 0 });
		$gsap.set(sidebarItems, { opacity: 0, y: 16 });

		const tl = $gsap.timeline({
			scrollTrigger: {
				trigger: aboutSection.value,
				start: 'top 80%',
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
				quoteEl.value,
				{ opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' },
				'-=0.4'
			)
			.to(
				bioEl.value,
				{
					opacity: 1,
					y: 0,
					duration: 0.8,
					ease: 'power2.out',
					clearProps: 'all',
				},
				'-=0.5'
			)
			.to(
				sidebarEl.value,
				{ opacity: 1, duration: 0.4, ease: 'power2.out' },
				'-=0.6'
			)
			.to(
				sidebarItems,
				{
					opacity: 1,
					y: 0,
					duration: 0.5,
					stagger: 0.07,
					ease: 'power2.out',
					clearProps: 'all',
				},
				'-=0.3'
			);
	});
});
</script>

<style scoped>
.pulse-dot {
	animation: pulse-dot 2.4s ease-in-out infinite;
}

@keyframes pulse-dot {
	0%,
	100% {
		opacity: 1;
	}
	50% {
		opacity: 0.25;
	}
}
</style>
