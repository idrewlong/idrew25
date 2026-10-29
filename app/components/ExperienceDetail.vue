<template>
	<div class="xpd">
		<!-- The accordion header already shows company and dates -->
		<p v-if="showTitle" class="readout xpd-meta">
			<span class="text-[var(--text)]">{{ exp.company }}</span>
			<span aria-hidden="true">·</span>
			<span>{{ exp.period }}</span>
		</p>
		<h3 v-if="showTitle" class="display xpd-title">{{ exp.title }}</h3>

		<!-- Key numbers, lifted from the bullets below -->
		<dl v-if="exp.highlights?.length" class="xpd-stats">
			<div v-for="h in exp.highlights" :key="h.label" class="xpd-stat">
				<dt class="readout">{{ h.label }}</dt>
				<dd class="display xpd-value">{{ h.value }}</dd>
			</div>
		</dl>

		<ul class="xpd-points">
			<li v-for="(ach, j) in exp.achievements" :key="j">{{ ach }}</li>
		</ul>

		<ul v-if="exp.focus?.length" class="xpd-focus" aria-label="Focus areas">
			<li v-for="f in exp.focus" :key="f" class="readout">{{ f }}</li>
		</ul>
	</div>
</template>

<script setup>
defineProps({
	exp: { type: Object, required: true },
	// The accordion's button already names the role, company and dates
	showTitle: { type: Boolean, default: true },
});
</script>

<style scoped>
.xpd-meta {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
}

.xpd-title {
	margin-top: 0.75rem;
	font-size: clamp(2rem, 4vw, 3.5rem);
	line-height: 0.95;
}

.xpd-stats {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
	margin-top: 1.75rem;
	border-top: 1px solid var(--border);
	border-left: 1px solid var(--border);
}

.xpd-stat {
	display: flex;
	flex-direction: column-reverse;
	gap: 0.4rem;
	padding: 0.9rem 1rem 1rem;
	border-right: 1px solid var(--border);
	border-bottom: 1px solid var(--border);
}

.xpd-value {
	font-size: clamp(2rem, 3.4vw, 2.75rem);
	line-height: 0.9;
	color: var(--accent);
}

.xpd-points {
	margin-top: 1.75rem;
	display: flex;
	flex-direction: column;
	gap: 12px; /* whole pixels keep each row's 1px dash crisp */
	max-width: 70ch;
}

.xpd-points li {
	position: relative;
	padding-left: 1.25rem;
	font-size: 0.9375rem;
	line-height: 1.6;
	color: var(--text-muted);
}

.xpd-points li::before {
	content: '';
	position: absolute;
	left: 0;
	/* Whole-pixel offset: a 1px line on a fractional y renders half-faded */
	top: 12px;
	width: 8px;
	height: 1px;
	background: var(--accent);
}

.xpd-focus {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
	margin-top: 1.5rem;
}

.xpd-focus li {
	padding: 0.35rem 0.6rem;
	border: 1px solid var(--border);
	color: var(--text);
}
</style>
