import { timingSafeEqual } from 'node:crypto';
import type { H3Event } from 'h3';

/**
 * The scheduled GitHub Action (.github/workflows/ops-monitor.yml) reports its
 * results with `Authorization: Bearer <NUXT_OPS_INGEST_SECRET>`. Without the
 * secret configured, ingest is switched off rather than left open.
 */
export function requireIngestSecret(event: H3Event): void {
	const secret = useRuntimeConfig().opsIngestSecret as string;
	if (!secret) throw createError({ statusCode: 503, statusMessage: 'Ingest not configured' });
	const given = Buffer.from(getHeader(event, 'authorization') ?? '');
	const expected = Buffer.from(`Bearer ${secret}`);
	if (given.length !== expected.length || !timingSafeEqual(given, expected)) {
		throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
	}
}
