import { describe, it, expect } from 'vitest';
import { parseTle } from '../../server/utils/tle';

const ISS = [
	'ISS (ZARYA)             ',
	'1 25544U 98067A   26300.82187419  .00005456  00000+0  10681-3 0  9999',
	'2 25544  51.6336   3.7485 0007015 317.3678  42.6766 15.49080514592319',
];
const HST = [
	'HST                     ',
	'1 20580U 90037B   26300.95357625  .00004578  00000+0  13616-3 0  9990',
	'2 20580  28.4737 252.2364 0001925 183.4227 176.6356 15.32101084808944',
];

describe('parseTle', () => {
	it('parses three-line records with trimmed names', () => {
		const out = parseTle([...ISS, ...HST].join('\r\n'));
		expect(out).toEqual([
			{ name: 'ISS (ZARYA)', id: 25544, line1: ISS[1], line2: ISS[2] },
			{ name: 'HST', id: 20580, line1: HST[1], line2: HST[2] },
		]);
	});

	it('skips records whose lines are not a 1/2 pair', () => {
		const broken = ['BROKEN', 'not a tle line', ISS[2]];
		expect(parseTle([...broken, ...HST].join('\n'))).toEqual([
			{ name: 'HST', id: 20580, line1: HST[1], line2: HST[2] },
		]);
	});

	it('returns an empty list for empty or non-TLE input', () => {
		expect(parseTle('')).toEqual([]);
		expect(parseTle('No GP data found')).toEqual([]);
	});
});
