import type { PushSummary } from '../utils/github';

const USER = 'idrewlong';
const LIMIT = 6;

export interface ShipEntry extends PushSummary {
	message: string;
	url: string;
}

// Public events only include public repos. Commit messages need one lookup
// per push. Unauthenticated GitHub allows 60 calls/hour per server; a 30-min
// cache keeps this to ~7 calls per window. NUXT_GITHUB_TOKEN raises the limit.
export default defineCachedEventHandler(
	async (): Promise<ShipEntry[]> => {
		const { githubToken } = useRuntimeConfig();
		const headers: Record<string, string> = {
			Accept: 'application/vnd.github+json',
			'User-Agent': 'idrewlong.com',
		};
		if (githubToken) headers.Authorization = `Bearer ${githubToken}`;

		const events = await $fetch<unknown[]>(`https://api.github.com/users/${USER}/events/public?per_page=50`, {
			headers,
			timeout: 10_000,
		});
		const pushes = latestPushes(events, LIMIT);

		return Promise.all(
			pushes.map(async (p) => {
				const commit = await $fetch<{ commit?: { message?: string }; html_url?: string }>(
					`https://api.github.com/repos/${p.repo}/commits/${p.sha}`,
					{ headers, timeout: 10_000 }
				).catch(() => null);
				return {
					...p,
					message: commit?.commit?.message?.split('\n')[0]?.slice(0, 120) ?? '',
					url: commit?.html_url ?? `https://github.com/${p.repo}/commit/${p.sha}`,
				};
			})
		);
	},
	{ name: 'github-activity', maxAge: 60 * 30, swr: true }
);
