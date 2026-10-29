<template>
	<nav :aria-labelledby="labelId" class="toc">
		<p :id="labelId" class="toc-label">On this page</p>
		<ol class="toc-list">
			<li v-for="heading in headings" :key="heading.id">
				<a
					:href="`#${heading.id}`"
					class="toc-link"
					:class="{
						'toc-link--sub': heading.level === 3,
						'toc-link--active': activeId === heading.id,
					}"
					:aria-current="activeId === heading.id ? 'location' : undefined"
					@click.prevent="goTo(heading.id)"
				>
					{{ heading.text }}
				</a>
			</li>
		</ol>
	</nav>
</template>

<script setup lang="ts">
import { ref, watch, useId, onMounted, onUnmounted } from 'vue';
import type { Heading } from '~~/server/utils/types';

const props = defineProps<{ headings: Heading[] }>();
const emit = defineEmits<{ navigate: [] }>();

const { $scroll } = useNuxtApp();
const labelId = useId();
const activeId = ref<string | null>(null);

// A heading becomes "current" as the reader approaches it: once it rises
// above a line about a third of the way down the viewport, rather than only
// after it has scrolled up under the header. Never less than 140px, so a
// heading jumped to from the TOC (which lands ~84px down) is always current.
//
// Short final sections can't scroll up to that line before the page ends, so
// over the last screen of scroll the line slides down to the bottom of the
// viewport. Each remaining heading still crosses it in order, and the last
// one is reached exactly at the bottom, instead of later sections being
// skipped.
function activeLine(): number {
	const vh = window.innerHeight;
	const base = Math.max(140, vh * 0.33);
	const remaining =
		document.documentElement.scrollHeight - (window.scrollY + vh);
	if (remaining >= vh) return base;
	const progress = 1 - Math.max(remaining, 0) / vh;
	return base + (vh - base) * progress;
}

// Set when a TOC link is clicked. A heading near the end can't scroll all
// the way up, so the sliding line could otherwise hand "current" to a later
// heading; the clicked one stays current until the reader scrolls again.
let pinnedId: string | null = null;
const USER_SCROLL_EVENTS = ['wheel', 'touchstart', 'keydown'] as const;
const releasePin = () => {
	pinnedId = null;
};

function updateActive() {
	if (pinnedId) {
		activeId.value = pinnedId;
		return;
	}
	const line = activeLine();
	let current: string | null = null;
	for (const { id } of props.headings) {
		const el = document.getElementById(id);
		if (!el) continue;
		if (el.getBoundingClientRect().top <= line) current = id;
		else break;
	}
	activeId.value = current;
}

let frame = 0;
function onScroll() {
	cancelAnimationFrame(frame);
	frame = requestAnimationFrame(updateActive);
}

function goTo(id: string) {
	const el = document.getElementById(id);
	if (!el) return;
	// Emitted before scrolling: the mobile menu collapses on navigate, and
	// that layout shift has to land before the scroll target is measured.
	emit('navigate');
	// Goes through Lenis like every other jump on the site; it handles the
	// header offset and falls back to an instant jump under reduced motion.
	$scroll.to(el);
	// Move focus with the scroll so keyboard and screen-reader users land
	// on the section too.
	el.setAttribute('tabindex', '-1');
	el.focus({ preventScroll: true });
	history.replaceState(history.state, '', `#${id}`);
	pinnedId = id;
	activeId.value = id;
}

watch(() => props.headings, () => requestAnimationFrame(updateActive));

onMounted(() => {
	updateActive();
	window.addEventListener('scroll', onScroll, { passive: true });
	window.addEventListener('resize', onScroll, { passive: true });
	for (const type of USER_SCROLL_EVENTS) {
		window.addEventListener(type, releasePin, { passive: true });
	}
});

onUnmounted(() => {
	cancelAnimationFrame(frame);
	window.removeEventListener('scroll', onScroll);
	window.removeEventListener('resize', onScroll);
	for (const type of USER_SCROLL_EVENTS) {
		window.removeEventListener(type, releasePin);
	}
});
</script>

<style scoped>
.toc-label {
	margin: 0 0 0.875rem;
	font-family: 'Geist Mono', monospace;
	font-size: 10px;
	letter-spacing: 0.2em;
	text-transform: uppercase;
	color: var(--text-muted, #78716c);
}

.toc-list {
	list-style: none;
	margin: 0;
	padding: 0;
	border-left: 1px solid var(--border, #e7e5e0);
}

.toc-link {
	display: block;
	margin-left: -1.5px;
	padding: 0.4rem 0 0.4rem 0.875rem;
	border-left: 2px solid transparent;
	font-size: 0.8125rem;
	line-height: 1.4;
	color: var(--text-muted, #78716c);
	text-decoration: none;
	transition:
		color 0.15s ease,
		border-color 0.15s ease;
}

.toc-link--sub {
	padding-left: 1.75rem;
	font-size: 0.75rem;
}

.toc-link:hover {
	color: var(--text, #1c1917);
}

.toc-link--active {
	color: var(--accent);
	border-left-color: var(--accent);
}

.toc-link:focus-visible {
	outline: 2px solid var(--accent);
	outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
	.toc-link {
		transition: none;
	}
}
</style>
