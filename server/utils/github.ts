export interface PushSummary {
	repo: string;
	sha: string;
	branch: string;
	at: string;
}

/**
 * Reduces GitHub's public events feed to the latest distinct pushes, newest
 * first. Push events no longer carry commit messages, only the head SHA, so
 * the caller looks those up separately. Anything malformed is skipped.
 */
export function latestPushes(events: unknown[], limit: number): PushSummary[] {
	const seen = new Set<string>();
	const pushes: PushSummary[] = [];
	for (const e of events) {
		const ev = e as { type?: string; repo?: { name?: string }; created_at?: string; payload?: { head?: string; ref?: string } } | null;
		if (ev?.type !== 'PushEvent') continue;
		const repo = ev.repo?.name;
		const sha = ev.payload?.head;
		const at = ev.created_at;
		if (!repo || !sha || !at) continue;
		const key = `${repo}@${sha}`;
		if (seen.has(key)) continue;
		seen.add(key);
		pushes.push({ repo, sha, branch: (ev.payload?.ref ?? '').replace('refs/heads/', ''), at });
	}
	return pushes.sort((a, b) => b.at.localeCompare(a.at)).slice(0, limit);
}

export interface ContributionDay {
	date: string;
	count: number;
	level: number;
}

/**
 * Reads the contribution calendar GitHub renders for a profile
 * (github.com/users/<name>/contributions), which needs no token. Each day
 * is a <td data-date data-level>; its count lives in a <tool-tip for=id>.
 * Returns [] if the markup changes, so the panel just hides.
 */
export function parseContributions(html: string): ContributionDay[] {
	const counts = new Map<string, number>();
	for (const m of html.matchAll(/<tool-tip[^>]*\sfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
		const n = m[2]!.match(/^([\d,]+) contributions? on/);
		counts.set(m[1]!, n ? Number(n[1]!.replace(/,/g, '')) : 0);
	}
	const days: ContributionDay[] = [];
	for (const m of html.matchAll(/<td\b[^>]*>/g)) {
		const tag = m[0];
		const date = tag.match(/data-date="(\d{4}-\d{2}-\d{2})"/)?.[1];
		const level = tag.match(/data-level="(\d)"/)?.[1];
		const id = tag.match(/\sid="([^"]+)"/)?.[1];
		if (!date || level === undefined) continue;
		days.push({ date, count: (id && counts.get(id)) || 0, level: Number(level) });
	}
	return days.sort((a, b) => a.date.localeCompare(b.date));
}

/** Contributions in the 7 and 30 days ending `today` (YYYY-MM-DD), and in total. */
export function summarizeContributions(days: ContributionDay[], today: string) {
	const since = (n: number) => {
		const d = new Date(`${today}T00:00:00Z`);
		d.setUTCDate(d.getUTCDate() - (n - 1));
		return d.toISOString().slice(0, 10);
	};
	const sum = (from: string) => days.reduce((n, d) => (d.date >= from && d.date <= today ? n + d.count : n), 0);
	return { week: sum(since(7)), month: sum(since(30)), year: sum('0000-00-00') };
}

/** Distinct repos with public pushes, most recent first. */
export function recentRepos(events: unknown[], limit: number): { name: string; at: string }[] {
	const out: { name: string; at: string }[] = [];
	for (const p of latestPushes(events, Infinity)) {
		if (out.some((r) => r.name === p.repo)) continue;
		out.push({ name: p.repo, at: p.at });
		if (out.length === limit) break;
	}
	return out;
}
