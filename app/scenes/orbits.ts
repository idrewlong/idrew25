import { degreesLat, degreesLong, eciToGeodetic, gstime, propagate, twoline2satrec } from 'satellite.js';

export interface GroundPosition {
	lat: number;
	lon: number;
	altKm: number;
}

/**
 * Where a satellite is at `date`: geodetic latitude/longitude (degrees) and
 * altitude (km), from its TLE via SGP4. Null when the TLE can't be propagated.
 */
export function satellitePosition(tle: { line1: string; line2: string }, date: Date): GroundPosition | null {
	let satrec;
	try {
		satrec = twoline2satrec(tle.line1, tle.line2);
	} catch {
		return null;
	}
	const pv = propagate(satrec, date);
	const eci = pv?.position;
	if (!eci || typeof eci !== 'object' || !Number.isFinite(eci.x)) return null;
	const geo = eciToGeodetic(eci, gstime(date));
	return { lat: degreesLat(geo.latitude), lon: degreesLong(geo.longitude), altKm: geo.height };
}

/**
 * One full orbit as ground points, starting at the satellite's position at
 * `date`. Earth's rotation is frozen at `date` (a single GMST for every
 * point), so the path is the orbit itself and closes into a ring, rather
 * than a ground track that drifts west each lap. Empty if the TLE fails.
 */
export function orbitPath(tle: { line1: string; line2: string }, date: Date, steps: number): GroundPosition[] {
	let satrec;
	try {
		satrec = twoline2satrec(tle.line1, tle.line2);
	} catch {
		return [];
	}
	if (!(satrec.no > 0)) return [];
	const periodMs = ((2 * Math.PI) / satrec.no) * 60_000; // `no` is rad/min
	const gmst = gstime(date);
	const path: GroundPosition[] = [];
	for (let i = 0; i <= steps; i++) {
		const eci = propagate(satrec, new Date(date.getTime() + (i / steps) * periodMs))?.position;
		if (!eci || typeof eci !== 'object' || !Number.isFinite(eci.x)) return [];
		const geo = eciToGeodetic(eci, gmst);
		path.push({ lat: degreesLat(geo.latitude), lon: degreesLong(geo.longitude), altKm: geo.height });
	}
	return path;
}
