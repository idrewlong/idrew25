import type { RouterConfig } from '@nuxt/schema';

/**
 * Page changes don't scroll here: app.vue resets scroll in the page
 * transition's afterLeave, while the screen is blank, so the new page never
 * shows at the old position first. Back/forward positions are handed over
 * for that hook to restore; in-page anchors still scroll normally.
 */
export const pendingScroll = { top: 0, hash: '' };

export default <RouterConfig>{
	scrollBehavior(to, from, savedPosition) {
		if (to.path === from.path) {
			// Through Lenis, so the smooth scroll and pinned sections stay in sync
			if (to.hash) useNuxtApp().$scroll.to(to.hash);
			return false;
		}
		pendingScroll.top = savedPosition?.top ?? 0;
		// A link to a section on another page ("/#projects"); a saved
		// back/forward position wins over it
		pendingScroll.hash = savedPosition ? '' : to.hash;
		return false;
	},
};
