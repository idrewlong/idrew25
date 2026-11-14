<template>
	<Teleport to="body">
		<!-- Step 1: a small, non-blocking question card -->
		<Transition name="rp-card">
			<div v-if="step === 'ask'" class="rp-card" role="region" aria-labelledby="rp-ask-title">
				<p id="rp-ask-title" class="rp-ask">Are you a recruiter?</p>
				<p class="rp-ask-sub">I'll show the quick facts you usually ask first.</p>
				<div class="rp-ask-actions">
					<button ref="yesBtn" type="button" class="btn btn-solid rp-btn" @click="answer('yes')">Yes</button>
					<button type="button" class="btn btn-ghost rp-btn" @click="answer('no')">No</button>
				</div>
			</div>
		</Transition>

		<!-- Step 2: the quick facts, as a modal -->
		<div v-if="step === 'facts'" class="rp-backdrop" @mousedown.self="close">
			<div class="rp-modal" data-lenis-prevent role="dialog" aria-modal="true" aria-labelledby="rp-facts-title">
				<div class="rp-head">
					<h2 id="rp-facts-title" class="readout rp-title">
						<span class="rp-dot" aria-hidden="true"></span>
						Quick facts for recruiters
					</h2>
					<button ref="closeBtn" type="button" class="rp-close" aria-label="Close" @click="close">×</button>
				</div>

				<dl class="rp-list">
					<div v-for="f in quickFacts" :key="f.label" class="rp-item">
						<dt class="readout">{{ f.label }}</dt>
						<dd>{{ f.value }}</dd>
					</div>
				</dl>

				<div class="rp-actions">
					<a :href="RESUME_PDF" download class="btn btn-solid" @click="track('resume')">
						<Icon name="heroicons:arrow-down-tray" class="w-4 h-4" :aria-hidden="true" />
						<span>Resume PDF</span>
					</a>
					<NuxtLink to="/contact" class="btn btn-ghost" @click="close(); track('contact')">
						<span>Get in touch</span>
					</NuxtLink>
					<button v-if="assistant.enabled.value" type="button" class="btn btn-ghost" @click="askFit">
						<span>Ask the AI about fit</span>
					</button>
				</div>
			</div>
		</div>
	</Teleport>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { quickFacts, RESUME_PDF } from '#shared/siteData/recruiter';

/**
 * Asks once, a few seconds into a visit: "Are you a recruiter?" Yes opens the
 * quick facts (shared/siteData/recruiter.ts) in a modal; No just closes. The
 * question is a small card, not a full-screen pop-up, so it never blocks the
 * page (Google also penalizes intrusive mobile interstitials). Either answer
 * is remembered, so it doesn't ask again. It only asks on the page a visit
 * lands on: once the visitor moves to another page, it stays quiet. The
 * footer's "For recruiters" link reopens the facts at any time.
 */
const DELAY_MS = 6000;
const STORAGE_KEY = 'recruiter-prompt';

const step = ref(null); // null | 'ask' | 'facts'
const yesBtn = ref(null);
const closeBtn = ref(null);
const assistant = useAssistant();
const { $scroll } = useNuxtApp();
const preloading = useState('preloader', () => false);
const terminalOpen = useState('terminal-open', () => false);
const factsRequested = useState('recruiter-facts', () => false);
const route = useRoute();
let timer;
let explored = false; // true after the first client-side page change
let returnFocus = null;

function answered() {
	try {
		return Boolean(localStorage.getItem(STORAGE_KEY));
	} catch {
		return false;
	}
}

function remember(value) {
	try {
		localStorage.setItem(STORAGE_KEY, value);
	} catch {}
}

const track = (action) => useTrackEvent('recruiter_prompt', { action });

// Don't interrupt: no prompt during the preloader, or while the menu,
// terminal or assistant is open
const busy = () =>
	preloading.value ||
	terminalOpen.value ||
	assistant.open.value ||
	Boolean(document.getElementById('mobile-menu'));

function schedule() {
	clearTimeout(timer);
	if (explored || answered() || step.value) return;
	timer = setTimeout(function tryShow() {
		if (explored || answered()) return;
		if (busy()) {
			timer = setTimeout(tryShow, 2000);
			return;
		}
		step.value = 'ask';
		track('shown');
	}, DELAY_MS);
}

onMounted(() => {
	if (preloading.value) {
		const stop = watch(preloading, (p) => {
			if (!p) {
				stop();
				schedule();
			}
		});
	} else schedule();
});

// Moving to another page ends the chance to ask. A card already showing is
// put away without recording an answer.
watch(
	() => route.path,
	() => {
		explored = true;
		clearTimeout(timer);
		if (step.value === 'ask') step.value = null;
	}
);

// The footer link asks for the facts directly
watch(factsRequested, (want) => {
	if (!want) return;
	factsRequested.value = false;
	clearTimeout(timer);
	returnFocus = document.activeElement;
	step.value = 'facts';
	track('footer');
});

function answer(value) {
	remember(value);
	track(value);
	if (value === 'yes') {
		returnFocus = document.activeElement === yesBtn.value ? null : document.activeElement;
		step.value = 'facts';
	} else {
		step.value = null;
	}
}

function close() {
	step.value = null;
}

function askFit() {
	close();
	track('ask_ai');
	assistant.question.value = 'Which roles is Andrew the strongest fit for, and why?';
}

// The modal keeps focus inside (the page goes inert) and closes on Esc
function setPageInert(on) {
	const app = document.getElementById('__nuxt');
	if (app) app.inert = on;
}

function onKey(e) {
	if (e.key === 'Escape' && step.value) {
		e.preventDefault();
		if (step.value === 'ask') answer('no');
		else close();
	}
}

watch(step, (s, prev) => {
	setPageInert(s === 'facts');
	if (s === 'facts') $scroll?.lenis?.stop();
	else if (prev === 'facts') $scroll?.lenis?.start();
	if (s === 'facts') nextTick(() => closeBtn.value?.focus());
	if (!s && prev === 'facts') {
		const target = returnFocus;
		returnFocus = null;
		nextTick(() => {
			if (target instanceof HTMLElement && target.isConnected) target.focus();
		});
	}
});

onMounted(() => window.addEventListener('keydown', onKey));
onBeforeUnmount(() => {
	clearTimeout(timer);
	window.removeEventListener('keydown', onKey);
	setPageInert(false);
});
</script>

<style scoped>
.rp-card {
	position: fixed;
	z-index: 8500;
	left: 16px;
	right: 16px;
	/* Above the floating Ask AI launcher on phones */
	bottom: calc(1rem + 60px);
	padding: 1rem 1.1rem;
	background: rgba(17, 19, 21, 0.97);
	backdrop-filter: blur(8px);
	border: 1px solid var(--border);
	border-top: 2px solid var(--accent);
	box-shadow: 0 20px 50px rgb(0 0 0 / 0.5);
}

@media (min-width: 768px) {
	.rp-card {
		left: 50%;
		right: auto;
		bottom: 1.5rem;
		width: 360px;
		transform: translateX(-50%);
	}
}

.rp-ask {
	font-family: 'Geist Mono', monospace;
	font-size: 14px;
	color: var(--text);
}

.rp-ask-sub {
	margin-top: 0.3rem;
	font-size: 0.875rem;
	line-height: 1.5;
	color: var(--text-muted);
}

.rp-ask-actions {
	display: flex;
	gap: 0.6rem;
	margin-top: 0.9rem;
}

.rp-btn {
	flex: 1;
	justify-content: center;
}

.rp-card-enter-active,
.rp-card-leave-active {
	transition:
		opacity 0.3s ease,
		translate 0.3s ease;
}

.rp-card-enter-from,
.rp-card-leave-to {
	opacity: 0;
	translate: 0 12px;
}

@media (prefers-reduced-motion: reduce) {
	.rp-card-enter-active,
	.rp-card-leave-active {
		transition: none;
	}
}

.rp-backdrop {
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

.rp-modal {
	width: min(100%, 640px);
	max-height: calc(100vh - 32px);
	overflow-y: auto;
	overscroll-behavior: contain;
	padding: 1.25rem;
	background: var(--bg-card);
	border: 1px solid var(--border);
	box-shadow: 0 30px 80px rgb(0 0 0 / 0.6);
}

@media (min-width: 768px) {
	.rp-modal {
		padding: 1.75rem 2rem;
	}
}

.rp-head {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	padding-bottom: 0.75rem;
	border-bottom: 1px solid var(--border);
}

.rp-title {
	display: inline-flex;
	align-items: center;
	gap: 0.6rem;
	color: var(--text);
}

.rp-dot {
	width: 6px;
	height: 6px;
	background: var(--accent);
}

.rp-close {
	width: 44px;
	height: 44px;
	margin: -0.5rem -0.75rem -0.5rem 0;
	font-size: 22px;
	line-height: 1;
	color: var(--text-muted);
	cursor: pointer;
}

.rp-close:hover,
.rp-close:focus-visible {
	color: var(--text);
}

.rp-list {
	display: grid;
	grid-template-columns: 1fr;
}

@media (min-width: 640px) {
	.rp-list {
		grid-template-columns: repeat(2, minmax(0, 1fr));
		column-gap: 2rem;
	}
}

.rp-item {
	display: flex;
	flex-direction: column;
	gap: 0.3rem;
	padding: 0.85rem 0;
	border-bottom: 1px solid var(--border);
}

.rp-item dd {
	font-size: 0.9375rem;
	line-height: 1.5;
	color: var(--text);
}

.rp-actions {
	display: flex;
	flex-wrap: wrap;
	gap: 0.75rem;
	margin-top: 1.25rem;
}
</style>
