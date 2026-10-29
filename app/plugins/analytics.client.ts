import { classifyLink } from '~/utils/analytics';

/**
 * GA events for the link clicks that matter: resume downloads, GitHub and
 * LinkedIn, project source and live links, email. One listener on the
 * document, so links don't each need wiring; classifyLink decides what
 * counts. The contact form and the assistant send their own events.
 */
export default defineNuxtPlugin(() => {
	const route = useRoute();

	// Where on the page a link sits: its section, the header/footer, or the page
	function locate(el: Element) {
		const section = el.closest('section[id]');
		if (section) return section.id;
		if (el.closest('header')) return 'header';
		if (el.closest('footer')) return 'footer';
		return route.path.split('/').filter(Boolean)[0] ?? 'home';
	}

	document.addEventListener(
		'click',
		(e) => {
			const link = (e.target as Element | null)?.closest?.('a[href]');
			if (!link) return;
			const event = classifyLink(link.getAttribute('href') ?? '', {
				origin: window.location.origin,
				location: locate(link),
				project: link.closest<HTMLElement>('[data-project]')?.dataset.project,
			});
			if (event) useTrackEvent(event.name, event.params);
		},
		// Capture: still counts if a component stops the click from bubbling
		{ capture: true }
	);
});
