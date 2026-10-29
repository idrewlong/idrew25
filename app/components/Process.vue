<template>
	<section id="process" ref="root" class="wrap">
		<div class="sec-rule js-reveal">
			<span class="readout text-[var(--accent)]">[ 01 / 02 ]</span>
			<span class="readout">Principles</span>
			<span class="readout ml-auto">{{ cards.length }} steps</span>
		</div>

		<blockquote class="display pr-quote js-reveal">
			I don't follow a rigid process. I follow the problem and
			<span class="text-[var(--accent)]">let context shape the approach.</span>
		</blockquote>

		<ol ref="list" class="pr-list">
			<!-- Progress rail that fills as you read down the steps -->
			<span class="pr-rail" aria-hidden="true"><span ref="railFill" class="pr-rail-fill"></span></span>

			<li v-for="(card, i) in cards" :key="card.title" class="pr-step js-reveal">
				<div class="pr-num">
					<span class="display outline pr-index" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
					<span class="readout text-[var(--accent)]">{{ card.keyword }}</span>
				</div>
				<div class="pr-body">
					<h2 class="display pr-title">{{ card.title }}</h2>
					<p class="pr-desc">{{ card.description }}</p>
				</div>
				<ul class="pr-points">
					<li v-for="(point, j) in card.points" :key="j">{{ point }}</li>
				</ul>
			</li>
		</ol>
	</section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { onPageLeft } from '~/composables/usePageLeave';

const { $gsap } = useNuxtApp();

const root = ref(null);
const list = ref(null);
const railFill = ref(null);
useReveal(root);
let mm;

const cards = [
	{
		title: 'Understand the problem first',
		keyword: 'Why',
		description:
			'Before writing a single line of code, I make sure I actually understand what needs to happen and why. Talk to whoever owns the problem, dig into the data, map out the edges.',
		points: [
			'Ask the questions nobody else is asking',
			'Identify constraints early. They shape the solution',
			'Separate the stated request from the actual requirement',
		],
	},
	{
		title: 'Research before building',
		keyword: 'How',
		description:
			"I'm a researcher by nature. If I don't know something, I find the answer. I look at how others have solved similar problems, evaluate the tradeoffs, and pick the right tool.",
		points: [
			'Evaluate existing solutions before inventing one',
			'Prototype the risky parts first',
			'Let the tech serve the goal, not the other way around',
		],
	},
	{
		title: 'Build with intention',
		keyword: 'Build',
		description:
			'Every decision should be traceable to a reason. Architecture, stack choices, even naming. Intentionality compounds over time into systems that are easy to maintain and extend.',
		points: [
			'Write code that explains itself',
			'Optimize for the team, not just the task',
			'Ship incrementally. Small wins build momentum',
		],
	},
	{
		title: 'Think beyond the code',
		keyword: 'Think',
		description:
			'Understanding the business context changes everything. I translate technical complexity into clear direction and make sure the work connects to real outcomes.',
		points: [
			'Bridge the gap between technical and non-technical',
			'Use data to inform decisions, not just validate them',
			"Keep the end user in the room, even when they're not",
		],
	},
	{
		title: 'Iterate and refine',
		keyword: 'Ship',
		description:
			"Done is better than perfect, but done doesn't mean finished. Ship it, measure it, learn from it, and make it better. The best work comes from cycles, not sprints.",
		points: [
			'Get feedback early and often',
			'Measure what matters, not everything',
			'Treat every system as a foundation for the next',
		],
	},
];

onMounted(() => {
	mm = $gsap.matchMedia(root.value);
	mm.add('(prefers-reduced-motion: no-preference)', () => {
		$gsap.fromTo(
			railFill.value,
			{ scaleY: 0 },
			{
				scaleY: 1,
				ease: 'none',
				scrollTrigger: { trigger: list.value, start: 'top 70%', end: 'bottom 70%', scrub: 0.4 },
			}
		);
	});
});

onPageLeft(() => mm?.revert());
</script>

<style scoped>
.pr-quote {
	margin: 2.5rem 0 4rem;
	max-width: 24ch;
	font-size: clamp(2.25rem, 5vw, 4.25rem);
	line-height: 0.95;
}

.pr-list {
	position: relative;
	border-top: 1px solid var(--border);
}

.pr-rail {
	position: absolute;
	left: 0;
	top: 0;
	bottom: 0;
	width: 2px;
	background: var(--border);
	display: none;
}

.pr-rail-fill {
	display: block;
	height: 100%;
	background: var(--accent);
	transform-origin: top;
}

@media (min-width: 976px) {
	.pr-rail {
		display: block;
	}
}

.pr-step {
	display: grid;
	grid-template-columns: 1fr;
	gap: 1.25rem;
	padding: 2.5rem 0;
	border-bottom: 1px solid var(--border);
}

@media (min-width: 976px) {
	.pr-step {
		grid-template-columns: 12rem minmax(0, 1.3fr) minmax(0, 1fr);
		gap: 3rem;
		padding: 3.5rem 0 3.5rem 2rem;
	}
}

.pr-num {
	display: flex;
	align-items: baseline;
	gap: 1rem;
}

@media (min-width: 976px) {
	.pr-num {
		flex-direction: column;
		gap: 0.75rem;
	}
}

.pr-index {
	font-size: clamp(4rem, 8vw, 6.5rem);
	line-height: 0.8;
	-webkit-text-stroke-color: var(--text-muted);
}

.pr-step:hover .pr-index {
	-webkit-text-stroke-color: var(--accent);
}

.pr-title {
	font-size: clamp(2rem, 3.6vw, 3rem);
	line-height: 0.95;
}

.pr-desc {
	margin-top: 1rem;
	font-size: 1rem;
	line-height: 1.65;
	color: var(--text-muted);
	max-width: 52ch;
}

.pr-points {
	display: flex;
	flex-direction: column;
	gap: 12px;
	align-self: center;
}

.pr-points li {
	position: relative;
	padding: 0.75rem 0 0.75rem 1.25rem;
	border-top: 1px solid var(--border);
	font-size: 0.9375rem;
	line-height: 1.5;
	color: var(--text);
}

.pr-points li::before {
	content: '';
	position: absolute;
	left: 0;
	top: 22px;
	width: 8px;
	height: 1px;
	background: var(--accent);
}
</style>
