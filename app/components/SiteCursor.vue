<template>
	<div v-if="enabled" class="cursor" aria-hidden="true">
		<!-- Trailing accent square, a beat behind the pointer -->
		<div ref="trail" class="cursor-trail" :class="stateClass"></div>
		<!-- Arrow pointer: tip is the hotspot, like the native cursor -->
		<div ref="arrow" class="cursor-arrow" :class="stateClass">
			<svg viewBox="0 0 20 22" width="20" height="22">
				<path d="M1.5 1.5 L18 9.2 L10.6 11.2 L7.6 19.5 Z" />
			</svg>
			<span class="cursor-tag">Drag</span>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';

/**
 * Site-wide arrow cursor. Only on fine pointers with motion allowed; touch
 * and reduced-motion users keep the native cursor. Inside #projects it steps
 * aside for that section's own "See the work" cursor.
 */

const { $gsap } = useNuxtApp();

const enabled = ref(false);
const arrow = ref(null);
const trail = ref(null);
const state = ref('hidden'); // hidden | idle | link | drag | away

const stateClass = computed(() => `is-${state.value}`);

const INTERACTIVE = 'a, button, [role="tab"], [role="button"], label, summary, select';
let moveArrow;
let moveTrail;
let mq;

const onMove = (e) => {
	moveArrow?.x(e.clientX);
	moveArrow?.y(e.clientY);
	moveTrail?.x(e.clientX);
	moveTrail?.y(e.clientY);
	if (state.value === 'hidden') state.value = 'idle';
};

const onOver = (e) => {
	const t = e.target instanceof Element ? e.target : null;
	if (!t) return;
	if (t.closest('#projects, input, textarea')) state.value = 'away';
	else if (t.closest(INTERACTIVE)) state.value = 'link';
	else if (t.closest('.hero-canvas, [data-cursor="drag"]')) state.value = 'drag';
	else state.value = 'idle';
};

const onLeaveWindow = () => {
	state.value = 'hidden';
};

function attach() {
	document.documentElement.classList.add('has-site-cursor');
	window.addEventListener('pointermove', onMove, { passive: true });
	document.addEventListener('pointerover', onOver, { passive: true });
	document.documentElement.addEventListener('pointerleave', onLeaveWindow);
	nextTick(() => {
		// The arrow tracks exactly; the accent square trails a little
		moveArrow = { x: $gsap.quickSetter(arrow.value, 'x', 'px'), y: $gsap.quickSetter(arrow.value, 'y', 'px') };
		moveTrail = {
			x: $gsap.quickTo(trail.value, 'x', { duration: 0.45, ease: 'power3.out' }),
			y: $gsap.quickTo(trail.value, 'y', { duration: 0.45, ease: 'power3.out' }),
		};
	});
}

function detach() {
	document.documentElement.classList.remove('has-site-cursor');
	window.removeEventListener('pointermove', onMove);
	document.removeEventListener('pointerover', onOver);
	document.documentElement.removeEventListener('pointerleave', onLeaveWindow);
	moveArrow = moveTrail = undefined;
}

// Turn on/off as the pointer type or motion preference changes
function sync() {
	const want = mq.matches;
	if (want === enabled.value) return;
	enabled.value = want;
	want ? attach() : detach();
}

onMounted(() => {
	mq = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)');
	mq.addEventListener('change', sync);
	sync();
});

onBeforeUnmount(() => {
	mq?.removeEventListener('change', sync);
	if (enabled.value) detach();
});
</script>

<style scoped>
.cursor {
	position: fixed;
	inset: 0;
	z-index: 10000;
	pointer-events: none;
}

.cursor-arrow,
.cursor-trail {
	position: fixed;
	top: 0;
	left: 0;
	will-change: transform;
	transition: opacity 0.2s ease;
}

/* Tip of the arrow sits on the pointer position */
.cursor-arrow {
	margin: -1px 0 0 -1px;
}

.cursor-arrow svg {
	display: block;
	overflow: visible;
	transform-origin: 2px 2px;
	transition: transform 0.2s ease;
}

.cursor-arrow path {
	fill: #ecedee;
	stroke: #0a0b0c;
	stroke-width: 1.2;
	stroke-linejoin: miter;
	transition: fill 0.2s ease;
}

/* Small square that trails behind and below the tip */
.cursor-trail {
	width: 5px;
	height: 5px;
	margin: 20px 0 0 16px;
	background: var(--accent);
}

.cursor-tag {
	position: absolute;
	top: 18px;
	left: 20px;
	padding: 3px 6px;
	background: var(--accent);
	font-family: 'Geist Mono', monospace;
	font-size: 9px;
	letter-spacing: 0.2em;
	text-transform: uppercase;
	color: #0a0b0c;
	white-space: nowrap;
	opacity: 0;
	transform: translateY(-3px);
	transition:
		opacity 0.2s ease,
		transform 0.2s ease;
}

/* States */
.is-hidden,
.is-away {
	opacity: 0;
}

.cursor-arrow.is-link svg {
	transform: scale(1.15);
}

/* Light outline keeps the orange arrow visible on orange hover fills too */
.cursor-arrow.is-link path {
	fill: var(--accent);
	stroke: #ecedee;
}

.cursor-arrow.is-drag .cursor-tag {
	opacity: 1;
	transform: none;
}

.cursor-trail.is-drag {
	opacity: 0;
}
</style>
