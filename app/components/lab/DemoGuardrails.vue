<template>
	<div class="guard">
		<p class="readout guard-cmd"><span class="text-[var(--accent)]">$</span> POST /api/assistant</p>
		<ol class="guard-list">
			<li v-for="(l, i) in layers" :key="l.name">
				<span class="readout guard-n">{{ String(i + 1).padStart(2, '0') }}</span>
				<span class="guard-name">{{ l.name }}</span>
				<span class="readout guard-code">{{ l.code }}</span>
			</li>
		</ol>
		<p class="readout guard-status">
			<span class="guard-dot" :class="enabled ? 'is-on' : ''" aria-hidden="true"></span>
			Assistant {{ enabled ? 'online' : 'offline' }} on this server
		</p>
	</div>
</template>

<script setup>
const { enabled } = useAssistant();

// In request order, as implemented in server/api/assistant.post.ts
const layers = [
	{ name: 'No key or shared storage → offline', code: '503' },
	{ name: 'Same-origin requests only', code: '403' },
	{ name: 'Body ≤ 16 KB, question ≤ 500 chars', code: '413 / 400' },
	{ name: 'Assistant turns must carry a server signature', code: '400' },
	{ name: '8 per 10 min · 25 per day per visitor (IPv6 by /64)', code: '429' },
	{ name: 'Global daily cap, atomic Upstash INCR', code: '429' },
	{ name: 'Scope-locked prompt · 1,024 token cap · low effort', code: '200' },
];
</script>

<style scoped>
.guard {
	position: absolute;
	inset: 0;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 3.5rem 1.5rem 1.5rem;
}

.guard-cmd {
	text-transform: none;
	letter-spacing: 0.06em;
	color: var(--text);
	padding-bottom: 0.9rem;
	border-bottom: 1px solid var(--border);
}

.guard-list li {
	display: grid;
	grid-template-columns: 2.25rem 1fr auto;
	align-items: baseline;
	gap: 0.75rem;
	padding: 0.85rem 0;
	border-bottom: 1px solid var(--border);
}

.guard-n {
	color: var(--accent);
}

.guard-name {
	font-family: 'Geist Mono', monospace;
	font-size: 12.5px;
	line-height: 1.5;
	color: #c9cdd2;
}

.guard-code {
	color: var(--text);
}

.guard-status {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	margin-top: 1.25rem;
}

.guard-dot {
	width: 6px;
	height: 6px;
	background: var(--text-muted);
}

.guard-dot.is-on {
	background: #3ddc84;
}
</style>
