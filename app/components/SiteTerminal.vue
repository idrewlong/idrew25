<template>
	<Teleport to="body">
		<div v-if="open" class="term-backdrop" @mousedown.self="close">
			<div
				class="term"
				role="dialog"
				aria-modal="true"
				aria-labelledby="term-title"
				@click="focusInput"
			>
				<div class="term-bar">
					<p id="term-title" class="readout">
						<span class="text-[var(--accent)]">●</span> idrewlong.com · terminal
					</p>
					<span class="readout term-hint">Esc to close</span>
					<button type="button" class="term-close" aria-label="Close terminal" @click.stop="close">×</button>
				</div>

				<div ref="screen" class="term-screen" role="log" aria-live="polite" data-lenis-prevent>
					<p v-for="(l, i) in lines" :key="i" class="term-line" :class="[l.tone && `is-${l.tone}`, l.cmd && 'is-row']">
						<template v-if="l.prompt">
							<span class="term-prompt" aria-hidden="true">{{ prompt }}</span><span class="sr-only">Command:</span> {{ l.text }}
						</template>
						<template v-else-if="l.cmd"><span class="term-cmd">{{ l.cmd }}</span><span>{{ l.text }}</span></template>
						<a v-else-if="l.href" :href="l.href" v-bind="external(l.href)" @click="onLink($event, l.href)">{{ l.text }}</a>
						<template v-else>{{ l.text }}</template>
					</p>
				</div>

				<div class="term-quick" role="group" aria-label="Shortcut commands">
					<button v-for="c in shortcuts" :key="c" type="button" class="term-chip" :disabled="busy" @click.stop="quick(c)">{{ c }}</button>
				</div>

				<form class="term-input" @submit.prevent="submit">
					<label for="term-cmd" class="term-prompt">{{ prompt }}</label>
					<input
						id="term-cmd"
						ref="input"
						v-model="draft"
						type="text"
						autocomplete="off"
						autocapitalize="off"
						spellcheck="false"
						enterkeyhint="go"
						aria-describedby="term-help"
						:disabled="busy"
						@keydown="onKey"
					/>
					<span id="term-help" class="sr-only">Type a command and press Enter. Type help for every command. Tab completes, up and down arrows recall earlier commands, Escape closes.</span>
				</form>
			</div>
		</div>
	</Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { TERMINAL_COMMANDS, completeTerminal, runTerminal } from '~/utils/terminal';
import { parseVercelId, regionName } from '~/utils/vercelRequest';

/**
 * A small shell over the site: list and open pages, read the resume and
 * projects, hit the live ops and status endpoints, or hand a question to the
 * assistant. Opens with ` or ~ (when you're not typing in a field) or the
 * footer's Terminal button. Commands live in utils/terminal.ts.
 */
const open = useState('terminal-open', () => false);
const { enabled: assistantEnabled, question } = useAssistant();
const route = useRoute();
const { $scroll } = useNuxtApp();

const draft = ref('');
const busy = ref(false);
const history = ref([]);
let cursor = -1; // position while walking history with the arrows
const screen = ref(null);
const input = ref(null);
let returnFocus = null;

// Instructions shown each time it opens fresh, and again by `clear`
const welcome = () => [
	{ text: 'idrewlong.com terminal', tone: 'accent' },
	{ text: 'Explore the site by typing commands. Type one below and press Enter, or tap a shortcut.', tone: 'muted' },
	{ text: '' },
	{ cmd: 'help', text: 'every command', tone: 'muted' },
	{ cmd: 'whoami', text: 'who built this', tone: 'muted' },
	{ cmd: 'projects', text: 'what I build (projects <name> for one)', tone: 'muted' },
	{ cmd: 'cd <page>', text: 'go to a page, e.g. cd blog (ls lists them)', tone: 'muted' },
	{ cmd: 'status', text: 'is the site up right now', tone: 'muted' },
	{ cmd: 'ask "<question>"', text: 'ask the AI assistant', tone: 'muted' },
	{ text: '' },
	{ text: 'Tab completes · ↑ ↓ recall earlier commands · Esc closes', tone: 'muted' },
];

const shortcuts = ['help', 'whoami', 'projects', 'ls', 'status', 'curl /api/ops'];

// Shortcut buttons run a command as if it had been typed
function quick(cmd) {
	draft.value = cmd;
	submit();
	nextTick(() => input.value?.focus());
}
const lines = ref(welcome());

const prompt = computed(() => `andrew@idrewlong:${route.path === '/' ? '~' : route.path.replace(/\/$/, '')}$`);

function print(more) {
	lines.value.push(...more);
	nextTick(() => {
		if (screen.value) screen.value.scrollTop = screen.value.scrollHeight;
	});
}

async function submit() {
	const cmd = draft.value.trim();
	draft.value = '';
	cursor = -1;
	print([{ text: cmd, prompt: true }]);
	if (!cmd) return;
	history.value.push(cmd);
	// Only known command names reach analytics, never what was typed
	const name = cmd.split(/\s+/)[0].toLowerCase();
	useTrackEvent('terminal_command', { command: TERMINAL_COMMANDS.includes(name) ? name : 'unknown' });

	const { lines: result, action } = runTerminal(cmd, history.value.slice(0, -1), route.path);
	print(result);
	if (!action) return;

	if (action.type === 'clear') lines.value = [{ text: 'Type help for commands.', tone: 'muted' }];
	else if (action.type === 'close') close();
	else if (action.type === 'navigate') {
		close();
		await navigateTo(action.to);
	} else if (action.type === 'ask') {
		if (!assistantEnabled.value) return print([{ text: 'ask: the assistant is offline right now.', tone: 'error' }]);
		close();
		question.value = action.question;
	} else if (action.type === 'fetch') {
		busy.value = true;
		try {
			print(action.what === 'ops' ? await opsLines() : await statusLines());
		} catch {
			print([{ text: `request failed. Try again in a moment.`, tone: 'error' }]);
		} finally {
			busy.value = false;
			nextTick(() => input.value?.focus());
		}
	}
}

async function opsLines() {
	const t0 = performance.now();
	const res = await fetch('/api/ops', { cache: 'no-store' });
	if (!res.ok) throw new Error(String(res.status));
	const ms = Math.round(performance.now() - t0);
	const d = await res.json();
	const { edge, region } = parseVercelId(res.headers.get('x-vercel-id'));
	const cache = res.headers.get('x-vercel-cache');
	const out = [
		{ text: `HTTP ${res.status} · ${ms} ms${cache ? ` · x-vercel-cache: ${cache}` : ''}`, tone: 'muted' },
		{ text: `deploy     ${d.deploy.sha ? `${d.deploy.sha.slice(0, 7)} (${d.deploy.ref})` : 'local build'}` },
		{ text: `ci         ${d.ci ? d.ci.state : 'n/a'}` },
	];
	if (edge) out.push({ text: `edge       ${regionName(edge)}${region ? ` → function ${regionName(region)}` : ''}` });
	if (d.uptime) out.push({ text: `uptime     ${d.uptime.uptimePct}% over 30 days, median ${d.uptime.medianMs} ms` });
	if (d.lighthouse) {
		const s = d.lighthouse.scores;
		out.push({ text: `lighthouse perf ${s.performance} · a11y ${s.accessibility} · bp ${s.bestPractices} · seo ${s.seo}` });
	}
	out.push({ text: `assistant  ${d.assistant.model}` });
	out.push({ text: 'More: cd teardown', href: '/teardown', tone: 'muted' });
	return out;
}

async function statusLines() {
	const d = await $fetch('/api/status');
	const state = { up: 'up and answering', down: 'down: the last check failed', unknown: 'no recent checks' }[d.state];
	return [
		{ text: `state      ${state}`, tone: d.state === 'up' ? 'accent' : 'error' },
		...d.windows.map((w) => ({ text: `${w.label.padEnd(11)}${w.pct === null ? '–' : `${w.pct}%`}` })),
		{ text: `outages    ${d.outages.length}` },
		{ text: 'More: cd status', href: '/status', tone: 'muted' },
	];
}

function onKey(e) {
	if (e.key === 'Tab') {
		const options = completeTerminal(draft.value);
		// Empty line: let Tab move focus on to the close button
		if (!draft.value.trim()) return;
		e.preventDefault();
		if (options.length === 1) draft.value = `${options[0]} `;
		else if (options.length > 1) print([{ text: options.join('   '), tone: 'muted' }]);
	} else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
		if (!history.value.length) return;
		e.preventDefault();
		const n = history.value.length;
		cursor = e.key === 'ArrowUp' ? (cursor === -1 ? n - 1 : Math.max(0, cursor - 1)) : cursor === -1 ? -1 : cursor + 1;
		if (cursor >= n) cursor = -1;
		draft.value = cursor === -1 ? '' : history.value[cursor];
	} else if (e.key === 'l' && e.ctrlKey) {
		e.preventDefault();
		lines.value = [{ text: 'Type help for commands.', tone: 'muted' }];
	}
}

// Same-site links navigate in the app (and close the terminal)
function onLink(e, href) {
	if (!href.startsWith('/')) return;
	e.preventDefault();
	close();
	navigateTo(href);
}
const external = (href) => (href.startsWith('/') || href.startsWith('mailto:') ? {} : { target: '_blank', rel: 'noopener noreferrer' });

function focusInput() {
	if (window.getSelection()?.toString()) return; // let people copy output
	input.value?.focus();
}

function close() {
	open.value = false;
}

// ` or ~ opens it, unless the visitor is typing somewhere
function onWindowKey(e) {
	if (open.value) {
		if (e.key === 'Escape') {
			e.preventDefault();
			close();
		}
		return;
	}
	if ((e.key !== '`' && e.key !== '~') || e.metaKey || e.ctrlKey || e.altKey) return;
	const t = e.target;
	if (t instanceof HTMLElement && (t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName))) return;
	e.preventDefault();
	open.value = true;
}

onMounted(() => window.addEventListener('keydown', onWindowKey));
onBeforeUnmount(() => {
	window.removeEventListener('keydown', onWindowKey);
	setPageInert(false);
});

// The terminal is teleported to <body>; making the app inert keeps Tab and
// screen readers inside the dialog while it's open
function setPageInert(on) {
	const app = document.getElementById('__nuxt');
	if (app) app.inert = on;
}

watch(open, (isOpen) => {
	setPageInert(isOpen);
	if (isOpen) {
		returnFocus = document.activeElement;
		$scroll?.lenis?.stop();
		useTrackEvent('terminal_open');
		nextTick(() => input.value?.focus());
	} else {
		$scroll?.lenis?.start();
		const target = returnFocus;
		returnFocus = null;
		nextTick(() => {
			if (target instanceof HTMLElement && target.isConnected) target.focus();
		});
	}
});
</script>

<style scoped>
.term-backdrop {
	position: fixed;
	inset: 0;
	z-index: 9000;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 16px;
	background: rgb(5 5 6 / 0.72);
	backdrop-filter: blur(3px);
}

.term {
	display: flex;
	flex-direction: column;
	width: min(100%, 760px);
	height: min(72vh, 560px);
	background: #050506;
	border: 1px solid var(--border);
	box-shadow: 0 30px 80px rgb(0 0 0 / 0.6);
	font-family: 'Geist Mono', ui-monospace, monospace;
	font-size: 13px;
	line-height: 1.6;
	color: #c9cdd2;
}

.term-bar {
	display: flex;
	align-items: center;
	gap: 1rem;
	padding: 0 0 0 1rem;
	border-bottom: 1px solid var(--border);
}

.term-hint {
	margin-left: auto;
}

.term-close {
	width: 44px;
	height: 44px;
	border-left: 1px solid var(--border);
	font-size: 20px;
	line-height: 1;
	color: var(--text-muted);
	cursor: pointer;
}

.term-close:hover,
.term-close:focus-visible {
	color: var(--text);
}

.term-screen {
	flex: 1;
	overflow-y: auto;
	overscroll-behavior: contain;
	padding: 1rem;
}

.term-line {
	white-space: pre-wrap;
	overflow-wrap: anywhere;
}

.term-line.is-row {
	display: grid;
	grid-template-columns: 11rem 1fr;
	gap: 0 1rem;
	padding-left: 1ch;
}

.term-cmd {
	color: var(--text);
}

/* Empty spacer lines keep their height */
.term-line:empty::before {
	content: '\200b';
}

.term-line.is-muted {
	color: var(--text-muted);
}

.term-line.is-accent {
	color: var(--accent);
}

.term-line.is-error {
	color: #f87171;
}

.term-line a {
	color: inherit;
	text-decoration: underline;
	text-underline-offset: 3px;
}

.term-line a:hover {
	color: var(--text);
}

.term-prompt {
	flex: none;
	margin-right: 0.6rem;
	color: var(--accent);
}

.term-quick {
	display: flex;
	gap: 0.4rem;
	padding: 0.6rem 1rem 0;
	overflow-x: auto;
	scrollbar-width: none;
	border-top: 1px solid var(--border);
}

.term-chip {
	flex: none;
	min-height: 32px;
	padding: 0 0.7rem;
	border: 1px solid var(--border);
	font: inherit;
	font-size: 12px;
	color: var(--text-muted);
	cursor: pointer;
}

.term-chip:hover:not(:disabled),
.term-chip:focus-visible {
	border-color: var(--accent);
	color: var(--text);
}

@media (pointer: coarse) {
	.term-chip {
		min-height: 40px;
	}
}

.term-input {
	display: flex;
	align-items: center;
	padding: 0.6rem 1rem 0.75rem;
}

.term-input input {
	flex: 1;
	min-width: 0;
	background: transparent;
	color: var(--text);
	font: inherit;
	/* 16px stops iOS zooming into the field */
	font-size: max(16px, 1em);
	caret-color: var(--accent);
	outline: none;
}

@media (max-width: 479px) {
	.term-hint {
		display: none;
	}

	/* Command above its description on phones */
	.term-line.is-row {
		grid-template-columns: 1fr;
		margin-bottom: 0.35rem;
	}

	.term {
		height: min(80vh, 560px);
	}

	.term-prompt {
		max-width: 45%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}
</style>
