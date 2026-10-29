<template>
	<section id="skills" ref="root" class="wrap">
		<div class="sec-rule js-reveal">
			<span class="readout text-[var(--accent)]">05</span>
			<span class="readout">Loadout</span>
			<span class="readout ml-auto">Stack · {{ total }}</span>
		</div>
		<h2 class="display sec-word js-reveal">Skills<span class="sr-only"> and tech stack</span></h2>

		<div class="sk-grid">
			<div v-for="(category, i) in skillCategories" :key="category.title" class="sk-cell js-reveal">
				<span class="sk-tick sk-tick--tl" aria-hidden="true">+</span>
				<div class="sk-head">
					<h3 class="readout !text-[var(--text)]">{{ category.title }}</h3>
					<span class="readout" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
				</div>
				<ul class="sk-chips">
					<li v-for="skill in category.skills" :key="skill">{{ skill }}</li>
				</ul>
			</div>
		</div>

		<div class="sk-areas js-reveal">
			<p class="readout">Areas of expertise</p>
			<ul class="sk-area-list">
				<li v-for="area in expertiseAreas" :key="area" class="display">{{ area }}</li>
			</ul>
		</div>
	</section>
</template>

<script setup>
import { ref } from 'vue';
import { skillCategories, expertiseAreas } from '~/utils/resume';

const root = ref(null);
useReveal(root);

const total = skillCategories.reduce((n, c) => n + c.skills.length, 0);
</script>

<style scoped>
.sk-grid {
	display: grid;
	grid-template-columns: 1fr;
	border-top: 1px solid var(--border);
	border-left: 1px solid var(--border);
}

@media (min-width: 640px) {
	.sk-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
}

@media (min-width: 1100px) {
	.sk-grid {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
}

.sk-cell {
	position: relative;
	padding: 1.5rem;
	border-right: 1px solid var(--border);
	border-bottom: 1px solid var(--border);
}

/* Registration mark on each cell corner, like the panels on a spec sheet */
.sk-tick {
	position: absolute;
	font-family: 'Geist Mono', ui-monospace, monospace;
	font-size: 11px;
	line-height: 1;
	color: var(--text-muted);
}

.sk-tick--tl {
	top: -6px;
	left: -4px;
}

.sk-head {
	display: flex;
	justify-content: space-between;
	align-items: baseline;
	gap: 1rem;
}

.sk-chips {
	display: flex;
	flex-wrap: wrap;
	gap: 6px;
	margin-top: 1.25rem;
}

.sk-chips li {
	padding: 0.4rem 0.65rem;
	border: 1px solid var(--border);
	font-family: 'Geist Mono', ui-monospace, monospace;
	font-size: 10.5px;
	letter-spacing: 0.08em;
	text-transform: uppercase;
	color: var(--text);
	transition: border-color 0.2s ease, color 0.2s ease;
}

.sk-chips li:hover {
	border-color: var(--accent);
}

/* The first category (AI) gets the signal colour on its edge */
.sk-cell:first-child {
	box-shadow: inset 2px 0 0 var(--accent);
}

.sk-areas {
	margin-top: 3.5rem;
}

.sk-area-list {
	display: flex;
	flex-wrap: wrap;
	gap: 0.25rem 0;
	margin-top: 1.25rem;
}

.sk-area-list li {
	font-size: clamp(1.5rem, 2.8vw, 2.25rem);
	line-height: 1.2;
	color: var(--text-muted);
	transition: color 0.2s ease;
}

.sk-area-list li:hover {
	color: var(--text);
}

.sk-area-list li:last-child::after {
	content: none;
}

.sk-area-list li::after {
	content: '/';
	margin: 0 0.6em;
	color: var(--text-muted);
	opacity: 0.6;
}
</style>
