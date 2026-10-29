import { createHash } from 'node:crypto';
import type { Redis } from '@upstash/redis';
import { memoryCounter, type CounterStore } from './assistantGuard';

let devCounter: CounterStore | undefined;

/**
 * Where the assistant's rate-limit counters live. Production needs Upstash
 * (shared across serverless instances, atomic INCR); without it this returns
 * null and the assistant stays offline rather than run with per-instance
 * limits that don't cap anything. Local dev falls back to memory.
 */
export function assistantCounter(): CounterStore | null {
	const mount = useStorage().getMount('assistant:');
	const driver = mount?.driver as { name?: string; getInstance?: () => Redis } | undefined;
	if (driver?.name === 'upstash' && driver.getInstance) {
		const redis = driver.getInstance();
		return {
			async incr(key, ttlSec) {
				const k = `assistant:${key}`;
				const n = await redis.incr(k);
				if (n === 1) await redis.expire(k, ttlSec);
				return n;
			},
		};
	}
	if (import.meta.dev) return (devCounter ??= memoryCounter());
	return null;
}

/** Key for signing assistant replies, derived so no extra secret is needed. */
export function historySecret(apiKey: string): string {
	return createHash('sha256').update(`assistant-history:${apiKey}`).digest('hex');
}
