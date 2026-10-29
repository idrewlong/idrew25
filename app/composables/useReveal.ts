import type { Ref } from 'vue';
import { onPageLeft } from './usePageLeave';

/**
 * Scroll reveal for every `.js-reveal` element inside `root`.
 *
 * One scoped matchMedia per component, reverted on unmount. Elements are
 * hidden in CSS (`.js-reveal { visibility: hidden }`) so nothing flashes
 * before the tween; the reduced-motion branch just shows them.
 */
export function useReveal(root: Ref<HTMLElement | null>) {
	const { $gsap, $ScrollTrigger } = useNuxtApp();
	let mm: gsap.MatchMedia | undefined;

	onMounted(() => {
		if (!root.value) return;
		mm = $gsap.matchMedia(root.value);

		mm.add(
			{
				motion: '(prefers-reduced-motion: no-preference)',
				reduce: '(prefers-reduced-motion: reduce)',
			},
			(ctx) => {
				const items = root.value!.querySelectorAll<HTMLElement>('.js-reveal');
				if (ctx.conditions?.reduce) {
					$gsap.set(items, { autoAlpha: 1 });
					return;
				}

				$gsap.set(items, { autoAlpha: 0, y: 24 });
				$ScrollTrigger.batch(items, {
					start: 'top 88%',
					once: true,
					onEnter: (batch) =>
						$gsap.to(batch, {
							autoAlpha: 1,
							y: 0,
							duration: 0.8,
							ease: 'expo.out',
							stagger: 0.06,
							overwrite: true,
						}),
				});
			}
		);
	});

	onPageLeft(() => mm?.revert());
}
