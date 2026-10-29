/**
 * Click handler for nav links that point at a home page section
 * ("/#projects"). When the URL already ends in that hash the router ignores
 * the click, so this scrolls there itself. Every other case navigates:
 * router.options scrolls on the same page, app.vue after a page change.
 */
export function useSectionLink() {
	const route = useRoute();
	const { $scroll } = useNuxtApp();

	return (event: MouseEvent, to: string) => {
		const hash = to.split('#')[1];
		if (!hash || route.fullPath !== to) return;
		if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
		$scroll.to(`#${hash}`);
	};
}
