/**
 * Pure helpers behind the teardown ops panel (/api/ops). Kept free of Nitro
 * imports so they can be unit-tested directly.
 */

export const DEFAULT_ASSISTANT_MODEL = 'claude-haiku-5-5';

// Anthropic first-party list prices, USD per million tokens. Haiku 5.5 is the
// rate for prompts up to 100K tokens, which every assistant request is.
const PRICES: Record<string, { input: number; output: number }> = {
	'claude-haiku-5-5': { input: 0.1, output: 0.5 },
	'claude-sonnet-5-5': { input: 2, output: 10 },
	'claude-opus-5-5': { input: 4, output: 20 },
};

export interface TokenUsage {
	input_tokens?: number | null;
	output_tokens?: number | null;
	cache_read_input_tokens?: number | null;
	cache_creation_input_tokens?: number | null;
}

/**
 * Cost of one response from its token counts and list prices. `input_tokens`
 * is the uncached part; cache reads bill at 0.1x input and 5-minute cache
 * writes at 1.25x. Returns null for a model without a known price.
 */
export function costUsd(model: string, usage: TokenUsage): number | null {
	const p = PRICES[model];
	if (!p) return null;
	const input = usage.input_tokens ?? 0;
	const read = usage.cache_read_input_tokens ?? 0;
	const write = usage.cache_creation_input_tokens ?? 0;
	const output = usage.output_tokens ?? 0;
	return (input * p.input + read * p.input * 0.1 + write * p.input * 1.25 + output * p.output) / 1e6;
}

/** "claude-haiku-5-5" → "Claude Haiku 5.5" */
export function modelLabel(model: string): string {
	const m = model.match(/^claude-([a-z]+)-(\d+)(?:-(\d+))?$/);
	if (!m) return model;
	const name = m[1]!.charAt(0).toUpperCase() + m[1]!.slice(1);
	return `Claude ${name} ${m[3] ? `${m[2]}.${m[3]}` : m[2]}`;
}

export interface LighthouseResult {
	url: string;
	strategy: 'mobile';
	measuredAt: string;
	scores: { performance: number; accessibility: number; bestPractices: number; seo: number };
	lcpMs: number | null;
	tbtMs: number | null;
	cls: number | null;
}

type PsiCategory = { score?: number | null };
type PsiAudit = { numericValue?: number };
interface PsiResponse {
	lighthouseResult?: {
		finalUrl?: string;
		fetchTime?: string;
		categories?: Record<string, PsiCategory | undefined>;
		audits?: Record<string, PsiAudit | undefined>;
	};
}

/** Reduce a PageSpeed Insights v5 response to the numbers the panel shows. */
export function parsePsi(json: PsiResponse, fallbackUrl: string, now: Date): LighthouseResult | null {
	const lr = json.lighthouseResult;
	const cats = lr?.categories;
	if (!lr || !cats) return null;
	const pct = (key: string) => Math.round((cats[key]?.score ?? 0) * 100);
	const num = (key: string) => {
		const v = lr.audits?.[key]?.numericValue;
		return typeof v === 'number' ? v : null;
	};
	return {
		url: lr.finalUrl || fallbackUrl,
		strategy: 'mobile',
		measuredAt: lr.fetchTime || now.toISOString(),
		scores: {
			performance: pct('performance'),
			accessibility: pct('accessibility'),
			bestPractices: pct('best-practices'),
			seo: pct('seo'),
		},
		lcpMs: num('largest-contentful-paint'),
		tbtMs: num('total-blocking-time'),
		cls: num('cumulative-layout-shift'),
	};
}

export type CiState = 'success' | 'failure' | 'pending';

interface CheckRun {
	status?: string;
	conclusion?: string | null;
}

/** Combine a commit's check runs into one state; null when there are none. */
export function ciState(runs: CheckRun[]): CiState | null {
	if (!runs.length) return null;
	if (runs.some((r) => r.status !== 'completed')) return 'pending';
	const ok = new Set(['success', 'neutral', 'skipped']);
	return runs.every((r) => ok.has(r.conclusion ?? '')) ? 'success' : 'failure';
}

// ---------------------------------------------------------------------------
// Uptime: one sample per external check, stored as "at|status|ms" strings.

export interface UptimeSample {
	at: number; // epoch ms
	status: number; // HTTP status, 0 when the request failed outright
	ms: number; // total response time
}

export const isUp = (s: UptimeSample) => s.status >= 200 && s.status < 400;

export const encodeSample = (s: UptimeSample) => `${s.at}|${s.status}|${s.ms}`;

export function decodeSample(raw: unknown): UptimeSample | null {
	const [at, status, ms] = String(raw).split('|').map(Number);
	if (!Number.isFinite(at) || !Number.isFinite(status) || !Number.isFinite(ms)) return null;
	return { at: at!, status: status!, ms: ms! };
}

function median(values: number[]): number | null {
	if (!values.length) return null;
	const v = [...values].sort((a, b) => a - b);
	const mid = v.length >> 1;
	return v.length % 2 ? v[mid]! : Math.round((v[mid - 1]! + v[mid]!) / 2);
}

export interface UptimeDay {
	date: string; // YYYY-MM-DD (UTC)
	checks: number;
	up: number;
	medianMs: number | null;
}

export interface UptimeSummary {
	days: UptimeDay[]; // oldest first, one entry per day even with no checks
	checks: number;
	uptimePct: number | null;
	medianMs: number | null;
	last: UptimeSample | null;
}

/** Roll samples up into the last `days` UTC days. */
export function uptimeSummary(samples: UptimeSample[], now: number, days = 30): UptimeSummary {
	const dayMs = 86_400_000;
	const today = Math.floor(now / dayMs);
	const buckets = new Map<number, UptimeSample[]>();
	for (const s of samples) {
		const d = Math.floor(s.at / dayMs);
		if (d > today - days && d <= today) buckets.set(d, [...(buckets.get(d) ?? []), s]);
	}
	const out: UptimeDay[] = [];
	for (let d = today - days + 1; d <= today; d++) {
		const list = buckets.get(d) ?? [];
		out.push({
			date: new Date(d * dayMs).toISOString().slice(0, 10),
			checks: list.length,
			up: list.filter(isUp).length,
			medianMs: median(list.filter(isUp).map((s) => s.ms)),
		});
	}
	const inWindow = [...buckets.values()].flat();
	const up = inWindow.filter(isUp);
	return {
		days: out,
		checks: inWindow.length,
		uptimePct: inWindow.length ? Math.round((up.length / inWindow.length) * 10000) / 100 : null,
		medianMs: median(up.map((s) => s.ms)),
		last: inWindow.reduce<UptimeSample | null>((a, s) => (!a || s.at > a.at ? s : a), null),
	};
}

// ---------------------------------------------------------------------------
// DORA metrics from production deployments.

export interface DeployRecord {
	sha: string;
	commitAt: string | null; // when the commit landed (committer date)
	createdAt: string; // when the deployment started
	result: 'success' | 'failure' | null; // null = still running or unknown
	finishedAt: string | null;
}

export interface DoraMetrics {
	windowDays: number;
	deploys: number; // successful production deploys
	perWeek: number;
	leadTimeMinutes: number | null; // median, commit landed → live
	failed: number;
	changeFailurePct: number | null; // failed / (failed + successful)
	restoreMinutes: number | null; // median, failed deploy → next good deploy
}

const minutesBetween = (a: string, b: string) => Math.max(0, Math.round((Date.parse(b) - Date.parse(a)) / 60_000));

export function doraMetrics(records: DeployRecord[], now: number, windowDays = 90): DoraMetrics {
	const since = now - windowDays * 86_400_000;
	const list = records
		.filter((r) => r.result && Date.parse(r.createdAt) >= since)
		.sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));
	const ok = list.filter((r) => r.result === 'success');
	const failed = list.filter((r) => r.result === 'failure');

	// Lead time counts each commit once, at its first successful deploy, so a
	// redeploy of an old commit doesn't look like a slow pipeline.
	const seen = new Set<string>();
	const leads: number[] = [];
	for (const r of ok) {
		if (seen.has(r.sha)) continue;
		seen.add(r.sha);
		if (r.commitAt && r.finishedAt) leads.push(minutesBetween(r.commitAt, r.finishedAt));
	}

	const restores: number[] = [];
	for (const f of failed) {
		const next = ok.find((r) => Date.parse(r.createdAt) > Date.parse(f.createdAt));
		if (next?.finishedAt) restores.push(minutesBetween(f.finishedAt ?? f.createdAt, next.finishedAt));
	}

	const attempts = ok.length + failed.length;
	return {
		windowDays,
		deploys: ok.length,
		perWeek: Math.round((ok.length / (windowDays / 7)) * 10) / 10,
		leadTimeMinutes: median(leads),
		failed: failed.length,
		changeFailurePct: attempts ? Math.round((failed.length / attempts) * 1000) / 10 : null,
		restoreMinutes: median(restores),
	};
}

export const githubHeaders = (token?: string): Record<string, string> => ({
	Accept: 'application/vnd.github+json',
	'User-Agent': 'idrewlong.com',
	...(token ? { Authorization: `Bearer ${token}` } : {}),
});

/** Share of checks that were up in the last `hours`; null with no checks. */
export function uptimePct(samples: UptimeSample[], now: number, hours: number): number | null {
	const since = now - hours * 3_600_000;
	const recent = samples.filter((s) => s.at > since && s.at <= now);
	if (!recent.length) return null;
	return Math.round((recent.filter(isUp).length / recent.length) * 10000) / 100;
}

export interface Outage {
	start: number; // first failed check
	end: number | null; // first good check after it; null while ongoing
	checks: number; // failed checks in a row
	status: number; // status of the first failed check
}

/** Runs of consecutive failed checks, newest first. */
export function outages(samples: UptimeSample[]): Outage[] {
	const sorted = [...samples].sort((a, b) => a.at - b.at);
	const out: Outage[] = [];
	let current: Outage | null = null;
	for (const s of sorted) {
		if (!isUp(s)) {
			if (current) current.checks++;
			else current = { start: s.at, end: null, checks: 1, status: s.status };
		} else if (current) {
			current.end = s.at;
			out.push(current);
			current = null;
		}
	}
	if (current) out.push(current);
	return out.reverse();
}

export type SiteState = 'up' | 'down' | 'unknown';

// A check is due every 15 minutes; GitHub often starts scheduled runs late,
// so the state only turns unknown after three missed checks
const STALE_MS = 45 * 60_000;

/** Up or down from the latest check; unknown when it's missing or stale. */
export function siteState(last: UptimeSample | null, now: number): SiteState {
	if (!last || now - last.at > STALE_MS) return 'unknown';
	return isUp(last) ? 'up' : 'down';
}
