import { describe, it, expect } from 'vitest';
import { orbitPath, satellitePosition } from '../../app/scenes/orbits';

const ISS_L1 = '1 25544U 98067A   26300.82187419  .00005456  00000+0  10681-3 0  9999';
const ISS_L2 = '2 25544  51.6336   3.7485 0007015 317.3678  42.6766 15.49080514592319';

describe('satellitePosition', () => {
	// Epoch 26300.82 = 2026-10-27 ~19:43 UTC; propagate a few hours after it
	const at = new Date('2026-10-27T22:00:00Z');

	it('puts the ISS at its real altitude band', () => {
		const pos = satellitePosition({ line1: ISS_L1, line2: ISS_L2 }, at);
		expect(pos).not.toBeNull();
		expect(pos!.altKm).toBeGreaterThan(380);
		expect(pos!.altKm).toBeLessThan(440);
	});

	it('keeps the ISS within its 51.6° inclination', () => {
		const pos = satellitePosition({ line1: ISS_L1, line2: ISS_L2 }, at)!;
		expect(Math.abs(pos.lat)).toBeLessThanOrEqual(52);
		expect(pos.lon).toBeGreaterThanOrEqual(-180);
		expect(pos.lon).toBeLessThanOrEqual(180);
	});

	it('returns null for an unusable TLE', () => {
		expect(satellitePosition({ line1: '1 garbage', line2: '2 garbage' }, at)).toBeNull();
	});
});

describe('orbitPath', () => {
	const at = new Date('2026-10-27T22:00:00Z');
	const tle = { line1: ISS_L1, line2: ISS_L2 };
	const toRad = (d: number) => (d * Math.PI) / 180;
	// Great-circle angle between two ground points, in degrees
	const angle = (a: { lat: number; lon: number }, b: { lat: number; lon: number }) =>
		(Math.acos(
			Math.min(
				1,
				Math.sin(toRad(a.lat)) * Math.sin(toRad(b.lat)) +
					Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.cos(toRad(a.lon - b.lon))
			)
		) *
			180) /
		Math.PI;

	it('traces one full orbit that closes on itself', () => {
		const path = orbitPath(tle, at, 120);
		expect(path).toHaveLength(121);
		// Start and end are the same point in a closed ring (within a degree)
		expect(angle(path[0], path[path.length - 1])).toBeLessThan(1);
	});

	it('passes through the satellite’s current position', () => {
		const path = orbitPath(tle, at, 120);
		const now = satellitePosition(tle, at)!;
		expect(angle(path[0], now)).toBeLessThan(0.5);
	});

	it('returns an empty path for an unusable TLE', () => {
		expect(orbitPath({ line1: '1 garbage', line2: '2 garbage' }, at, 60)).toEqual([]);
	});
});
