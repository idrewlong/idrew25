<template>
	<section id="focus" ref="root" class="wrap">
		<div class="sec-rule js-reveal">
			<span class="readout text-[var(--accent)]">02</span>
			<span class="readout">What I do</span>
			<span class="readout ml-auto">{{ focusAreas.length }} focus areas</span>
		</div>
		<h2 class="display sec-word js-reveal">Focus<span class="sr-only"> areas</span></h2>

		<article
			v-for="(area, i) in focusAreas"
			:key="area.tag"
			class="fo-row js-reveal"
			:class="{ 'fo-row--flip': i % 2 === 1 }"
		>
			<FocusVisual :kind="area.visual" class="fo-visual" />
			<div class="fo-copy">
				<p class="readout">
					<span class="text-[var(--accent)]">#{{ String(i + 1).padStart(2, '0') }}</span> · {{ area.tag }}
				</p>
				<h3 class="display fo-title">{{ area.title }}</h3>
				<p class="fo-body">{{ area.body }}</p>
			</div>
		</article>
	</section>
</template>

<script setup>
import { ref } from 'vue';
import { focusAreas } from '~/utils/resume';

const root = ref(null);
useReveal(root);
</script>

<style scoped>
.fo-row {
	display: grid;
	grid-template-columns: 1fr;
	gap: 2rem;
	padding: 3rem 0;
	border-top: 1px solid var(--border);
}

@media (min-width: 976px) {
	.fo-row {
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: 4rem;
		align-items: center;
		padding: 4.5rem 0;
	}

	/* Alternate sides so the column reads as a zig-zag */
	.fo-row--flip .fo-visual {
		order: 2;
	}
}

.fo-title {
	margin-top: 1rem;
	font-size: clamp(2.5rem, 5.5vw, 4.75rem);
	line-height: 0.92;
}

.fo-body {
	margin-top: 1.25rem;
	max-width: 46ch;
	font-size: 1.0625rem;
	line-height: 1.65;
	color: var(--text-muted);
}
</style>
