import { recordUptime } from '../../../utils/opsStore';
import { requireIngestSecret } from '../../../utils/opsIngest';

// One external check of the home page, sent every 15 minutes by the
// ops-monitor GitHub Action. Body: { status, ms }. The time is stamped here.
export default defineEventHandler(async (event) => {
	requireIngestSecret(event);
	const body = await readBody<{ status?: unknown; ms?: unknown }>(event);
	const status = Number(body?.status);
	const ms = Number(body?.ms);
	if (!Number.isInteger(status) || status < 0 || status > 599 || !Number.isFinite(ms) || ms < 0 || ms > 120_000) {
		throw createError({ statusCode: 400, statusMessage: 'Expected { status, ms }' });
	}
	await recordUptime({ at: Date.now(), status, ms: Math.round(ms) });
	return { ok: true };
});
