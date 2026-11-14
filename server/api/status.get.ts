import { outages, siteState, uptimePct, uptimeSummary, type Outage, type SiteState, type UptimeSummary } from '../utils/ops';
import { storedLighthouse, uptimeSamples } from '../utils/opsStore';

export interface StatusPayload {
	state: SiteState;
	since: number | null; // first check on record
	windows: { label: string; pct: number | null }[];
	history: UptimeSummary; // 90 days
	outages: Outage[];
	lighthouse: Awaited<ReturnType<typeof storedLighthouse>>;
	deploy: { sha: string; builtAt: string };
	generatedAt: string;
}

// The /status page. Built from the ops-monitor GitHub Action's checks and
// cached at the edge for five minutes (nuxt.config.ts).
export default defineEventHandler(async (): Promise<StatusPayload> => {
	const now = Date.now();
	const [samples, lighthouse] = await Promise.all([
		uptimeSamples().catch(() => null),
		storedLighthouse().catch(() => null),
	]);
	const list = samples ?? [];
	const last = list.reduce<(typeof list)[number] | null>((a, s) => (!a || s.at > a.at ? s : a), null);
	const state = siteState(last, now);
	const { deploy } = useRuntimeConfig() as unknown as { deploy: { sha: string; builtAt: string } };

	return {
		state,
		since: list.length ? Math.min(...list.map((s) => s.at)) : null,
		windows: [
			{ label: '24 hours', pct: uptimePct(list, now, 24) },
			{ label: '7 days', pct: uptimePct(list, now, 24 * 7) },
			{ label: '30 days', pct: uptimePct(list, now, 24 * 30) },
			{ label: '90 days', pct: uptimePct(list, now, 24 * 90) },
		],
		history: uptimeSummary(list, now, 90),
		outages: outages(list).slice(0, 20),
		lighthouse,
		deploy: { sha: deploy.sha, builtAt: deploy.builtAt },
		generatedAt: new Date(now).toISOString(),
	};
});
