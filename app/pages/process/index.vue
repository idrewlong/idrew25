<template>
	<div class="w-full py-10 sm:py-16">
		<div class="max-w-6xl mx-auto px-4 sm:px-6">
			<div class="flex items-center gap-3 mb-6 sm:mb-10">
				<span
					class="text-[10px] font-bold tracking-[0.25em] uppercase text-stone-400"
				>
					Process
				</span>
				<div class="flex-1 h-px bg-stone-200" />
			</div>

			<div class="mb-10 sm:mb-14">
				<h1
					class="font-serif italic text-stone-900 leading-[0.92] tracking-tight text-4xl sm:text-6xl"
				>
					How I work
				</h1>
				<p class="mt-5 text-sm text-stone-500 leading-relaxed max-w-md">
					How I approach engineering work, from the first question to what
					ships and what happens to it after.
				</p>
			</div>
		</div>

		<Process :show-label="false" />

		<!-- What the process actually produces -->
		<section
			ref="practiceEl"
			class="max-w-6xl mx-auto px-4 sm:px-6 mt-16 sm:mt-24"
		>
			<div class="flex items-center gap-3 mb-8 sm:mb-10">
				<span
					class="text-[10px] font-bold tracking-[0.25em] uppercase text-stone-400"
				>
					In practice
				</span>
				<div class="flex-1 h-px bg-stone-200" />
			</div>

			<div
				class="grid grid-cols-1 sm:grid-cols-2 gap-x-12 lg:gap-x-20 border-t border-stone-200"
			>
				<div
					v-for="(item, i) in practice"
					:key="item.title"
					class="practice-item py-6 sm:py-7 border-b border-stone-200"
				>
					<span
						class="font-mono text-[11px] tabular-nums text-orange-400 block mb-2"
					>
						{{ String(i + 1).padStart(2, '0') }}
					</span>
					<h2
						class="font-serif text-lg sm:text-xl font-bold text-stone-900 leading-tight mb-2"
					>
						{{ item.title }}
					</h2>
					<p class="text-sm text-stone-500 leading-relaxed max-w-sm">
						{{ item.description }}
					</p>
				</div>
			</div>
		</section>

		<div class="max-w-6xl mx-auto px-4 sm:px-6 mt-14 sm:mt-20">
			<NuxtLink to="/contact" class="process-cta group">
				<span class="text-[10px] tracking-[0.25em] uppercase font-mono"
					>Let's talk about the work</span
				>
				<Icon
					name="heroicons:arrow-up-right-20-solid"
					class="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
				/>
			</NuxtLink>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';

const { $gsap } = useNuxtApp();

const practiceEl = ref(null);

const practice = [
	{
		title: 'A design doc before the hard-to-reverse change',
		description:
			'Anything touching schema, auth, or a public interface gets written down first. Ten minutes of writing is cheaper than a migration.',
	},
	{
		title: 'Small, reviewable pull requests',
		description:
			'One concern per PR. Easier to review, easier to revert, and easier to understand when someone runs git blame on it a year from now.',
	},
	{
		title: 'Tests that ship with the change',
		description:
			'Written alongside the code rather than bolted on afterward. They document what the code is supposed to do as much as they catch regressions.',
	},
	{
		title: 'Docs and runbooks that outlive me',
		description:
			'READMEs, architecture decisions, and on-call notes, so the system keeps working when I am not the one holding it.',
	},
];

onMounted(() => {
	nextTick(() => {
		if (!practiceEl.value) return;

		const prefersReducedMotion = window.matchMedia(
			'(prefers-reduced-motion: reduce)'
		).matches;
		if (prefersReducedMotion) return;

		const items = practiceEl.value.querySelectorAll('.practice-item');
		$gsap.set(items, { opacity: 0, y: 20 });
		$gsap.to(items, {
			opacity: 1,
			y: 0,
			duration: 0.5,
			stagger: 0.08,
			ease: 'power2.out',
			clearProps: 'all',
			scrollTrigger: {
				trigger: practiceEl.value,
				start: 'top 85%',
				toggleActions: 'play none none none',
			},
		});
	});
});

useSeoMeta({
	title: 'Process',
	description:
		'How Andrew Long approaches engineering work: understand the problem, research before building, build with intention, and iterate.',
	ogTitle: 'How I Work | Andrew Long',
	ogDescription:
		'How Andrew Long approaches engineering work: understand the problem, research before building, build with intention, and iterate.',
	ogImage: '/images/OG.webp',
	twitterCard: 'summary_large_image',
});
</script>

<style scoped>
.process-cta {
	display: inline-flex;
	align-items: center;
	gap: 0.75rem;
	border: 1px solid #d6d3d1;
	color: #57534e;
	padding: 0.875rem 1.25rem;
	transition:
		border-color 0.2s ease,
		color 0.2s ease;
}

.process-cta:hover {
	border-color: var(--text);
	color: var(--text);
}
</style>
