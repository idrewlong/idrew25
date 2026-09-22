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
					What working with me on a project looks like, from the first
					conversation to what ships.
				</p>
			</div>
		</div>

		<Process :show-label="false" />

		<div class="max-w-6xl mx-auto px-4 sm:px-6 mt-14 sm:mt-20">
			<NuxtLink to="/contact" class="process-cta group">
				<span class="text-[10px] tracking-[0.25em] uppercase font-mono"
					>Start a conversation</span
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
useSeoMeta({
	title: 'Process',
	description:
		'How Andrew Long approaches a project: understand the problem, research before building, build with intention, and iterate.',
	ogTitle: 'How I Work | Andrew Long',
	ogDescription:
		'How Andrew Long approaches a project: understand the problem, research before building, build with intention, and iterate.',
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
