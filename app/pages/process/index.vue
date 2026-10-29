<template>
	<div ref="root" class="process-page">
		<PageHeader
			index="[ 00 / 02 ]"
			kicker="Process"
			:title="['How I', 'work']"
			lede="How I approach engineering work, from the first question to what ships and what happens to it after."
		>
			<StatTiles
				:items="[
					{ value: '05', label: 'Principles' },
					{ value: String(practice.length).padStart(2, '0'), label: 'Practices' },
				]"
			/>
		</PageHeader>

		<Process />

		<!-- What the process actually produces -->
		<section class="wrap pp-practice">
			<div class="sec-rule js-reveal">
				<span class="readout text-[var(--accent)]">[ 02 / 02 ]</span>
				<span class="readout">In practice</span>
			</div>
			<h2 class="display sec-word js-reveal">In practice</h2>

			<div class="pp-grid">
				<article v-for="(item, i) in practice" :key="item.title" class="pp-cell js-reveal">
					<span class="readout text-[var(--accent)]">P—{{ String(i + 1).padStart(2, '0') }}</span>
					<h3 class="display pp-title">{{ item.title }}</h3>
					<p class="pp-desc">{{ item.description }}</p>
				</article>
			</div>
		</section>

		<section class="wrap pp-cta js-reveal">
			<p class="display pp-cta-line">Have a problem worth<br /><span class="outline">working through?</span></p>
			<NuxtLink to="/contact" class="btn btn-solid">
				<span>Let's talk about the work</span>
				<Icon name="heroicons:arrow-up-right-20-solid" class="w-4 h-4" :aria-hidden="true" />
			</NuxtLink>
		</section>
	</div>
</template>

<script setup>
import { ref } from 'vue';

const root = ref(null);
useReveal(root);

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

useSeoMeta({
	title: 'Process',
	description:
		'How Andrew Long approaches engineering work: understand the problem, research before building, build with intention, and iterate.',
	ogTitle: 'How I Work | Andrew Long',
	ogDescription:
		'How Andrew Long approaches engineering work: understand the problem, research before building, build with intention, and iterate.',
});
</script>

<style scoped>
.process-page {
	padding-bottom: 6rem;
}

.pp-practice {
	margin-top: 8rem;
}

.pp-grid {
	display: grid;
	grid-template-columns: 1fr;
	border-top: 1px solid var(--border);
	border-left: 1px solid var(--border);
}

@media (min-width: 768px) {
	.pp-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
}

.pp-cell {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	min-height: 15rem;
	padding: 1.75rem;
	border-right: 1px solid var(--border);
	border-bottom: 1px solid var(--border);
	transition: background 0.25s ease;
}

.pp-cell:hover {
	background: var(--bg-card);
}

.pp-title {
	font-size: clamp(1.75rem, 2.8vw, 2.4rem);
	line-height: 0.95;
	max-width: 18ch;
}

.pp-desc {
	margin-top: auto;
	font-size: 0.9375rem;
	line-height: 1.6;
	color: var(--text-muted);
	max-width: 46ch;
}

.pp-cta {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 2rem;
	margin-top: 8rem;
	padding-top: 3rem;
	border-top: 1px solid var(--border);
}

@media (min-width: 976px) {
	.pp-cta {
		flex-direction: row;
		align-items: flex-end;
		justify-content: space-between;
	}
}

.pp-cta-line {
	font-size: clamp(3rem, 7vw, 6.5rem);
	line-height: 0.88;
}

@media (prefers-reduced-motion: reduce) {
	.pp-cell {
		transition: none;
	}
}
</style>
