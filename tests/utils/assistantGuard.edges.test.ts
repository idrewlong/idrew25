import { describe, it, expect } from 'vitest';
import { validateChatInput, isSameOrigin, consumeQuota, signTurn, visitorKey, memoryCounter, LIMITS } from '../../server/utils/assistantGuard';
import { historySecret } from '../../server/utils/assistantStore';

const SECRET = 'edge-secret';
const signed = (content: string) => ({ role: 'assistant', content, sig: signTurn(SECRET, content) });

describe('validateChatInput boundaries', () => {
	it('accepts a question of exactly 500 characters and trims before measuring', () => {
		expect(validateChatInput({ question: 'x'.repeat(500) }, SECRET).ok).toBe(true);
		expect(validateChatInput({ question: `  ${'x'.repeat(500)}  ` }, SECRET).ok).toBe(true);
		expect(validateChatInput({ question: 'x'.repeat(501) }, SECRET).ok).toBe(false);
	});

	it('accepts exactly 6 history turns and rejects 7', () => {
		const turn = { role: 'user', content: 'a' };
		expect(validateChatInput({ question: 'q', history: Array(6).fill(turn) }, SECRET).ok).toBe(true);
		expect(validateChatInput({ question: 'q', history: Array(7).fill(turn) }, SECRET).ok).toBe(false);
	});

	it('allows signed assistant turns up to 1500 chars and rejects 1501 even when signed', () => {
		expect(validateChatInput({ question: 'q', history: [signed('y'.repeat(1500))] }, SECRET).ok).toBe(true);
		expect(validateChatInput({ question: 'q', history: [signed('y'.repeat(1501))] }, SECRET).ok).toBe(false);
	});

	it('defaults a missing history to empty', () => {
		expect(validateChatInput({ question: 'hello' }, SECRET)).toEqual({ ok: true, question: 'hello', history: [] });
	});

	it('rejects a non-array history, null turns, non-string content, and missing question', () => {
		expect(validateChatInput({ question: 'q', history: 'nope' }, SECRET).ok).toBe(false);
		expect(validateChatInput({ question: 'q', history: { length: 0 } }, SECRET).ok).toBe(false);
		expect(validateChatInput({ question: 'q', history: [null] }, SECRET).ok).toBe(false);
		expect(validateChatInput({ question: 'q', history: [{ role: 'user', content: 5 }] }, SECRET).ok).toBe(false);
		expect(validateChatInput({}, SECRET).ok).toBe(false);
		expect(validateChatInput(undefined, SECRET).ok).toBe(false);
	});

	it('rejects assistant turns with a non-string or length-mismatched signature without throwing', () => {
		const base = { role: 'assistant', content: 'Hello!' };
		expect(validateChatInput({ question: 'q', history: [{ ...base, sig: 123 }] }, SECRET).ok).toBe(false);
		expect(validateChatInput({ question: 'q', history: [{ ...base, sig: '' }] }, SECRET).ok).toBe(false);
		expect(validateChatInput({ question: 'q', history: [{ ...base, sig: 'short' }] }, SECRET).ok).toBe(false);
	});

	it('does not require a signature on user turns, and strips extra fields from the output', () => {
		const out = validateChatInput({ question: 'q', history: [{ role: 'user', content: 'hi', sig: 'junk', extra: 1 }] }, SECRET);
		expect(out).toEqual({ ok: true, question: 'q', history: [{ role: 'user', content: 'hi' }] });
	});

	it('exports the documented limits', () => {
		expect(LIMITS).toMatchObject({ questionChars: 500, historyTurns: 6, turnChars: 1500 });
	});
});

describe('signTurn / historySecret', () => {
	it('is deterministic and depends on both secret and content', () => {
		expect(signTurn('a', 'x')).toBe(signTurn('a', 'x'));
		expect(signTurn('a', 'x')).not.toBe(signTurn('b', 'x'));
		expect(signTurn('a', 'x')).not.toBe(signTurn('a', 'y'));
	});

	it('derives a stable per-key signing secret that is not the API key itself', () => {
		expect(historySecret('sk-test')).toBe(historySecret('sk-test'));
		expect(historySecret('sk-test')).not.toBe(historySecret('sk-other'));
		expect(historySecret('sk-test')).not.toContain('sk-test');
	});

	it('a reply signed under one key is rejected under another key', () => {
		const reply = 'Andrew builds sites.';
		const sig = signTurn(historySecret('key-1'), reply);
		const history = [{ role: 'assistant', content: reply, sig }];
		expect(validateChatInput({ question: 'q', history }, historySecret('key-1')).ok).toBe(true);
		expect(validateChatInput({ question: 'q', history }, historySecret('key-2')).ok).toBe(false);
	});
});

describe('isSameOrigin edge cases', () => {
	it('accepts Sec-Fetch-Site same-origin and rejects same-site, cross-site, none', () => {
		const base = { origin: 'https://www.idrewlong.com', host: 'www.idrewlong.com' };
		expect(isSameOrigin({ ...base, fetchSite: 'same-origin' })).toBe(true);
		expect(isSameOrigin({ ...base, fetchSite: 'same-site' })).toBe(false);
		expect(isSameOrigin({ ...base, fetchSite: 'cross-site' })).toBe(false);
		expect(isSameOrigin({ ...base, fetchSite: 'none' })).toBe(false);
	});

	it('compares host including port', () => {
		expect(isSameOrigin({ origin: 'http://localhost:3001', host: 'localhost:3000' })).toBe(false);
		expect(isSameOrigin({ origin: 'http://localhost:3000', host: 'localhost:3000' })).toBe(true);
	});

	it('rejects when neither host nor siteUrl is available, or siteUrl is malformed', () => {
		expect(isSameOrigin({ origin: 'https://www.idrewlong.com' })).toBe(false);
		expect(isSameOrigin({ origin: 'https://www.idrewlong.com', host: 'other.example', siteUrl: '::bad' })).toBe(false);
	});

	it('does not treat look-alike or subdomain hosts as the site', () => {
		const siteUrl = 'https://www.idrewlong.com';
		expect(isSameOrigin({ origin: 'https://www.idrewlong.com.evil.example', host: 'x.vercel.app', siteUrl })).toBe(false);
		expect(isSameOrigin({ origin: 'https://idrewlong.com', host: 'x.vercel.app', siteUrl })).toBe(false);
		expect(isSameOrigin({ origin: 'null', host: 'x.vercel.app', siteUrl })).toBe(false);
	});
});

describe('memory counter and global daily cap', () => {
	it('expires counts after the TTL', async () => {
		const store = memoryCounter();
		const real = Date.now;
		let now = 1_000_000;
		Date.now = () => now;
		try {
			expect(await store.incr('k', 60)).toBe(1);
			expect(await store.incr('k', 60)).toBe(2);
			now += 61_000;
			expect(await store.incr('k', 60)).toBe(1);
		} finally {
			Date.now = real;
		}
	});

	it('enforces a daily cap across many callers and opens a fresh window the next day', async () => {
		const store = memoryCounter();
		const t = Date.UTC(2026, 9, 28, 9);
		const rule = { limit: 300, windowSec: 86_400 };
		let allowed = 0;
		for (let i = 0; i < 305; i++) if (await consumeQuota(store, 'global', rule, t + i)) allowed++;
		expect(allowed).toBe(300);
		expect(await consumeQuota(store, 'global', rule, t + 86_400_000)).toBe(true);
	});

	it('applies the route per-visitor rule: 8 per 10 minutes', async () => {
		const store = memoryCounter();
		const t = Date.UTC(2026, 9, 28, 9);
		const ten = { limit: 8, windowSec: 600 };
		const burst = await Promise.all(Array.from({ length: 10 }, () => consumeQuota(store, 'v', ten, t)));
		expect(burst.filter(Boolean)).toHaveLength(8);
	});
});

describe('visitorKey IPv6 forms', () => {
	it('handles loopback, unspecified, and trailing compression', () => {
		expect(visitorKey('::1')).toBe('0:0:0:0::/64');
		expect(visitorKey('::')).toBe('0:0:0:0::/64');
		expect(visitorKey('2001:db8::')).toBe('2001:db8:0:0::/64');
		expect(visitorKey('2001:db8::1')).toBe(visitorKey('2001:0db8:0:0:0:0:0:ffff'));
	});

	it('is case- and zero-padding-insensitive', () => {
		expect(visitorKey('2001:DB8:0001:0002::1')).toBe(visitorKey('2001:db8:1:2::9'));
	});

	it('leaves IPv4 and unknown untouched', () => {
		expect(visitorKey('10.0.0.1')).toBe('10.0.0.1');
		expect(visitorKey('unknown')).toBe('unknown');
	});

	it('separates different /64 blocks that differ only in the 4th group', () => {
		expect(visitorKey('2001:db8:1:2::1')).not.toBe(visitorKey('2001:db8:1:3::1'));
	});
});
