<template>
	<div v-if="enabled" class="ai">
		<button
			v-if="!open"
			ref="launcher"
			type="button"
			class="ai-launch"
			:class="{ 'ai-launch--wait': waitForScroll }"
			aria-haspopup="dialog"
			@click="openPanel"
		>
			<span class="ai-dot" aria-hidden="true"></span>
			<span class="ai-launch-text">
				<span class="readout !text-[var(--text)]">Ask my AI</span>
				<span class="ai-launch-sub">About my work, skills or projects</span>
			</span>
			<span class="ai-launch-arrow" aria-hidden="true">↗</span>
		</button>

		<div
			v-else
			ref="panel"
			class="ai-panel"
			role="dialog"
			aria-modal="false"
			aria-labelledby="ai-title"
			@keydown.esc="close"
		>
			<div class="ai-head">
				<p id="ai-title" class="readout !text-[var(--text)]">
					<span class="text-[var(--accent)]">&gt;</span> Assistant
				</p>
				<button type="button" class="ai-close" aria-label="Close assistant" @click="close">×</button>
			</div>

			<div ref="log" class="ai-log" aria-live="polite">
				<p class="ai-msg ai-msg--bot">
					Ask about Andrew's work, projects, skills or this site. Answers come only from what's published here.
				</p>
				<p
					v-for="(m, i) in messages"
					:key="i"
					class="ai-msg"
					:class="m.role === 'user' ? 'ai-msg--user' : 'ai-msg--bot'"
				>{{ m.content }}</p>
				<p v-if="pending" class="ai-msg ai-msg--bot ai-typing" aria-label="Thinking">…</p>
				<p v-if="error" class="ai-msg ai-msg--error" role="alert">{{ error }}</p>
			</div>

			<div v-if="!messages.length" class="ai-suggest">
				<button v-for="s in suggestions" :key="s" type="button" class="readout ai-chip" @click="ask(s)">{{ s }}</button>
			</div>

			<form class="ai-form" @submit.prevent="ask(draft)">
				<label for="ai-input" class="sr-only">Your question</label>
				<input
					id="ai-input"
					ref="input"
					v-model="draft"
					type="text"
					:maxlength="MAX_CHARS"
					autocomplete="off"
					placeholder="Ask a question…"
					:disabled="pending"
				/>
				<button type="submit" class="ai-send" :disabled="pending || !draft.trim()" aria-label="Send">↑</button>
			</form>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, nextTick, watch, onMounted, onBeforeUnmount } from 'vue';

// Mirrors the server limits in server/utils/assistantGuard.ts
const MAX_CHARS = 500;
// Mirrors the server's limits (server/utils/assistantGuard.ts LIMITS)
const MAX_HISTORY = 6;
const MAX_HISTORY_CHARS = 4000;

const { enabled, open } = useAssistant();
const pending = ref(false);
const error = ref('');
const draft = ref('');
const messages = ref([]);
const panel = ref(null);
const log = ref(null);
const input = ref(null);

const suggestions = ['What does Andrew build?', 'What is his AWS experience?', 'How was this site made?'];

function openPanel() {
	open.value = true;
}

// On phones the launcher would sit on top of the home hero's buttons, so it
// waits until the visitor has scrolled past the first half screen
const route = useRoute();
const scrolled = ref(false);
const onScroll = () => {
	scrolled.value = window.scrollY > window.innerHeight * 0.5;
};
const waitForScroll = computed(() => route.path === '/' && !scrolled.value);
onMounted(() => {
	onScroll();
	window.addEventListener('scroll', onScroll, { passive: true });
});
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll));

const launcher = ref(null);
let returnFocus = null;

// Focus the input however the panel was opened (launcher or nav button). On
// close, focus goes back to the button that opened it; the floating launcher
// was removed while the panel was up, so it falls back to the new one.
watch(open, (isOpen) => {
	if (isOpen) {
		useTrackEvent('assistant_open');
		returnFocus = document.activeElement;
		nextTick(() => input.value?.focus());
		return;
	}
	const target = returnFocus?.isConnected ? returnFocus : null;
	returnFocus = null;
	nextTick(() => (target ?? launcher.value)?.focus());
});

function close() {
	open.value = false;
}

async function ask(text) {
	const question = text.trim().slice(0, MAX_CHARS);
	if (!question || pending.value) return;
	error.value = '';
	const history = recentHistory();
	messages.value.push({ role: 'user', content: question });
	draft.value = '';
	pending.value = true;
	scrollDown();
	try {
		const res = await $fetch('/api/assistant', { method: 'POST', body: { question, history } });
		// Keep the server's signature; assistant turns are only accepted back with it
		messages.value.push({ role: 'assistant', content: res.answer, sig: res.sig });
		// Counts answered questions only; what was asked never goes to GA
		useTrackEvent('assistant_question', { question_type: suggestions.includes(question) ? 'suggested' : 'typed' });
	} catch (e) {
		// Unanswered: take the question back out so the history keeps alternating,
		// and put it back in the box to retry
		messages.value.pop();
		draft.value = question;
		error.value = e?.data?.statusMessage || e?.statusMessage || 'Something went wrong. Try again in a moment.';
	} finally {
		pending.value = false;
		scrollDown();
		nextTick(() => input.value?.focus());
	}
}

// Newest turns that fit the server's limits, starting on a question
function recentHistory() {
	const out = [];
	let chars = 0;
	for (let i = messages.value.length - 1; i >= 0 && out.length < MAX_HISTORY; i--) {
		const turn = messages.value[i];
		if (chars + turn.content.length > MAX_HISTORY_CHARS) break;
		chars += turn.content.length;
		out.unshift(turn);
	}
	while (out[0]?.role === 'assistant') out.shift();
	return out;
}

function scrollDown() {
	nextTick(() => {
		if (log.value) log.value.scrollTop = log.value.scrollHeight;
	});
}
</script>

<style scoped>
.ai {
	position: fixed;
	left: 1rem;
	bottom: 1rem;
	z-index: 70;
}

@media (min-width: 976px) {
	.ai {
		left: 1.5rem;
		bottom: 1.5rem;
	}
}

.ai-launch {
	display: inline-flex;
	align-items: center;
	gap: 0.75rem;
	min-height: 52px;
	padding: 0.5rem 1rem;
	border: 1px solid var(--accent);
	background: rgba(10, 11, 12, 0.92);
	box-shadow: 0 0 0 4px rgba(255, 91, 31, 0.08);
	backdrop-filter: blur(8px);
	cursor: pointer;
	transition: border-color 0.2s ease;
}

.ai-launch:hover {
	background: rgba(255, 91, 31, 0.12);
}

@media (max-width: 767px) {
	.ai-launch {
		transition:
			opacity 0.25s ease,
			visibility 0.25s;
	}

	.ai-launch--wait {
		opacity: 0;
		visibility: hidden;
	}
}

.ai-launch-text {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 0.2rem;
	text-align: left;
}

.ai-launch-sub {
	font-size: 0.75rem;
	color: var(--text-muted);
}

.ai-launch-arrow {
	color: var(--accent);
}

@media (max-width: 479px) {
	.ai-launch-sub {
		display: none;
	}
}

.ai-dot {
	width: 8px;
	height: 8px;
	background: var(--accent);
	animation: ai-pulse 2s ease-in-out infinite;
}

@keyframes ai-pulse {
	50% {
		opacity: 0.3;
	}
}

@media (prefers-reduced-motion: reduce) {
	.ai-dot {
		animation: none;
	}
}

.ai-panel {
	display: flex;
	flex-direction: column;
	width: min(24rem, calc(100vw - 2rem));
	height: min(32rem, calc(100svh - 6rem));
	border: 1px solid var(--border);
	background: rgba(10, 11, 12, 0.96);
	backdrop-filter: blur(10px);
}

.ai-head {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 0.5rem 0 1rem;
	min-height: 44px;
	border-bottom: 1px solid var(--border);
}

.ai-close {
	width: 44px;
	height: 44px;
	font-size: 1.25rem;
	color: var(--text-muted);
	cursor: pointer;
}

.ai-close:hover {
	color: var(--accent);
}

.ai-log {
	flex: 1;
	overflow-y: auto;
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	padding: 1rem;
}

.ai-msg {
	max-width: 88%;
	font-size: 0.875rem;
	line-height: 1.55;
	white-space: pre-wrap;
}

.ai-msg--bot {
	color: var(--text);
}

.ai-msg--user {
	align-self: flex-end;
	padding: 0.5rem 0.75rem;
	border: 1px solid var(--border);
	background: var(--bg-card);
	color: var(--text);
}

.ai-msg--error {
	color: var(--accent);
}

.ai-typing {
	color: var(--text-muted);
	letter-spacing: 0.2em;
}

.ai-suggest {
	display: flex;
	flex-wrap: wrap;
	gap: 0.4rem;
	padding: 0 1rem 0.75rem;
}

.ai-chip {
	padding: 0.4rem 0.6rem;
	border: 1px solid var(--border);
	text-transform: none;
	letter-spacing: 0.04em;
	cursor: pointer;
}

.ai-chip:hover {
	border-color: var(--accent);
	color: var(--text);
}

/* Touch screens get full 44px tap targets */
@media (pointer: coarse) {
	.ai-chip {
		min-height: 44px;
	}
}

.ai-form {
	display: flex;
	border-top: 1px solid var(--border);
}

.ai-form input {
	flex: 1;
	min-width: 0;
	min-height: 48px;
	padding: 0 1rem;
	background: transparent;
	color: var(--text);
	font-size: 0.9375rem;
}

.ai-form input:focus {
	outline: none;
}

.ai-form:focus-within {
	box-shadow: inset 0 0 0 1px var(--accent);
}

.ai-send {
	width: 48px;
	background: var(--accent);
	color: #0a0b0c;
	font-size: 1.1rem;
	cursor: pointer;
}

.ai-send:disabled {
	background: var(--bg-elevated);
	color: var(--text-muted);
	cursor: default;
}
</style>
