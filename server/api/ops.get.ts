import { DEFAULT_ASSISTANT_MODEL, ciState, githubHeaders, modelLabel, uptimeSummary, type CiState, type UptimeSummary } from '../utils/ops';
import { assistantToday, storedLighthouse, uptimeSamples } from '../utils/opsStore';

export interface OpsPayload {
	deploy: { sha: string; ref: string; message: string; builtAt: string; env: string };
	ci: { state: CiState; checks: number } | null;
	assistant: {
		model: string;
		dailyCap: number;
		today: { questions: number; costUsd: number; tokens: number } | null;
	};
	lighthouse: Awaited<ReturnType<typeof storedLighthouse>>;
	uptime: UptimeSummary | null;
	generatedAt: string;
}

// What the teardown ops panel shows. Cached at Vercel's edge for 60 seconds
// (isr rule in nuxt.config.ts), so the panel can also show whether your own
// request was answered by the edge cache. Every part is best effort: a slow or
// missing source drops that row instead of failing the panel.
export default defineEventHandler(async (): Promise<OpsPayload> => {
	const config = useRuntimeConfig();
	const deploy = config.deploy as OpsPayload['deploy'] & { repo: string };
	const model = config.assistantModel || DEFAULT_ASSISTANT_MODEL;

	const [ci, today, lighthouse, samples] = await Promise.all([
		checkRuns(deploy.repo, deploy.sha, config.githubToken),
		assistantToday().catch(() => null),
		storedLighthouse().catch(() => null),
		uptimeSamples().catch(() => null),
	]);
	const uptime = samples?.length ? uptimeSummary(samples, Date.now()) : null;

	return {
		deploy: { sha: deploy.sha, ref: deploy.ref, message: deploy.message, builtAt: deploy.builtAt, env: deploy.env },
		ci,
		assistant: { model: modelLabel(model), dailyCap: Number(config.assistantDailyCap) || 300, today },
		lighthouse,
		uptime,
		generatedAt: new Date().toISOString(),
	};
});

// GitHub check runs for the deployed commit. The repo is public, so the token
// is optional; it only raises GitHub's rate limit.
async function checkRuns(repo: string, sha: string, token: string): Promise<OpsPayload['ci']> {
	if (!repo || !sha) return null;
	try {
		const res = await $fetch<{ check_runs?: { status?: string; conclusion?: string | null }[] }>(
			`https://api.github.com/repos/${repo}/commits/${sha}/check-runs`,
			{
				headers: githubHeaders(token),
				timeout: 5_000,
			}
		);
		const runs = res.check_runs ?? [];
		const state = ciState(runs);
		return state ? { state, checks: runs.length } : null;
	} catch {
		return null;
	}
}
