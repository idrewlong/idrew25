import { createHash } from 'node:crypto';
import Anthropic from '@anthropic-ai/sdk';
import { DEFAULT_ASSISTANT_MODEL } from '../utils/ops';
import { recordAssistantUsage } from '../utils/opsStore';

// Per-visitor limits. The global daily cap (runtimeConfig) is the backstop.
const PER_VISITOR = [
	{ limit: 8, windowSec: 60 * 10 },
	{ limit: 25, windowSec: 60 * 60 * 24 },
];
const MAX_BODY_BYTES = 16_000;
// Production origin (also nuxt.config site.url); the request host covers previews
const SITE_URL = 'https://www.idrewlong.com';

let client: Anthropic | undefined;

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig(event);

	// 1. Kill switch: no key, or no shared rate-limit storage in production
	const store = assistantCounter();
	if (!config.anthropicApiKey || !store) {
		throw createError({ statusCode: 503, statusMessage: 'Assistant is offline.' });
	}
	const secret = historySecret(config.anthropicApiKey);

	// 2. Same-origin only
	const allowed = isSameOrigin({
		origin: getRequestHeader(event, 'origin'),
		// The Host header itself: X-Forwarded-Host is whatever the client sends
		host: getRequestHost(event),
		siteUrl: SITE_URL,
		fetchSite: getRequestHeader(event, 'sec-fetch-site'),
	});
	if (!allowed) throw createError({ statusCode: 403, statusMessage: 'Forbidden.' });

	// 3. Input limits. Content-Length turns big bodies away early; chunked
	// requests don't send one, so the raw body is measured too before parsing
	const length = Number(getRequestHeader(event, 'content-length') ?? 0);
	if (length > MAX_BODY_BYTES) throw createError({ statusCode: 413, statusMessage: 'Request too large.' });
	const raw = await readRawBody(event, false).catch(() => undefined);
	if (raw && raw.byteLength > MAX_BODY_BYTES) {
		throw createError({ statusCode: 413, statusMessage: 'Request too large.' });
	}
	let body: unknown = null;
	try {
		body = raw ? JSON.parse(raw.toString('utf8')) : null;
	} catch {
		// Falls through to validateChatInput's "Invalid request."
	}
	const input = validateChatInput(body, secret);
	if (!input.ok) throw createError({ statusCode: 400, statusMessage: input.error });

	// 4. Per-visitor rate limits, keyed by a salted hash of the IP (IPv6 by /64)
	const ip = visitorKey(getRequestIP(event, { xForwardedFor: true }) ?? 'unknown');
	const visitor = createHash('sha256').update(`${secret}:${ip}`).digest('hex').slice(0, 24);
	for (const rule of PER_VISITOR) {
		if (!(await consumeQuota(store, `visitor:${visitor}`, rule))) {
			throw createError({ statusCode: 429, statusMessage: "You've asked a lot of questions. Try again later, or email idrewlong@gmail.com." });
		}
	}

	// 5. Global daily budget across every visitor
	const dailyCap = Number(config.assistantDailyCap) || 300;
	if (!(await consumeQuota(store, 'global', { limit: dailyCap, windowSec: 60 * 60 * 24 }))) {
		throw createError({ statusCode: 429, statusMessage: 'The assistant is resting until tomorrow. Email idrewlong@gmail.com in the meantime.' });
	}

	// 6. The model call: small output cap, low effort, fixed scope. No retries,
	// so each counted request is at most one billed call
	client ??= new Anthropic({ apiKey: config.anthropicApiKey, maxRetries: 0, timeout: 30_000 });
	// Haiku 5.5 by default: short answers over a small published knowledge base
	// don't need a bigger model, and it costs about 1/40th of Opus 5.5 per token.
	// Haiku has no server-side refusal fallback, so only send one for models that do.
	const model = config.assistantModel || DEFAULT_ASSISTANT_MODEL;
	const fallback = model.startsWith('claude-haiku')
		? {}
		: { betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' as const };
	try {
		const response = await client.beta.messages.create({
			model,
			max_tokens: 1024,
			output_config: { effort: 'low' },
			...fallback,
			system: [{ type: 'text', text: ASSISTANT_SYSTEM, cache_control: { type: 'ephemeral' } }],
			messages: [...input.history, { role: 'user', content: input.question }],
		});

		// Real token usage feeds the "cost today" line on the teardown ops panel
		await recordAssistantUsage(model, response.usage);

		const text =
			response.stop_reason === 'refusal'
				? ''
				: response.content
						.flatMap((block) => (block.type === 'text' ? [block.text] : []))
						.join('')
						.trim();
		const answer = (text || 'I can only answer questions about Andrew and this site.').slice(0, LIMITS.turnChars);
		// Signed so it can come back as history; unsigned "replies" are rejected
		return { answer, sig: signTurn(secret, answer) };
	} catch (error) {
		if (error instanceof Anthropic.RateLimitError) {
			throw createError({ statusCode: 429, statusMessage: 'The assistant is busy. Try again in a minute.' });
		}
		if (error instanceof Anthropic.APIError) {
			console.error('[assistant] API error', error.status, error.message);
			throw createError({ statusCode: 502, statusMessage: 'The assistant is having trouble right now.' });
		}
		throw error;
	}
});
