import { doraMetrics, githubHeaders, type DeployRecord, type DoraMetrics } from '../../utils/ops';

type GhDeployment = { id: number; sha: string; created_at: string };
type GhStatus = { state: string; created_at: string };
type GhCommit = { commit?: { committer?: { date?: string } } };

const WINDOW_DAYS = 90;

// DORA metrics from the production deployments Vercel records on GitHub.
// Cached at the edge for an hour (nuxt.config.ts): one refresh makes about
// two GitHub calls per deploy in the window.
export default defineEventHandler(async (): Promise<DoraMetrics> => {
	const { deploy, githubToken } = useRuntimeConfig();
	const repo = (deploy as { repo?: string }).repo || 'idrewlong/idrew25';
	const gh = <T>(path: string) =>
		$fetch<T>(`https://api.github.com/repos/${repo}${path}`, { headers: githubHeaders(githubToken), timeout: 8_000 });

	try {
		const since = Date.now() - WINDOW_DAYS * 86_400_000;
		const deployments = (await gh<GhDeployment[]>('/deployments?environment=Production&per_page=100')).filter(
			(d) => Date.parse(d.created_at) >= since
		);
		const commitDates = new Map<string, Promise<string | null>>();
		const commitAt = (sha: string) => {
			if (!commitDates.has(sha)) {
				commitDates.set(sha, gh<GhCommit>(`/commits/${sha}`).then((c) => c.commit?.committer?.date ?? null, () => null));
			}
			return commitDates.get(sha)!;
		};

		const records = await Promise.all(
			deployments.map(async (d): Promise<DeployRecord> => {
				const [statuses, landed] = await Promise.all([
					gh<GhStatus[]>(`/deployments/${d.id}/statuses?per_page=10`).catch(() => [] as GhStatus[]),
					commitAt(d.sha),
				]);
				const done = statuses.find((s) => ['success', 'failure', 'error'].includes(s.state));
				return {
					sha: d.sha,
					commitAt: landed,
					createdAt: d.created_at,
					result: done ? (done.state === 'success' ? 'success' : 'failure') : null,
					finishedAt: done?.created_at ?? null,
				};
			})
		);
		return doraMetrics(records, Date.now(), WINDOW_DAYS);
	} catch (error) {
		// An error, not a cached null, so the edge doesn't keep it for an hour
		console.error('[ops] DORA metrics unavailable', error);
		throw createError({ statusCode: 502, statusMessage: 'GitHub unavailable' });
	}
});
