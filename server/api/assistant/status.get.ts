// Lets the widget hide itself when the assistant can't run: no API key, or
// (in production) no shared storage for its rate limits.
export default defineEventHandler((event) => ({
	enabled: Boolean(useRuntimeConfig(event).anthropicApiKey) && assistantCounter() !== null,
}));
