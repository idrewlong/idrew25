import { siteState, type SiteState } from '../../utils/ops';
import { uptimeSamples } from '../../utils/opsStore';

// Just the current state, for the header's status dot. Tiny on purpose: every
// page view asks for it. Cached at the edge for a minute (nuxt.config.ts).
export default defineEventHandler(async (): Promise<{ state: SiteState; lastAt: number | null }> => {
	const last = (await uptimeSamples(1).catch(() => null))?.[0] ?? null;
	return { state: siteState(last, Date.now()), lastAt: last?.at ?? null };
});
