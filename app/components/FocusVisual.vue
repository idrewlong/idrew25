<template>
	<div
		ref="host"
		class="fv"
		role="group"
		:aria-label="art.ariaLabel"
		tabindex="0"
		@pointermove="onMove"
		@pointerleave="onLeave"
		@click="onTap"
		@keydown="onKey"
		@blur="art.blur()"
	>
		<canvas ref="canvas" aria-hidden="true"></canvas>
		<!-- What the artwork just did (a tool call, a layer, a closed gap) -->
		<ol class="readout fv-log" aria-hidden="true">
			<li v-for="line in log" :key="line.id">{{ line.text }}</li>
		</ol>
		<!-- Screen readers hear only the results of their own actions, not the idle loop -->
		<p class="sr-only" aria-live="polite">{{ announced }}</p>
		<span class="readout fv-label" aria-hidden="true">{{ art.label }}</span>
		<span class="readout fv-hint" aria-hidden="true">{{ hint }}</span>
	</div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { createAi } from '~/scenes/focus/ai';
import { createBuild } from '~/scenes/focus/build';
import { createCloud } from '~/scenes/focus/cloud';

/**
 * Interactive Canvas 2D artwork for the focus rows. The artworks live in
 * app/scenes/focus/ (see shared.js for their shape); this component owns the
 * canvas, the draw loop and the log line.
 *   ai    — an agent calling real crawlmark tools
 *   build — the stack, data to edge, pulled apart under the pointer
 *   cloud — a perimeter scan whose sweep closes open gaps
 * Draws only while on screen. Reduced motion: no idle animation, but the
 * pointer and keys still work, one frame at a time.
 */
const props = defineProps({
	kind: { type: String, required: true }, // 'ai' | 'build' | 'cloud'
});

const host = ref(null);
const canvas = ref(null);
const log = ref([]);
const announced = ref('');
let ctx, w, h, raf, io, ro, visible = false;

// Read before the artwork is created, which only happens in the browser
const reduce = import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function say(text, user) {
	log.value = [...log.value, { id: performance.now() + Math.random(), text }].slice(-3);
	if (user) announced.value = text;
	if (reduce) paint();
}

const factories = { ai: createAi, build: createBuild, cloud: createCloud };
const art = factories[props.kind]({ say, reduce });
const hint = ref(art.hint.touch);

function paint(t = performance.now()) {
	if (!ctx || !w || !h) return;
	const dpr = Math.min(window.devicePixelRatio || 1, 2);
	ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	ctx.clearRect(0, 0, w, h);
	art.draw(ctx, w, h, t);
}

function loop(t) {
	paint(t);
	raf = visible && !reduce ? requestAnimationFrame(loop) : null;
}

function resize() {
	if (!host.value || !canvas.value) return;
	const dpr = Math.min(window.devicePixelRatio || 1, 2);
	w = host.value.clientWidth;
	h = host.value.clientHeight;
	if (!w || !h) return;
	canvas.value.width = Math.round(w * dpr);
	canvas.value.height = Math.round(h * dpr);
	ctx = canvas.value.getContext('2d');
	paint();
}

// Pointer position in canvas pixels
function local(e) {
	const r = canvas.value.getBoundingClientRect();
	return [e.clientX - r.left, e.clientY - r.top];
}

function onMove(e) {
	// Touch fires pointermove while scrolling; only taps count on touch
	if (e.pointerType === 'touch') return;
	host.value.style.cursor = art.move(...local(e)) || '';
	if (reduce) paint();
}

function onLeave() {
	art.leave();
	if (reduce) paint();
}

function onTap(e) {
	art.tap(...local(e));
	if (reduce) paint();
}

function onKey(e) {
	if (!art.key(e.key)) return;
	e.preventDefault();
	if (reduce) paint();
}

onMounted(() => {
	if (window.matchMedia('(hover: hover)').matches) hint.value = art.hint.mouse;
	resize();
	ro = new ResizeObserver(resize);
	ro.observe(host.value);
	io = new IntersectionObserver(([entry]) => {
		visible = entry.isIntersecting;
		if (visible && !raf && !reduce) raf = requestAnimationFrame(loop);
	});
	io.observe(host.value);
});

onBeforeUnmount(() => {
	cancelAnimationFrame(raf);
	io?.disconnect();
	ro?.disconnect();
});
</script>

<style scoped>
.fv {
	position: relative;
	aspect-ratio: 4 / 3;
	border: 1px solid var(--border);
	background: #08090a;
	overflow: hidden;
}

.fv canvas {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
}

.fv-label {
	position: absolute;
	left: 0.75rem;
	bottom: 0.6rem;
}

.fv {
	touch-action: manipulation;
}

.fv:focus-visible {
	outline: 2px solid var(--accent);
	outline-offset: 2px;
}

.fv-hint {
	position: absolute;
	right: 0.75rem;
	bottom: 0.6rem;
	color: var(--accent);
}

.fv-log {
	position: absolute;
	top: 0.6rem;
	left: 0.75rem;
	right: 0.75rem;
	display: flex;
	flex-direction: column;
	gap: 0.2rem;
	text-transform: none;
	letter-spacing: 0.04em;
	pointer-events: none;
}

.fv-log li {
	color: var(--text-muted);
}

.fv-log li:last-child {
	color: var(--text);
}

/* The smallest phones: the caption alone fills the bottom row */
@media (max-width: 359px) {
	.fv-hint {
		display: none;
	}
}

/* Phones: only the latest line fits above the artwork */
@media (max-width: 639px) {
	.fv-log li:not(:last-child) {
		display: none;
	}
}
</style>
