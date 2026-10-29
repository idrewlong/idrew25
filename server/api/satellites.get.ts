import type { TleRecord } from '../utils/tle';

// Featured spacecraft shown with a label and an orbit trail on the hero globe.
const FEATURED: { id: number; label: string }[] = [
	{ id: 25544, label: 'ISS' },
	{ id: 20580, label: 'Hubble' },
	{ id: 49260, label: 'Landsat 9' },
	{ id: 54234, label: 'NOAA-21' },
];
const STARLINK_SAMPLE = 36;

const CELESTRAK = 'https://celestrak.org/NORAD/elements/gp.php';

// CelesTrak updates elements every 2 hours and answers 403 to a repeat
// download of unchanged data, so nothing here is fetched more often than that.
const TWO_HOURS = 60 * 60 * 2;

export interface SatellitePayload {
	featured: (TleRecord & { label: string })[];
	swarm: TleRecord[];
}

async function fetchTle(query: string): Promise<TleRecord[]> {
	const text = await $fetch<string>(`${CELESTRAK}?${query}&FORMAT=TLE`, {
		responseType: 'text',
		timeout: 20_000,
	});
	return parseTle(text);
}

// Cached separately so a refused Starlink download doesn't cost the featured
// set, and a failure is cached too (as an empty list) rather than retried on
// every request.
const getFeatured = defineCachedFunction(
	async () => {
		const results = await Promise.all(
			FEATURED.map((f) => fetchTle(`CATNR=${f.id}`).catch(() => [] as TleRecord[]))
		);
		return results.flatMap((records, i) =>
			records.slice(0, 1).map((r) => ({ ...r, label: FEATURED[i].label }))
		);
	},
	{ name: 'satellites-featured', maxAge: TWO_HOURS }
);

const getSwarm = defineCachedFunction(
	async () => {
		const starlink = await fetchTle('GROUP=starlink').catch(() => [] as TleRecord[]);
		// Evenly spaced picks across the catalogue spread the swarm over many planes
		const step = Math.max(1, Math.floor(starlink.length / STARLINK_SAMPLE));
		return starlink.filter((_, i) => i % step === 0).slice(0, STARLINK_SAMPLE);
	},
	{ name: 'satellites-starlink', maxAge: TWO_HOURS }
);

export default defineEventHandler(async (): Promise<SatellitePayload> => {
	const [featured, swarm] = await Promise.all([getFeatured(), getSwarm()]);
	if (!featured.length && !swarm.length) {
		throw createError({ statusCode: 502, statusMessage: 'Satellite data unavailable' });
	}
	return { featured, swarm };
});
