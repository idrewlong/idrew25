import type { ContributionDay } from '../utils/github';

const USER = 'idrewlong';
// Half a year fits beside the Shipping heading
const WEEKS = 26;

export interface GithubPulse {
	days: ContributionDay[];
	totals: { week: number; month: number; year: number };
	repos: { name: string; at: string }[];
}

// The contribution calendar is the one on the GitHub profile: every
// contribution, including private repos as counts only. Repos come from the
// public events feed, so only public ones are named. Both are cached, so
// GitHub sees a couple of requests every few hours.
export default defineCachedEventHandler(
	async (): Promise<GithubPulse> => {
		const { githubToken } = useRuntimeConfig();
		const headers: Record<string, string> = { 'User-Agent': 'idrewlong.com' };

		const [html, events] = await Promise.all([
			$fetch<string>(`https://github.com/users/${USER}/contributions`, {
				headers,
				responseType: 'text',
				timeout: 10_000,
			}).catch(() => ''),
			$fetch<unknown[]>(`https://api.github.com/users/${USER}/events/public?per_page=100`, {
				headers: {
					...headers,
					Accept: 'application/vnd.github+json',
					...(githubToken ? { Authorization: `Bearer ${githubToken}` } : {}),
				},
				timeout: 10_000,
			}).catch(() => []),
		]);

		const all = parseContributions(html);
		const today = all.at(-1)?.date;
		// Start on a Sunday so each column of the grid is one week
		let start = Math.max(0, all.length - WEEKS * 7);
		while (start < all.length && new Date(`${all[start].date}T00:00:00Z`).getUTCDay() !== 0) start++;
		return {
			days: all.slice(start),
			totals: today ? summarizeContributions(all, today) : { week: 0, month: 0, year: 0 },
			repos: recentRepos(events, 4),
		};
	},
	{ name: 'github-pulse', maxAge: 60 * 60 * 3, swr: true }
);
