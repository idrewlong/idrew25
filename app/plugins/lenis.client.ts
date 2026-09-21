import Lenis from 'lenis';
import type { ScrollToOptions } from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/** Sticky header height — anchor targets land below it. */
const HEADER_OFFSET = 84;

/** Feel for programmatic jumps (anchors, back-to-top). */
const SCROLL_TO: ScrollToOptions = { offset: -HEADER_OFFSET, duration: 1.2 };

export default defineNuxtPlugin((nuxtApp) => {
	gsap.registerPlugin(ScrollTrigger);

	let lenis: Lenis | null = null;

	const raf = (time: number) => {
		// gsap.ticker reports seconds, lenis expects milliseconds.
		lenis?.raf(time * 1000);
	};

	const create = () => {
		if (lenis) return;

		lenis = new Lenis({
			// Exponential catch-up: reacts instantly to new input instead of
			// running a fixed-length tween, which is what keeps it from feeling laggy.
			lerp: 0.1,
			wheelMultiplier: 1,
			smoothWheel: true,
			// Leave touch devices on native momentum — it already feels right there.
			syncTouch: false,
			// Let nested scrollers (the articles carousel) keep their own scroll.
			allowNestedScroll: true,
			anchors: SCROLL_TO,
			autoRaf: false,
		});

		lenis.on('scroll', ScrollTrigger.update);
		gsap.ticker.add(raf);
		// Lenis drives scroll from the ticker; lag smoothing would stall it.
		gsap.ticker.lagSmoothing(0);
	};

	const destroy = () => {
		if (!lenis) return;
		gsap.ticker.remove(raf);
		gsap.ticker.lagSmoothing(500, 33);
		lenis.destroy();
		lenis = null;
	};

	const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
	const sync = () => (motionQuery.matches ? destroy() : create());

	sync();
	motionQuery.addEventListener('change', sync);

	// New page = new layout. Resync lenis' cached position and remeasure triggers.
	nuxtApp.hook('page:finish', () => {
		requestAnimationFrame(() => {
			lenis?.resize();
			ScrollTrigger.refresh();
		});
	});

	const scroll = {
		/** Raw Lenis instance, or null under `prefers-reduced-motion: reduce`. */
		get lenis() {
			return lenis;
		},
		/** Scroll to a target, falling back to native scroll when lenis is off. */
		to(target: number | string | HTMLElement, overrides: ScrollToOptions = {}) {
			const options = { ...SCROLL_TO, ...overrides };

			if (lenis) {
				lenis.scrollTo(target, options);
				return;
			}

			const el =
				typeof target === 'string' ? document.querySelector(target) : target;
			const top =
				typeof target === 'number'
					? target
					: el
						? el.getBoundingClientRect().top + window.scrollY
						: null;
			if (top === null) return;

			window.scrollTo({ top: top + (options.offset ?? 0), behavior: 'auto' });
		},
		stop() {
			lenis?.stop();
		},
		start() {
			lenis?.start();
		},
	};

	return {
		provide: { scroll },
	};
});
