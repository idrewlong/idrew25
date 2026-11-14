// Vercel region codes and the city each one is in
// (https://vercel.com/docs/edge-network/regions)
const REGIONS: Record<string, string> = {
	arn1: 'Stockholm',
	bom1: 'Mumbai',
	cdg1: 'Paris',
	cle1: 'Cleveland',
	cpt1: 'Cape Town',
	dub1: 'Dublin',
	dxb1: 'Dubai',
	fra1: 'Frankfurt',
	gru1: 'São Paulo',
	hkg1: 'Hong Kong',
	hnd1: 'Tokyo',
	iad1: 'Washington, D.C.',
	icn1: 'Seoul',
	kix1: 'Osaka',
	lhr1: 'London',
	pdx1: 'Portland',
	sfo1: 'San Francisco',
	sin1: 'Singapore',
	syd1: 'Sydney',
};

export const regionName = (code: string) => REGIONS[code] ?? code;

/**
 * Reads x-vercel-id, e.g. "cle1::iad1::abc-123" (edge, then the function's
 * region) or "cle1::abc-123" when the edge answered without running a function.
 */
export function parseVercelId(header: string | null): { edge: string | null; region: string | null } {
	const codes = (header ?? '').split('::').filter((p) => /^[a-z]{3}\d$/.test(p));
	return { edge: codes[0] ?? null, region: codes[1] ?? null };
}

/** "2 min ago", "3 h ago", "4 days ago" */
export function timeAgo(iso: string, now: number): string {
	const s = Math.max(0, Math.round((now - Date.parse(iso)) / 1000));
	if (s < 60) return `${s} s ago`;
	if (s < 3600) return `${Math.round(s / 60)} min ago`;
	if (s < 86400) return `${Math.round(s / 3600)} h ago`;
	const d = Math.round(s / 86400);
	return `${d} day${d === 1 ? '' : 's'} ago`;
}
