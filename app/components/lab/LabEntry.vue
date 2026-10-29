<template>
	<article :id="id" class="entry">
		<div class="entry-copy js-reveal">
			<p class="readout">
				<span class="text-[var(--accent)]">C—{{ String(index).padStart(2, '0') }}</span>
				<span aria-hidden="true"> · </span>{{ path }}
			</p>
			<h2 class="display entry-name">{{ name }}</h2>
			<p class="entry-summary">{{ summary }}</p>

			<dl class="entry-facts">
				<div><dt class="readout">Why</dt><dd>{{ why }}</dd></div>
				<div><dt class="readout">How</dt><dd>{{ how }}</dd></div>
			</dl>

			<ul class="entry-tags">
				<li v-for="t in tags" :key="t" class="readout">{{ t }}</li>
			</ul>

			<dl class="entry-card">
				<div class="entry-row">
					<dt class="readout">Cost</dt>
					<dd class="readout !text-[var(--text)] text-right">{{ cost }}</dd>
				</div>
				<div class="entry-trade">
					<dt class="readout !text-[var(--text)]">Trade-off —</dt>
					<dd>{{ tradeoff }}</dd>
				</div>
			</dl>
		</div>

		<div class="entry-demo js-reveal">
			<p class="readout entry-live">
				<span class="entry-live-dot" aria-hidden="true"></span>
				Live
			</p>
			<slot />
		</div>
	</article>
</template>

<script setup>
defineProps({
	id: { type: String, required: true },
	index: { type: Number, required: true },
	path: { type: String, required: true },
	name: { type: String, required: true },
	summary: { type: String, required: true },
	why: { type: String, required: true },
	how: { type: String, required: true },
	tags: { type: Array, default: () => [] },
	cost: { type: String, required: true },
	tradeoff: { type: String, required: true },
});
</script>

<style scoped>
.entry {
	display: grid;
	grid-template-columns: 1fr;
	gap: 2rem;
	padding: 3rem 0;
	border-top: 1px solid var(--border);
}

@media (min-width: 976px) {
	.entry {
		grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
		gap: 3rem;
		padding: 4rem 0;
	}
}

.entry-name {
	margin-top: 0.75rem;
	font-size: clamp(2.5rem, 5vw, 4rem);
	line-height: 0.9;
}

.entry-summary {
	margin-top: 1rem;
	font-size: 1.0625rem;
	line-height: 1.6;
	color: var(--text);
	max-width: 46ch;
}

.entry-facts {
	display: flex;
	flex-direction: column;
	gap: 1.25rem;
	margin-top: 1.75rem;
}

.entry-facts > div {
	display: grid;
	grid-template-columns: 4.5rem 1fr;
	gap: 1rem;
}

.entry-facts dd {
	font-size: 0.9375rem;
	line-height: 1.6;
	color: var(--text-muted);
}

.entry-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 0.4rem;
	margin-top: 1.5rem;
}

.entry-tags li {
	padding: 0.3rem 0.55rem;
	border: 1px solid var(--border);
	color: var(--text);
	text-transform: none;
	letter-spacing: 0.04em;
}

.entry-card {
	margin-top: 1.5rem;
	padding: 1rem 1.25rem;
	border: 1px solid var(--border);
}

.entry-row {
	display: flex;
	justify-content: space-between;
	gap: 1rem;
	padding-bottom: 0.75rem;
	border-bottom: 1px solid var(--border);
}

.entry-trade {
	padding-top: 0.75rem;
	font-size: 0.9375rem;
	line-height: 1.55;
	color: var(--text-muted);
}

.entry-trade dt {
	display: inline;
	margin-right: 0.4rem;
}

.entry-trade dd {
	display: inline;
}

.entry-demo {
	position: relative;
	min-height: 22rem;
	border: 1px solid var(--border);
	background: #050506;
	overflow: hidden;
}

@media (min-width: 976px) {
	.entry-demo {
		position: sticky;
		top: 6rem;
		align-self: start;
		min-height: 34rem;
	}
}

.entry-live {
	position: absolute;
	top: 0.9rem;
	left: 1rem;
	z-index: 5;
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
}

.entry-live-dot {
	width: 6px;
	height: 6px;
	border-radius: 50%;
	background: #3ddc84;
}
</style>
