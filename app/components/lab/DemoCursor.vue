<template>
	<div class="cur">
		<div class="cur-zone">
			<p class="readout">01 · Idle</p>
			<p class="cur-copy">Move across this panel. The arrow tracks the pointer exactly; the orange square trails it.</p>
		</div>
		<div class="cur-zone">
			<p class="readout">02 · Links</p>
			<a href="#cursor" class="btn btn-ghost" @click.prevent>Hover me</a>
		</div>
		<div class="cur-zone cur-zone--drag" data-cursor="drag">
			<p class="readout">03 · Drag zones</p>
			<p class="cur-copy">Anything draggable, like the hero globe, gets a tag.</p>
		</div>
		<p v-if="off" class="readout cur-note">Off right now: touch screens and reduced motion keep the native cursor.</p>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const off = ref(false);
onMounted(() => {
	off.value = !window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches;
});
</script>

<style scoped>
.cur {
	position: absolute;
	inset: 0;
	display: grid;
	grid-template-rows: repeat(3, 1fr) auto;
	padding-top: 3rem;
}

.cur-zone {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
	gap: 0.75rem;
	padding: 1.25rem 1.5rem;
	border-top: 1px solid var(--border);
}

.cur-zone--drag {
	background: repeating-linear-gradient(-45deg, transparent 0 10px, rgba(255, 91, 31, 0.05) 10px 11px);
}

.cur-copy {
	font-size: 0.9375rem;
	line-height: 1.5;
	color: var(--text-muted);
	max-width: 40ch;
}

.cur-note {
	padding: 0.75rem 1.5rem;
	border-top: 1px solid var(--border);
	text-transform: none;
	letter-spacing: 0.04em;
}
</style>
