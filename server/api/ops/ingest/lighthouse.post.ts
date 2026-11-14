import { parsePsi } from '../../../utils/ops';
import { LIGHTHOUSE_KEY, opsKv } from '../../../utils/opsStore';
import { requireIngestSecret } from '../../../utils/opsIngest';

// The daily Lighthouse run from the ops-monitor GitHub Action. Body is the
// Lighthouse report (or a trimmed copy) as { lighthouseResult }, the same
// shape PageSpeed Insights returns.
export default defineEventHandler(async (event) => {
	requireIngestSecret(event);
	const kv = opsKv();
	if (!kv) throw createError({ statusCode: 503, statusMessage: 'No storage configured' });
	const result = parsePsi((await readBody(event)) ?? {}, 'https://www.idrewlong.com/', new Date());
	if (!result) throw createError({ statusCode: 400, statusMessage: 'Expected { lighthouseResult }' });
	await kv.set(LIGHTHOUSE_KEY, result);
	return { ok: true, result };
});
