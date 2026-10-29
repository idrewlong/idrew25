// Which link clicks become GA events, and what they're called. The click
// listener in plugins/analytics.client.ts calls this for every link.

export type TrackedEvent = { name: string; params: Record<string, string> };

type Context = {
	origin: string; // this site's origin, to tell internal links apart
	location: string; // where on the page the link sits (header, about, …)
	project?: string; // set on links inside a project
};

export function classifyLink(href: string, { origin, location, project }: Context): TrackedEvent | null {
	if (!href) return null;
	const at = { link_location: location };

	if (href.startsWith('mailto:')) return { name: 'email_click', params: at };

	let url: URL;
	try {
		url = new URL(href, origin);
	} catch {
		return null;
	}
	if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;

	if (url.origin === origin) {
		const path = decodeURIComponent(url.pathname).toLowerCase();
		return path.endsWith('.pdf') && path.includes('resume') ? { name: 'resume_download', params: at } : null;
	}

	const host = url.hostname.replace(/^www\./, '');
	if (host === 'linkedin.com') return { name: 'social_click', params: { network: 'linkedin', ...at } };

	if (host === 'github.com') {
		const [, repo] = url.pathname.split('/').filter(Boolean);
		if (!repo) return { name: 'social_click', params: { network: 'github', ...at } };
		return { name: 'project_click', params: { project: project ?? repo, link_type: 'source', ...at } };
	}

	return project ? { name: 'project_click', params: { project, link_type: 'live', ...at } } : null;
}
