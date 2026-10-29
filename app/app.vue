<template>
	<div class="min-h-screen flex flex-col">
		<a href="#main" class="skip-link">Skip to content</a>
		<Preloader v-if="showPreloader" @done="showPreloader = false" />
		<Header />
		<main id="main" tabindex="-1" class="grow">
			<NuxtPage :transition="pageTransition" />
		</main>
		<Footer />
		<ScrollToTop />
		<ClientOnly>
			<SiteCursor />
			<AssistantChat />
		</ClientOnly>
		<!-- Hairline frame around the viewport (desktop) -->
		<div class="page-frame" aria-hidden="true">
			<span class="page-frame-tick page-frame-tick--tl">+</span>
			<span class="page-frame-tick page-frame-tick--tr">+</span>
			<span class="page-frame-tick page-frame-tick--bl">+</span>
			<span class="page-frame-tick page-frame-tick--br">+</span>
		</div>
	</div>
</template>

<script setup>
import { pendingScroll } from './router.options';
import { startPageLeave, finishPageLeave } from '~/composables/usePageLeave';

// Share card defaults for every page; pages set their own title and
// description, and blog posts swap in their cover image. Absolute URLs:
// crawlers don't resolve relative ones.
const SITE = 'https://www.idrewlong.com';
useSeoMeta({
	ogSiteName: 'Andrew Long',
	ogImage: `${SITE}/og/andrew-long.jpg`,
	ogImageType: 'image/jpeg',
	ogImageWidth: 1200,
	ogImageHeight: 630,
	ogImageAlt: 'Andrew Long, senior full stack developer: "I build reliable apps" beside a dot-matrix globe with live satellite orbits',
	twitterCard: 'summary_large_image',
});

// Only play the preloader when the visit starts on the home page. (A link to
// a section, idrewlong.com/#projects, skips it: see Preloader.vue.)
const route = useRoute();
const showPreloader = ref(route.path === '/');

const { $scroll, $ScrollTrigger } = useNuxtApp();

const jump = (y) => {
	$scroll.lenis?.scrollTo(y, { immediate: true, force: true });
	window.scrollTo(0, y);
};

// Lands a section link just under the header, once pins have laid out
const jumpToHash = (hash) => {
	const el = hash && document.querySelector(hash);
	if (!el) return;
	$ScrollTrigger.refresh();
	$scroll.lenis?.resize();
	jump(el.getBoundingClientRect().top + window.scrollY - 84);
};

// A first visit straight to a section: the browser jumps to the anchor
// before the pinned sections above it exist, so redo it once they do
onMounted(() => {
	if (!route.hash) return;
	setTimeout(() => requestAnimationFrame(() => jumpToHash(route.hash)), 300);
});

// Out-in fade. Scroll moves while the old page is gone and the new one hasn't
// rendered, so nothing is ever seen jumping. Each page then plays its own
// open animation.
const pageTransition = {
	name: 'page',
	mode: 'out-in',
	onBeforeLeave() {
		startPageLeave();
	},
	// Old page has faded out: run the cleanup it deferred, then reset scroll
	onAfterLeave() {
		finishPageLeave();
		jump(0);
	},
	onLeaveCancelled() {
		finishPageLeave();
	},
	// New page is in the DOM but still transparent. Back/forward positions are
	// restored here, two frames in, once pins and lazy sections have laid out;
	// earlier, the shorter page would clamp the position.
	onEnter() {
		const { top, hash } = pendingScroll;
		pendingScroll.top = 0;
		pendingScroll.hash = '';
		if (top <= 0 && !hash) return;
		requestAnimationFrame(() =>
			requestAnimationFrame(() => {
				// Section links (Work → /#projects) land just under the header
				if (hash) return jumpToHash(hash);
				$ScrollTrigger.refresh();
				$scroll.lenis?.resize();
				jump(top);
			})
		);
	},
};
</script>

<style>
/* First Tab stop on every page; hidden until focused */
.skip-link {
	position: fixed;
	top: 12px;
	left: 12px;
	z-index: 100000;
	padding: 0.75rem 1rem;
	background: var(--accent);
	color: #0a0b0c;
	font-family: 'Geist Mono', monospace;
	font-size: 12px;
	letter-spacing: 0.15em;
	text-transform: uppercase;
	text-decoration: none;
	transform: translateY(-200%);
}

.skip-link:focus {
	transform: none;
}

#main:focus {
	outline: none;
}

.page-frame {
	display: none;
}

@media (min-width: 976px) {
	.page-frame {
		display: block;
		position: fixed;
		inset: 8px;
		z-index: 60;
		pointer-events: none;
		border: 1px solid var(--border);
	}
}

.page-frame-tick {
	position: absolute;
	font-family: 'Geist Mono', monospace;
	font-size: 12px;
	line-height: 1;
	color: var(--text-muted);
}
.page-frame-tick--tl { top: -6px; left: -4px; }
.page-frame-tick--tr { top: -6px; right: -4px; }
.page-frame-tick--bl { bottom: -6px; left: -4px; }
.page-frame-tick--br { bottom: -6px; right: -4px; }

.page-enter-active,
.page-leave-active {
	transition: opacity 0.25s ease;
}
.page-enter-from,
.page-leave-to {
	opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
	.page-enter-active,
	.page-leave-active {
		transition: none;
	}
}
</style>
