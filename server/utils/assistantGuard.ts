import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Cheap checks that run before the assistant ever calls the model, so abuse
 * is turned away without spending API credit. Pure functions; the route
 * wires them to the request and to shared storage.
 */

export const LIMITS = {
	questionChars: 500,
	historyTurns: 6,
	turnChars: 1500,
	// Total across the history, so every request stays small
	historyChars: 4000,
};

export type ChatTurn = { role: 'user' | 'assistant'; content: string };
export type ChatInput =
	| { ok: true; question: string; history: ChatTurn[] }
	| { ok: false; error: string };

/**
 * HMAC over an assistant reply. The server returns it with each answer and
 * only accepts assistant turns back if they carry a matching signature, so
 * visitors can't fabricate "earlier replies" to steer the model off-topic.
 */
export function signTurn(secret: string, content: string): string {
	return createHmac('sha256', secret).update(content).digest('base64url');
}

function validSig(secret: string, content: string, sig: unknown): boolean {
	if (typeof sig !== 'string') return false;
	const expected = Buffer.from(signTurn(secret, content));
	const given = Buffer.from(sig);
	return given.length === expected.length && timingSafeEqual(given, expected);
}

export function validateChatInput(body: unknown, secret: string): ChatInput {
	if (!body || typeof body !== 'object') return { ok: false, error: 'Invalid request.' };
	const { question, history = [] } = body as { question?: unknown; history?: unknown };

	if (typeof question !== 'string') return { ok: false, error: 'Ask a question.' };
	const q = question.trim();
	if (!q) return { ok: false, error: 'Ask a question.' };
	if (q.length > LIMITS.questionChars) return { ok: false, error: `Keep questions under ${LIMITS.questionChars} characters.` };

	if (!Array.isArray(history) || history.length > LIMITS.historyTurns) {
		return { ok: false, error: 'Conversation is too long. Start a new one.' };
	}
	const turns: ChatTurn[] = [];
	for (const t of history) {
		const turn = t as { role?: unknown; content?: unknown; sig?: unknown };
		if ((turn?.role !== 'user' && turn?.role !== 'assistant') || typeof turn.content !== 'string') {
			return { ok: false, error: 'Invalid conversation.' };
		}
		// User turns come from the visitor unsigned, so they get the question limit
		const max = turn.role === 'user' ? LIMITS.questionChars : LIMITS.turnChars;
		if (turn.content.length > max) return { ok: false, error: 'Invalid conversation.' };
		if (turn.role === 'assistant' && !validSig(secret, turn.content, turn.sig)) {
			return { ok: false, error: 'Invalid conversation.' };
		}
		turns.push({ role: turn.role, content: turn.content });
	}
	if (turns.reduce((n, t) => n + t.content.length, 0) > LIMITS.historyChars) {
		return { ok: false, error: 'Conversation is too long. Start a new one.' };
	}
	return { ok: true, question: q, history: turns };
}

/**
 * The browser sends Origin on every POST fetch. Only accept requests from
 * this site (its own host, or the configured production URL), and reject
 * anything the browser marks as cross-site. Scripts can forge headers, so
 * this stops casual reuse; the rate limits and daily cap stop the rest.
 */
export function isSameOrigin(opts: { origin?: string; host?: string; siteUrl?: string; fetchSite?: string }): boolean {
	if (opts.fetchSite && opts.fetchSite !== 'same-origin') return false;
	if (!opts.origin) return false;
	let originHost: string;
	try {
		originHost = new URL(opts.origin).host;
	} catch {
		return false;
	}
	if (opts.host && originHost === opts.host) return true;
	if (opts.siteUrl) {
		try {
			return originHost === new URL(opts.siteUrl).host;
		} catch {
			return false;
		}
	}
	return false;
}

/** Atomic increment with expiry; returns the new count. */
export interface CounterStore {
	incr(key: string, ttlSec: number): Promise<number>;
}

/**
 * Fixed-window counter. Every attempt is counted atomically (INCR), so a
 * concurrent burst can't all read the same "used" value and slip through;
 * refused attempts count too, which makes hammering self-limiting.
 */
export async function consumeQuota(
	store: CounterStore,
	key: string,
	rule: { limit: number; windowSec: number },
	now = Date.now()
): Promise<boolean> {
	const windowId = Math.floor(now / (rule.windowSec * 1000));
	const count = await store.incr(`${key}:${rule.windowSec}:${windowId}`, rule.windowSec);
	return count <= rule.limit;
}

/** In-process counter for local dev and tests. Not shared across instances. */
export function memoryCounter(): CounterStore {
	const counts = new Map<string, { n: number; expires: number }>();
	return {
		async incr(key, ttlSec) {
			const now = Date.now();
			const hit = counts.get(key);
			const n = hit && hit.expires > now ? hit.n + 1 : 1;
			counts.set(key, { n, expires: hit && hit.expires > now ? hit.expires : now + ttlSec * 1000 });
			return n;
		},
	};
}

/**
 * Rate-limit identity for an IP. IPv6 clients usually control a whole /64,
 * so group by it; otherwise rotating addresses would reset the limit.
 */
export function visitorKey(ip: string): string {
	if (!ip.includes(':')) return ip;
	const [head, tail = ''] = ip.split('::');
	const left = head ? head.split(':') : [];
	const right = tail ? tail.split(':') : [];
	const groups = ip.includes('::') ? [...left, ...Array(8 - left.length - right.length).fill('0'), ...right] : left;
	return `${groups
		.slice(0, 4)
		.map((g) => (parseInt(g, 16) || 0).toString(16))
		.join(':')}::/64`;
}
