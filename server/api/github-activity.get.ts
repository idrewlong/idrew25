import type { PushSummary } from '../utils/github';

const USER = 'idrewlong';
const LIMIT = 6;

export interface ShipEntry extends PushSummary {
	message: string;
	url: string;
}

// Public events only include public repos. Commit messages need one lookup
// per push, so each refresh is ~7 GitHub calls. NUXT_GITHUB_TOKEN lifts the
// limit from 60/hour per IP (shared on Vercel) to 5,000/hour.
//
// Caching lives only in the `swr` route rule in nuxt.config.ts. A second
// layer here (defineCachedEventHandler with swr) handed the route cache its
// own stale copy on every refresh, so the feed froze for weeks. If GitHub
// fails, the error propagates and the route cache keeps the last good copy.
export default defineEventHandler(
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
	}
);
