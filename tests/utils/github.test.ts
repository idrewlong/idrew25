import { describe, it, expect } from 'vitest';
import { latestPushes, parseContributions, summarizeContributions, recentRepos } from '../../server/utils/github';

const push = (repo: string, head: string, at: string, ref = 'refs/heads/main') => ({
	type: 'PushEvent',
	repo: { name: repo },
	created_at: at,
	payload: { head, ref },
});

describe('latestPushes', () => {
	it('keeps push events only, newest first', () => {
		const events = [
			push('idrewlong/a', 'aaa1111', '2026-10-15T10:00:00Z'),
			{ type: 'DeleteEvent', repo: { name: 'idrewlong/a' }, created_at: '2026-10-16T00:00:00Z', payload: {} },
			push('idrewlong/b', 'bbb2222', '2026-10-16T09:00:00Z'),
		];
		expect(latestPushes(events, 5)).toEqual([
			{ repo: 'idrewlong/b', sha: 'bbb2222', branch: 'main', at: '2026-10-16T09:00:00Z' },
			{ repo: 'idrewlong/a', sha: 'aaa1111', branch: 'main', at: '2026-10-15T10:00:00Z' },
		]);
	});

	it('drops repeat pushes of the same head commit and respects the limit', () => {
		const events = [
			push('idrewlong/a', 'same111', '2026-10-16T02:00:00Z'),
			push('idrewlong/a', 'same111', '2026-10-16T01:00:00Z'),
			push('idrewlong/a', 'ccc3333', '2026-10-15T00:00:00Z'),
			push('idrewlong/a', 'ddd4444', '2026-10-14T00:00:00Z'),
		];
		const out = latestPushes(events, 2);
		expect(out.map((p) => p.sha)).toEqual(['same111', 'ccc3333']);
	});

	it('ignores malformed events', () => {
		expect(latestPushes([null, {}, { type: 'PushEvent', payload: {} }] as unknown[], 5)).toEqual([]);
	});
});

// Trimmed from github.com/users/<name>/contributions
const cell = (date: string, id: string, level: number) =>
	`<td tabindex="0" data-ix="0" style="width: 10px" data-date="${date}" id="${id}" data-level="${level}" role="gridcell" class="ContributionCalendar-day"></td>`;
const tip = (id: string, text: string) =>
	`<tool-tip id="tooltip-x" for="${id}" popover="manual" class="sr-only position-absolute">${text}</tool-tip>`;

describe('parseContributions', () => {
	it('reads each day with its count and level, oldest first', () => {
		const html = [
			cell('2026-10-27', 'day-b', 4),
			cell('2026-10-26', 'day-a', 0),
			tip('day-a', 'No contributions on October 26th.'),
			tip('day-b', '12 contributions on October 27th.'),
		].join('\n');
		expect(parseContributions(html)).toEqual([
			{ date: '2026-10-26', count: 0, level: 0 },
			{ date: '2026-10-27', count: 12, level: 4 },
		]);
	});

	it('reads singular and comma-separated counts', () => {
		const html = [
			cell('2026-10-01', 'd1', 1),
			cell('2026-10-02', 'd2', 4),
			tip('d1', '1 contribution on October 1st.'),
			tip('d2', '1,204 contributions on October 2nd.'),
		].join('');
		expect(parseContributions(html).map((d) => d.count)).toEqual([1, 1204]);
	});

	it('returns nothing for a page without a calendar', () => {
		expect(parseContributions('<html><body>Rate limited</body></html>')).toEqual([]);
	});
});

describe('summarizeContributions', () => {
	const days = [
		{ date: '2026-09-01', count: 5, level: 2 },
		{ date: '2026-10-01', count: 3, level: 1 },
		{ date: '2026-10-22', count: 2, level: 1 },
		{ date: '2026-10-28', count: 4, level: 2 },
	];

	it('totals the last 7 days, the last 30 days and the whole calendar', () => {
		expect(summarizeContributions(days, '2026-10-28')).toEqual({ week: 6, month: 9, year: 14 });
	});
});

describe('recentRepos', () => {
	it('lists distinct pushed repos, most recent first', () => {
		const events = [
			push('idrewlong/a', 'a1', '2026-10-16T02:00:00Z'),
			push('idrewlong/b', 'b1', '2026-10-15T00:00:00Z'),
			push('idrewlong/a', 'a2', '2026-10-14T00:00:00Z'),
			push('idrewlong/c', 'c1', '2026-10-13T00:00:00Z'),
		];
		expect(recentRepos(events, 2)).toEqual([
			{ name: 'idrewlong/a', at: '2026-10-16T02:00:00Z' },
			{ name: 'idrewlong/b', at: '2026-10-15T00:00:00Z' },
		]);
	});
});
