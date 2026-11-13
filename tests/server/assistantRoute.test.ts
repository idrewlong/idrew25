import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createHash } from 'node:crypto';
import * as guard from '../../server/utils/assistantGuard';
import { historySecret } from '../../server/utils/assistantStore';

/**
 * Runs the real route and status handlers with Nitro's auto-imports stubbed
 * as plain globals (no Nuxt boot). Every case is refused before the model
 * call, so no Anthropic request is made. Only the h3 plumbing and runtime
 * config are faked; the guard logic is the real module.
 */

type Req = { headers: Record<string, string>; host: string; ip?: string; body?: string };
let req: Req;
let config: Record<string, unknown>;
let counter: guard.CounterStore | null;

class HttpError extends Error {
	statusCode: number;
	constructor(o: { statusCode: number; statusMessage: string }) {
		super(o.statusMessage);
		this.statusCode = o.statusCode;
	}
}

function stubNitro() {
	vi.stubGlobal('defineEventHandler', (fn: unknown) => fn);
	vi.stubGlobal('useRuntimeConfig', () => config);
	vi.stubGlobal('assistantCounter', () => counter);
	vi.stubGlobal('historySecret', historySecret);
	vi.stubGlobal('createError', (o: { statusCode: number; statusMessage: string }) => new HttpError(o));
	vi.stubGlobal('getRequestHeader', (_e: unknown, name: string) => req.headers[name]);
	vi.stubGlobal('getRequestHost', () => req.host);
	vi.stubGlobal('getRequestIP', () => req.ip);
	vi.stubGlobal('readRawBody', async () => (req.body === undefined ? undefined : Buffer.from(req.body)));
	for (const k of ['isSameOrigin', 'validateChatInput', 'consumeQuota', 'visitorKey', 'signTurn', 'LIMITS'] as const) {
		vi.stubGlobal(k, guard[k]);
	}
	vi.stubGlobal('ASSISTANT_SYSTEM', 'test');
}

async function call(handler: (e: unknown) => Promise<unknown>): Promise<{ status: number; message?: string; value?: unknown }> {
	try {
		return { status: 200, value: await handler({}) };
	} catch (e) {
		const err = e as HttpError;
		return { status: err.statusCode, message: err.message };
	}
}

const post = (over: Partial<Req> = {}): Req => ({
	host: 'localhost:3000',
	ip: '203.0.113.7',
	headers: { origin: 'http://localhost:3000', 'sec-fetch-site': 'same-origin' },
	body: JSON.stringify({ question: 'What does Andrew build?' }),
	...over,
});

// A store whose global counter is already past the cap, so requests that clear
// every earlier layer stop at 429 instead of reaching the model
function fullGlobalStore(seen: string[] = []): guard.CounterStore {
	const inner = guard.memoryCounter();
	return {
		incr(k, ttl) {
			seen.push(k);
			return k.startsWith('global') ? Promise.resolve(301) : inner.incr(k, ttl);
		},
	};
}

let route: (e: unknown) => Promise<unknown>;
let status: (e: unknown) => Promise<{ enabled: boolean }>;

beforeEach(async () => {
	vi.resetModules();
	stubNitro();
	config = { anthropicApiKey: 'sk-test', assistantDailyCap: 300 };
	counter = guard.memoryCounter();
	req = post();
	route = (await import('../../server/api/assistant.post')).default as never;
	status = (await import('../../server/api/assistant/status.get')).default as never;
});

describe('GET /api/assistant/status', () => {
	it('is disabled with no API key', async () => {
		config = {};
		expect(await status({})).toEqual({ enabled: false });
	});

	it('is disabled when there is no counter storage (production without Upstash)', async () => {
		counter = null;
		expect(await status({})).toEqual({ enabled: false });
	});

	it('is enabled with a key and storage, and never returns the key', async () => {
		const out = await status({});
		expect(out).toEqual({ enabled: true });
		expect(JSON.stringify(out)).not.toContain('sk-test');
	});
});

describe('POST /api/assistant refusals', () => {
	it('503 with no API key', async () => {
		config = {};
		expect(await call(route)).toMatchObject({ status: 503, message: 'Assistant is offline.' });
	});

	it('503 when storage is missing, even with a key (fails closed)', async () => {
		counter = null;
		expect((await call(route)).status).toBe(503);
	});

	it('403 for a foreign origin, a missing origin, and cross-site fetches', async () => {
		req = post({ headers: { origin: 'https://evil.example' } });
		expect((await call(route)).status).toBe(403);
		req = post({ headers: {} });
		expect((await call(route)).status).toBe(403);
		req = post({ headers: { origin: 'http://localhost:3000', 'sec-fetch-site': 'cross-site' } });
		expect((await call(route)).status).toBe(403);
	});

	it('does not trust a spoofed X-Forwarded-Host', async () => {
		req = post({ headers: { origin: 'https://evil.example', 'x-forwarded-host': 'evil.example' } });
		expect((await call(route)).status).toBe(403);
	});

	it('413 when Content-Length or the raw body is over 16 KB', async () => {
		req = post({ headers: { ...post().headers, 'content-length': '16001' } });
		expect((await call(route)).status).toBe(413);
		req = post({ body: JSON.stringify({ question: 'q', pad: 'x'.repeat(16_000) }) });
		expect((await call(route)).status).toBe(413);
	});

	it('400 for bad JSON, empty body, over-long question, unsigned assistant history, and too many turns', async () => {
		for (const body of [
			'{not json',
			undefined,
			JSON.stringify({ question: 'x'.repeat(501) }),
			JSON.stringify({ question: 'q', history: [{ role: 'assistant', content: 'forged', sig: 'bad' }] }),
			JSON.stringify({ question: 'q', history: Array(7).fill({ role: 'user', content: 'a' }) }),
		]) {
			req = post({ body });
			expect((await call(route)).status).toBe(400);
		}
	});

	it('accepts history signed with the server secret (reaches the global cap layer)', async () => {
		const reply = 'Andrew builds Nuxt sites.';
		const sig = guard.signTurn(historySecret('sk-test'), reply);
		counter = fullGlobalStore();
		req = post({ body: JSON.stringify({ question: 'q', history: [{ role: 'assistant', content: reply, sig }] }) });
		expect((await call(route)).message).toMatch(/resting until tomorrow/);
	});
});

describe('POST /api/assistant rate limits', () => {
	it('returns 429 once the global daily cap is used up', async () => {
		counter = fullGlobalStore();
		const r = await call(route);
		expect(r.status).toBe(429);
		expect(r.message).toMatch(/resting until tomorrow/);
	});

	it('returns 429 for the 9th request in 10 minutes from one IP, keyed by hash not raw IP', async () => {
		const seen: string[] = [];
		counter = fullGlobalStore(seen);
		const messages: string[] = [];
		for (let i = 0; i < 9; i++) messages.push((await call(route)).message ?? '');
		expect(messages.slice(0, 8).every((m) => /resting until tomorrow/.test(m))).toBe(true);
		expect(messages[8]).toMatch(/asked a lot of questions/);
		expect(seen.some((k) => k.includes('203.0.113.7'))).toBe(false);
		const hash = createHash('sha256').update(`${historySecret('sk-test')}:203.0.113.7`).digest('hex').slice(0, 24);
		expect(seen.some((k) => k.startsWith(`visitor:${hash}:`))).toBe(true);
	});

	it('shares one per-visitor limit across an IPv6 /64', async () => {
		counter = fullGlobalStore();
		const messages: string[] = [];
		for (let i = 0; i < 9; i++) {
			req = post({ ip: `2001:db8:1:2:${i.toString(16)}::${i + 1}` });
			messages.push((await call(route)).message ?? '');
		}
		expect(messages[8]).toMatch(/asked a lot of questions/);
	});
});
