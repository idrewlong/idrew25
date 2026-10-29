<template>
	<section id="education" ref="root" class="wrap">
		<div class="sec-rule js-reveal">
			<span class="readout text-[var(--accent)]">07</span>
			<span class="readout">Training</span>
		</div>
		<h2 class="display sec-word js-reveal">Education</h2>

		<div class="border-t border-[var(--border)]">
			<div
				v-for="education in educationList"
				:key="education.year"
				class="edu-row js-reveal"
			>
				<div class="edu-meta">
					<span class="readout text-[var(--text)]">{{ education.year }}</span>
					<span class="readout">{{ education.school }}</span>
				</div>

				<div class="flex items-start gap-4 min-w-0">
					<img
						v-if="education.logo"
						:src="education.logo"
						:alt="`${education.school} logo`"
						width="40"
						height="40"
						loading="lazy"
						class="edu-logo"
					/>
					<div class="min-w-0">
						<h3 class="display edu-title">
							{{ education.degree }}
							<span class="text-[var(--accent)]">{{ education.major }}</span>
						</h3>
						<ul class="mt-3 flex flex-wrap gap-2">
							<li v-for="ach in education.achievements" :key="ach" class="edu-tag readout">
								{{ ach }}
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
import { ref } from 'vue';
import { educationList } from '~/utils/resume';

const root = ref(null);
useReveal(root);

</script>

<style scoped>
.edu-row {
	display: grid;
	grid-template-columns: 1fr;
	gap: 1rem;
	padding: 2rem 0;
	border-bottom: 1px solid var(--border);
}

@media (min-width: 768px) {
	.edu-row {
		grid-template-columns: 14rem 1fr;
		gap: 3rem;
	}
}

.edu-meta {
	display: flex;
	flex-direction: column;
	gap: 0.4rem;
}

/* Logos are dark marks on transparent; lift them onto a light chip */
.edu-logo {
	width: 40px;
	height: 40px;
	padding: 6px;
	object-fit: contain;
	background: #ecedee;
	flex-shrink: 0;
}

.edu-title {
	font-size: clamp(1.5rem, 3vw, 2.25rem);
	line-height: 1;
}

.edu-tag {
	padding: 0.35rem 0.6rem;
	border: 1px solid var(--border);
	color: var(--text);
}
</style>
