<template>
	<div class="ops">
		<p class="readout ops-cmd"><span class="text-[var(--accent)]">$</span> GET /api/ops</p>

		<p v-if="error" class="readout ops-wait">Ops data unavailable right now.</p>
		<p v-else-if="!data" class="readout ops-wait">Asking the server how it's doing…</p>

		<dl v-else class="ops-list">
			<div class="ops-row">
				<dt class="readout">Deploy</dt>
				<dd>
					<template v-if="data.deploy.sha">
						<span class="ops-val">{{ data.deploy.sha.slice(0, 7) }}</span>
						<span class="ops-sub">{{ data.deploy.ref }} · {{ timeAgo(data.deploy.builtAt, now) }}</span>
						<span v-if="data.deploy.message" class="ops-note">{{ data.deploy.message }}</span>
					</template>
					<span v-else class="ops-val">Local build</span>
				</dd>
			</div>

			<div class="ops-row">
				<dt class="readout">CI</dt>
				<dd>
					<span v-if="data.ci" class="ops-val">
						<span class="ops-dot" :class="`is-${data.ci.state}`" aria-hidden="true"></span>
						{{ ciText[data.ci.state] }}
					</span>
					<span v-else class="ops-val ops-muted">Not available</span>
					<span v-if="data.ci" class="ops-sub">{{ data.ci.checks }} GitHub check{{ data.ci.checks === 1 ? '' : 's' }} on this commit</span>
				</dd>
			</div>

			<div class="ops-row">
				<dt class="readout">Your request</dt>
				<dd>
					<span class="ops-val">
						<template v-if="request.cache">{{ request.cache }}</template>
						<template v-else>No edge cache locally</template>
						<span class="ops-sub-inline">{{ request.ms }} ms</span>
					</span>
					<span v-if="request.edge" class="ops-sub">
						Edge {{ regionName(request.edge) }}<template v-if="request.region"> → function {{ regionName(request.region) }}</template><template v-if="request.age !== null"> · cached {{ request.age }} s</template>
					</span>
					<span class="ops-note">{{ cacheNote }}</span>
				</dd>
			</div>

			<div class="ops-row">
				<dt class="readout">Uptime</dt>
				<dd>
					<template v-if="data.uptime">
						<span class="ops-val">
							<b class="ops-hi tabular-nums">{{ data.uptime.uptimePct }}%</b>
							<span class="ops-sub-inline tabular-nums">median {{ data.uptime.medianMs }} ms</span>
						</span>
						<div class="ops-bars" role="img" :aria-label="uptimeLabel">
							<span
								v-for="d in data.uptime.days"
								:key="d.date"
								class="ops-bar"
								:class="{ 'is-empty': !d.checks, 'is-down': d.checks && d.up < d.checks }"
								:style="{ height: d.medianMs ? `${barHeight(d.medianMs)}%` : undefined }"
								:title="d.checks ? `${d.date}: ${d.up}/${d.checks} up, median ${d.medianMs ?? '–'} ms` : `${d.date}: no checks`"
							></span>
						</div>
						<span class="ops-sub tabular-nums">
							{{ data.uptime.checks }} checks from GitHub Actions over 30 days<template v-if="data.uptime.last"> · last {{ timeAgo(new Date(data.uptime.last.at).toISOString(), now) }}</template>
						</span>
					</template>
					<span v-else class="ops-val ops-muted">No checks recorded yet</span>
				</dd>
			</div>

			<div class="ops-row">
				<dt class="readout">Lighthouse</dt>
				<dd>
					<template v-if="data.lighthouse">
						<span class="ops-val ops-scores">
							<span v-for="s in scores" :key="s.label"><b class="tabular-nums">{{ s.value }}</b> {{ s.label }}</span>
						</span>
						<span class="ops-sub">Mobile, home page, median of 3 daily runs on a GitHub Actions runner · {{ timeAgo(data.lighthouse.measuredAt, now) }}</span>
					</template>
					<span v-else class="ops-val ops-muted">Not measured yet</span>
				</dd>
			</div>

			<div class="ops-row">
				<dt class="readout">Assistant</dt>
				<dd>
					<span class="ops-val">{{ data.assistant.model }}</span>
					<span v-if="data.assistant.today" class="ops-sub tabular-nums">
						{{ data.assistant.today.questions }} answered today · {{ usd(data.assistant.today.costUsd) }} spent<template v-if="data.assistant.today.questions"> · {{ usd(data.assistant.today.costUsd / data.assistant.today.questions) }} each</template>
					</span>
					<span class="ops-sub">Capped at {{ data.assistant.dailyCap }} answers a day</span>
				</dd>
			</div>

			<div class="ops-row">
				<dt class="readout">Delivery</dt>
				<dd>
					<template v-if="dora">
						<div class="ops-dora">
							<div v-for="m in doraTiles" :key="m.label" class="ops-tile">
								<b class="ops-hi tabular-nums">{{ m.value }}</b>
								<span class="ops-sub">{{ m.label }}</span>
							</div>
						</div>
						<span class="ops-note">
							DORA metrics from the {{ dora.deploys + dora.failed }} production deploys Vercel recorded on GitHub in the last {{ dora.windowDays }} days. Lead time runs from a commit landing on main to that deploy going live. A failure is a deploy that errored; restore is the time until the next good one.
						</span>
					</template>
					<span v-else class="ops-val ops-muted">{{ doraError ? 'Not available' : 'Loading…' }}</span>
				</dd>
			</div>
		</dl>

		<!-- Announces each re-run's result to screen readers -->
		<p class="sr-only" aria-live="polite">{{ liveText }}</p>

		<button v-if="data" type="button" class="readout ops-again" :disabled="loading" @click="load">
			{{ loading ? 'Requesting…' : 'Send the request again' }}
		</button>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { parseVercelId, regionName, timeAgo } from '~/utils/vercelRequest';

const data = ref(null);
const error = ref(false);
const loading = ref(false);
const now = ref(Date.now());
const request = ref({ cache: null, edge: null, region: null, age: null, ms: 0 });

const ciText = { success: 'Passed', failure: 'Failed', pending: 'Running' };

// Plain fetch, not $fetch: the panel needs the response headers
async function load() {
	loading.value = true;
	const t0 = performance.now();
	try {
		const res = await fetch('/api/ops', { cache: 'no-store' });
		if (!res.ok) throw new Error(String(res.status));
		const ms = Math.round(performance.now() - t0);
		const { edge, region } = parseVercelId(res.headers.get('x-vercel-id'));
		const age = res.headers.get('age');
		request.value = {
			cache: res.headers.get('x-vercel-cache'),
			edge,
			region,
			age: age === null ? null : Number(age),
			ms,
		};
		data.value = await res.json();
		now.value = Date.now();
		error.value = false;
	} catch {
		if (!data.value) error.value = true;
	} finally {
		loading.value = false;
	}
}

const dora = ref(null);
const doraError = ref(false);

onMounted(() => {
	load();
	$fetch('/api/ops/dora')
		.then((d) => (dora.value = d))
		.catch(() => (doraError.value = true));
});

// "42 min", "3.5 h", "2.1 days"
function duration(min) {
	if (min === null || min === undefined) return '–';
	if (min < 60) return `${min} min`;
	if (min < 60 * 48) return `${Math.round((min / 60) * 10) / 10} h`;
	return `${Math.round((min / 1440) * 10) / 10} days`;
}

const doraTiles = computed(() => {
	const d = dora.value;
	if (!d) return [];
	return [
		{ label: 'deploys a week', value: d.perWeek },
		{ label: 'merge to live (median)', value: duration(d.leadTimeMinutes) },
		{ label: 'deploys failed', value: d.changeFailurePct === null ? '–' : `${d.changeFailurePct}%` },
		{ label: 'time to restore (median)', value: d.failed ? duration(d.restoreMinutes) : 'none needed' },
	];
});

// Bars scale to the slowest day in view, with a floor so fast days still show
const barHeight = (ms) => {
	const max = Math.max(...(data.value?.uptime?.days ?? []).map((d) => d.medianMs ?? 0), 1);
	return Math.max(12, Math.round((ms / max) * 100));
};

const uptimeLabel = computed(() => {
	const u = data.value?.uptime;
	if (!u) return '';
	const down = u.days.filter((d) => d.checks && d.up < d.checks).length;
	return `Response time by day for 30 days. ${down ? `${down} day${down === 1 ? '' : 's'} had failed checks.` : 'No failed checks.'}`;
});

const cacheNote = computed(() => {
	switch (request.value.cache) {
		case 'HIT':
			return 'Answered from the edge cache; no function ran.';
		case 'STALE':
			return 'Served a cached copy while the edge refreshes it in the background.';
		case 'MISS':
			return 'Not cached yet, so a function built it. The next request within a minute is a HIT.';
		case 'PRERENDER':
			return 'Served the copy built at deploy time.';
		default:
			return 'On Vercel this route is cached at the edge for 60 seconds.';
	}
});

const liveText = computed(() =>
	data.value ? `Request ${request.value.cache ? `answered with cache ${request.value.cache}` : 'answered'} in ${request.value.ms} milliseconds` : ''
);

const scores = computed(() => {
	const s = data.value?.lighthouse?.scores;
	return s
		? [
				{ label: 'Perf', value: s.performance },
				{ label: 'A11y', value: s.accessibility },
				{ label: 'Best practices', value: s.bestPractices },
				{ label: 'SEO', value: s.seo },
			]
		: [];
});

// Sub-cent amounts need more than two decimals to mean anything
const usd = (n) => (n >= 1 ? `$${n.toFixed(2)}` : `$${n.toFixed(4)}`);
</script>

<style scoped>
.ops {
	display: flex;
	flex-direction: column;
	min-height: inherit;
	justify-content: center;
	padding: 3.5rem 1.5rem 1.5rem;
}

.ops-cmd {
	text-transform: none;
	letter-spacing: 0.06em;
	color: var(--text);
	padding-bottom: 0.9rem;
	border-bottom: 1px solid var(--border);
}

.ops-wait {
	padding: 1.5rem 0;
}

.ops-row {
	display: grid;
	grid-template-columns: 6.5rem 1fr;
	gap: 0.75rem;
	padding: 0.8rem 0;
	border-bottom: 1px solid var(--border);
}

.ops-row dt {
	padding-top: 0.15rem;
}

.ops-row dd {
	display: flex;
	flex-direction: column;
	gap: 0.2rem;
	min-width: 0;
}

.ops-val {
	display: inline-flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 0.5rem;
	font-family: 'Geist Mono', monospace;
	font-size: 12.5px;
	line-height: 1.5;
	color: var(--text);
}

.ops-muted {
	color: var(--text-muted);
}

.ops-sub,
.ops-sub-inline,
.ops-note {
	font-family: 'Geist Mono', monospace;
	font-size: 11px;
	line-height: 1.5;
	color: var(--text-muted);
}

.ops-note {
	color: #8b9096;
	overflow-wrap: anywhere;
}

.ops-scores {
	gap: 0.35rem 0.9rem;
}

.ops-scores b {
	font-weight: 600;
	color: var(--accent);
}

.ops-dot {
	width: 6px;
	height: 6px;
	background: var(--text-muted);
}

.ops-dot.is-success {
	background: #3ddc84;
}

.ops-dot.is-failure {
	background: #ef4444;
}

.ops-dot.is-pending {
	background: #f59e0b;
}

.ops-again {
	align-self: flex-start;
	margin-top: 1.1rem;
	min-height: 44px;
	padding: 0 0.9rem;
	border: 1px solid var(--border);
	color: var(--text);
	cursor: pointer;
}

.ops-again:hover:not(:disabled) {
	border-color: var(--accent);
}

.ops-again:disabled {
	color: var(--text-muted);
	cursor: default;
}

.ops-hi {
	font-weight: 600;
	color: var(--accent);
}

.ops-bars {
	display: flex;
	align-items: flex-end;
	gap: 2px;
	height: 32px;
	margin: 0.3rem 0 0.1rem;
	max-width: 22rem;
}

.ops-bar {
	flex: 1;
	min-width: 0;
	height: 12%;
	background: color-mix(in srgb, var(--accent) 70%, transparent);
}

.ops-bar.is-empty {
	background: var(--border);
}

.ops-bar.is-down {
	background: #ef4444;
}

.ops-dora {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 0.6rem 1rem;
	margin-bottom: 0.3rem;
}

.ops-tile {
	display: flex;
	flex-direction: column;
	font-family: 'Geist Mono', monospace;
	font-size: 12.5px;
}

@media (max-width: 479px) {
	.ops {
		padding: 3.25rem 1rem 1rem;
	}

	.ops-row {
		grid-template-columns: 1fr;
		gap: 0.3rem;
	}
}
</style>
