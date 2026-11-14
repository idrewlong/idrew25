import type { Redis } from '@upstash/redis';
import { costUsd, decodeSample, encodeSample, type LighthouseResult, type TokenUsage, type UptimeSample } from './ops';

/** The few Redis calls the ops panel needs; Upstash's client has all of them. */
export interface OpsKv {
	hincrby(key: string, field: string, increment: number): Promise<unknown>;
	hgetall<T extends Record<string, unknown>>(key: string): Promise<T | null>;
	expire(key: string, seconds: number): Promise<unknown>;
	get<T>(key: string): Promise<T | null>;
	set(key: string, value: unknown, opts?: { nx?: boolean; ex?: number }): Promise<unknown>;
	lpush(key: string, ...values: string[]): Promise<unknown>;
	ltrim(key: string, start: number, stop: number): Promise<unknown>;
	lrange<T = string>(key: string, start: number, stop: number): Promise<T[]>;
}

let devKv: OpsKv | undefined;

/** In-memory stand-in for local dev, where there's no Upstash. */
function memoryKv(): OpsKv {
	const data = new Map<string, unknown>();
	return {
		async hincrby(key, field, n) {
			const h = (data.get(key) as Record<string, number>) ?? {};
			h[field] = (h[field] ?? 0) + n;
			data.set(key, h);
			return h[field];
		},
		async hgetall(key) {
			return (data.get(key) as never) ?? null;
		},
		async expire() {
			return 1;
		},
		async get(key) {
			return (data.get(key) as never) ?? null;
		},
		async set(key, value, opts) {
			if (opts?.nx && data.has(key)) return null;
			data.set(key, value);
			return 'OK';
		},
		async lpush(key, ...values) {
			const list = (data.get(key) as string[]) ?? [];
			list.unshift(...values.reverse());
			data.set(key, list);
			return list.length;
		},
		async ltrim(key, start, stop) {
			const list = (data.get(key) as string[]) ?? [];
			data.set(key, list.slice(start, stop + 1));
			return 'OK';
		},
		async lrange(key, start, stop) {
			const list = (data.get(key) as never[]) ?? [];
			return list.slice(start, stop === -1 ? undefined : stop + 1);
		},
	};
}

/**
 * Shared storage for the ops panel: the same Upstash database the assistant's
 * rate limits use (Upstash is mounted at `assistant:`), under `ops:` keys.
 * Null in production without Upstash, so the panel just omits those rows.
 * Local dev always uses an in-memory copy.
 */
export function opsKv(): OpsKv | null {
	// Local dev never touches the real database, even when .env points at it,
	// so testing can't put fake checks or costs on the live panel
	if (import.meta.dev) return (devKv ??= memoryKv());
	const driver = useStorage().getMount('assistant:')?.driver as { name?: string; getInstance?: () => Redis } | undefined;
	if (driver?.name === 'upstash' && driver.getInstance) return driver.getInstance() as unknown as OpsKv;
	return null;
}

const dayKey = (now: Date) => `ops:assistant:${now.toISOString().slice(0, 10)}`;

/**
 * Add one answered question's real token usage to today's totals. Best effort:
 * a storage hiccup must never fail the visitor's answer.
 */
export async function recordAssistantUsage(model: string, usage: TokenUsage, now = new Date()): Promise<void> {
	try {
		const kv = opsKv();
		if (!kv) return;
		const key = dayKey(now);
		const micro = Math.round((costUsd(model, usage) ?? 0) * 1e6);
		const tokens =
			(usage.input_tokens ?? 0) + (usage.cache_read_input_tokens ?? 0) + (usage.cache_creation_input_tokens ?? 0) + (usage.output_tokens ?? 0);
		await Promise.all([
			kv.hincrby(key, 'questions', 1),
			kv.hincrby(key, 'costMicroUsd', micro),
			kv.hincrby(key, 'tokens', tokens),
		]);
		await kv.expire(key, 60 * 60 * 24 * 3);
	} catch (error) {
		console.error('[ops] could not record assistant usage', error);
	}
}

export interface AssistantDay {
	questions: number;
	costUsd: number;
	tokens: number;
}

export async function assistantToday(now = new Date()): Promise<AssistantDay | null> {
	const kv = opsKv();
	if (!kv) return null;
	const h = (await kv.hgetall<Record<string, number | string>>(dayKey(now))) ?? {};
	return {
		questions: Number(h.questions ?? 0),
		costUsd: Number(h.costMicroUsd ?? 0) / 1e6,
		tokens: Number(h.tokens ?? 0),
	};
}

export const LIGHTHOUSE_KEY = 'ops:lighthouse';

export async function storedLighthouse(): Promise<LighthouseResult | null> {
	return (await opsKv()?.get<LighthouseResult>(LIGHTHOUSE_KEY)) ?? null;
}

// Newest first, capped a little above 90 days of 15-minute checks
const UPTIME_KEY = 'ops:uptime';
const UPTIME_MAX = 8800;

export async function recordUptime(sample: UptimeSample): Promise<void> {
	const kv = opsKv();
	if (!kv) throw new Error('No storage configured');
	await kv.lpush(UPTIME_KEY, encodeSample(sample));
	await kv.ltrim(UPTIME_KEY, 0, UPTIME_MAX - 1);
}

/** The newest `limit` checks (default: everything kept, about 90 days). */
export async function uptimeSamples(limit = UPTIME_MAX): Promise<UptimeSample[] | null> {
	const kv = opsKv();
	if (!kv) return null;
	const raw = await kv.lrange<unknown>(UPTIME_KEY, 0, Math.min(limit, UPTIME_MAX) - 1);
	return raw.map(decodeSample).filter((s): s is UptimeSample => s !== null);
}
