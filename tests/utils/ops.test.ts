import { describe, it, expect } from 'vitest';
import {
	ciState,
	costUsd,
	decodeSample,
	doraMetrics,
	encodeSample,
	modelLabel,
	parsePsi,
	uptimeSummary,
	type DeployRecord,
} from '../../server/utils/ops';
import { parseVercelId, regionName, timeAgo } from '../../app/utils/vercelRequest';

describe('costUsd', () => {
	it('prices Haiku 5.5 with cache reads at 0.1x and writes at 1.25x input', () => {
		// 1M uncached in ($0.10) + 1M cache read ($0.01) + 1M cache write ($0.125) + 1M out ($0.50)
		const c = costUsd('claude-haiku-5-5', {
			input_tokens: 1e6,
			cache_read_input_tokens: 1e6,
			cache_creation_input_tokens: 1e6,
			output_tokens: 1e6,
		});
		expect(c).toBeCloseTo(0.735, 6);
	});
	it('treats missing counts as zero', () => {
		expect(costUsd('claude-opus-5-5', { output_tokens: 1000 })).toBeCloseTo(0.02, 6);
	});
	it('returns null for an unknown model', () => {
		expect(costUsd('claude-unknown-9', { input_tokens: 10 })).toBeNull();
	});
});

describe('modelLabel', () => {
	it('formats versioned model ids', () => {
		expect(modelLabel('claude-haiku-5-5')).toBe('Claude Haiku 5.5');
		expect(modelLabel('claude-opus-5')).toBe('Claude Opus 5');
		expect(modelLabel('something-else')).toBe('something-else');
	});
});

describe('parsePsi', () => {
	const now = new Date('2026-11-13T10:00:00Z');
	it('reads scores and vitals from a PageSpeed response', () => {
		const r = parsePsi(
			{
				lighthouseResult: {
					finalUrl: 'https://www.idrewlong.com/',
					fetchTime: '2026-11-13T09:59:00.000Z',
					categories: {
						performance: { score: 0.853 },
						accessibility: { score: 1 },
						'best-practices': { score: 0.96 },
						seo: { score: 1 },
					},
					audits: {
						'largest-contentful-paint': { numericValue: 3756 },
						'total-blocking-time': { numericValue: 136 },
						'cumulative-layout-shift': { numericValue: 0.003 },
					},
				},
			},
			'https://fallback/',
			now
		);
		expect(r).toEqual({
			url: 'https://www.idrewlong.com/',
			strategy: 'mobile',
			measuredAt: '2026-11-13T09:59:00.000Z',
			scores: { performance: 85, accessibility: 100, bestPractices: 96, seo: 100 },
			lcpMs: 3756,
			tbtMs: 136,
			cls: 0.003,
		});
	});
	it('returns null without a Lighthouse result', () => {
		expect(parsePsi({}, 'https://x/', now)).toBeNull();
	});
});

describe('ciState', () => {
	it('combines check runs', () => {
		expect(ciState([])).toBeNull();
		expect(ciState([{ status: 'completed', conclusion: 'success' }, { status: 'completed', conclusion: 'skipped' }])).toBe('success');
		expect(ciState([{ status: 'completed', conclusion: 'success' }, { status: 'in_progress', conclusion: null }])).toBe('pending');
		expect(ciState([{ status: 'completed', conclusion: 'failure' }])).toBe('failure');
	});
});

describe('parseVercelId', () => {
	it('reads the edge and function regions', () => {
		expect(parseVercelId('cle1::iad1::abcde-1763-xyz')).toEqual({ edge: 'cle1', region: 'iad1' });
		expect(parseVercelId('cle1::abcde-1763-xyz')).toEqual({ edge: 'cle1', region: null });
		expect(parseVercelId(null)).toEqual({ edge: null, region: null });
	});
	it('names known regions and passes unknown codes through', () => {
		expect(regionName('iad1')).toBe('Washington, D.C.');
		expect(regionName('zzz9')).toBe('zzz9');
	});
});

describe('timeAgo', () => {
	const now = Date.parse('2026-11-13T12:00:00Z');
	it('picks a readable unit', () => {
		expect(timeAgo('2026-11-13T11:59:30Z', now)).toBe('30 s ago');
		expect(timeAgo('2026-11-13T11:48:00Z', now)).toBe('12 min ago');
		expect(timeAgo('2026-11-13T09:00:00Z', now)).toBe('3 h ago');
		expect(timeAgo('2026-11-12T12:00:00Z', now)).toBe('1 day ago');
	});
});

describe('uptime samples', () => {
	it('round-trips the stored format and rejects junk', () => {
		const s = { at: 1763000000000, status: 200, ms: 341 };
		expect(decodeSample(encodeSample(s))).toEqual(s);
		expect(decodeSample('nope')).toBeNull();
	});

	it('rolls samples into UTC days', () => {
		const now = Date.parse('2026-11-13T12:00:00Z');
		const at = (iso: string) => Date.parse(iso);
		const u = uptimeSummary(
			[
				{ at: at('2026-11-13T11:45:00Z'), status: 200, ms: 300 },
				{ at: at('2026-11-13T11:30:00Z'), status: 200, ms: 500 },
				{ at: at('2026-11-12T09:00:00Z'), status: 503, ms: 120 },
				{ at: at('2026-11-12T09:15:00Z'), status: 200, ms: 400 },
				{ at: at('2026-09-01T00:00:00Z'), status: 200, ms: 999 }, // outside 30 days
			],
			now
		);
		expect(u.days).toHaveLength(30);
		expect(u.days.at(-1)).toEqual({ date: '2026-11-13', checks: 2, up: 2, medianMs: 400 });
		expect(u.days.at(-2)).toEqual({ date: '2026-11-12', checks: 2, up: 1, medianMs: 400 });
		expect(u.days[0]!.checks).toBe(0);
		expect(u.checks).toBe(4);
		expect(u.uptimePct).toBe(75);
		expect(u.medianMs).toBe(400);
		expect(u.last?.ms).toBe(300);
	});
});

describe('doraMetrics', () => {
	const now = Date.parse('2026-11-13T12:00:00Z');
	const rec = (sha: string, commitAt: string, createdAt: string, result: DeployRecord['result'], finishedAt: string): DeployRecord => ({
		sha,
		commitAt,
		createdAt,
		result,
		finishedAt,
	});

	it('computes frequency, lead time, failure rate and restore time', () => {
		const m = doraMetrics(
			[
				rec('a', '2026-11-01T10:00:00Z', '2026-11-01T10:01:00Z', 'success', '2026-11-01T10:03:00Z'), // 3 min
				rec('b', '2026-11-05T10:00:00Z', '2026-11-05T10:00:00Z', 'failure', '2026-11-05T10:02:00Z'),
				rec('c', '2026-11-05T10:30:00Z', '2026-11-05T10:31:00Z', 'success', '2026-11-05T10:42:00Z'), // 12 min; restore 40 min
				rec('a', '2026-11-01T10:00:00Z', '2026-11-10T09:00:00Z', 'success', '2026-11-10T09:02:00Z'), // redeploy, no lead time
				rec('d', '2026-11-12T10:00:00Z', '2026-11-12T10:00:00Z', null, ''), // still running
				rec('old', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z', 'success', '2026-01-01T00:05:00Z'), // outside window
			],
			now
		);
		expect(m.deploys).toBe(3);
		expect(m.perWeek).toBe(0.2);
		expect(m.leadTimeMinutes).toBe(8); // median of 3 and 12, rounded
		expect(m.failed).toBe(1);
		expect(m.changeFailurePct).toBe(25);
		expect(m.restoreMinutes).toBe(40);
	});

	it('handles an empty window', () => {
		expect(doraMetrics([], now)).toMatchObject({ deploys: 0, perWeek: 0, leadTimeMinutes: null, changeFailurePct: null, restoreMinutes: null });
	});
});
