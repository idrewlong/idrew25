<template>
	<dl class="stats">
		<div v-for="(s, i) in items" :key="s.label">
			<dd class="display">{{ s.value }}</dd>
			<dt class="readout">{{ String(i + 1).padStart(2, '0') }} · {{ s.label }}</dt>
		</div>
	</dl>
</template>

<script setup>
defineProps({ items: { type: Array, required: true } }); // [{ value, label }]
</script>

<style scoped>
.stats {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	margin-top: 2rem;
	border-top: 1px solid var(--border);
	border-left: 1px solid var(--border);
}

.stats > div {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	padding: 1.25rem;
	border-right: 1px solid var(--border);
	border-bottom: 1px solid var(--border);
}

.stats dd {
	font-size: 4rem;
	line-height: 0.85;
	font-weight: 400;
}
</style>
