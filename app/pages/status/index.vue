<template>
	<div class="status">
		<PageHeader
			index="[ 00 / 01 ]"
			kicker="Status"
			:title="['Site', 'status']"
			lede="Is idrewlong.com up, and how fast is it? A GitHub Action checks the home page from outside Vercel every 15 minutes. These are its results, not a claim."
		>
			<!-- One wrapper from first render: the header's intro animation only
			     reveals elements that exist when it runs -->
			<div>
				<div class="st-now" :class="`is-${data?.state ?? 'loading'}`" role="status">
					<span class="st-dot" aria-hidden="true"></span>
					<span>{{ stateText }}</span>
				</div>
				<p v-if="lastCheck" class="readout st-last">Last check {{ lastCheck }}</p>
			</div>
		</PageHeader>

		<section class="wrap" aria-labelledby="uptime-title">
			<div class="sec-rule">
				<span class="readout text-[var(--accent)]">[ 01 / 03 ]</span>
				<span class="readout">Uptime</span>
				<span class="readout ml-auto">Share of checks answered with a 2xx or 3xx</span>
			</div>
			<h2 id="uptime-title" class="sr-only">Uptime</h2>

			<p v-if="error" class="readout st-msg">Status data is unavailable right now.</p>
			<template v-else-if="data">
				<dl class="st-windows">
					<div v-for="w in data.windows" :key="w.label" class="st-window">
						<dt class="readout">{{ w.label }}</dt>
						<dd class="st-pct tabular-nums">{{ w.pct === null ? '–' : `${w.pct}%` }}</dd>
					</div>
				</dl>

				<figure class="st-chart">
					<figcaption class="readout st-cap">
						<span>Last 90 days, one bar per day (UTC)</span>
						<span class="st-key">
							<span><i class="st-swatch"></i> all up</span>
							<span><i class="st-swatch is-down"></i> failed checks</span>
							<span><i class="st-swatch is-empty"></i> no data</span>
						</span>
					</figcaption>
					<div class="st-strip" role="img" :aria-label="stripLabel">
						<span
							v-for="d in data.history.days"
							:key="d.date"
							class="st-day"
							:class="{ 'is-empty': !d.checks, 'is-down': d.checks && d.up < d.checks }"
							:title="dayTitle(d)"
						></span>
					</div>
					<div class="readout st-axis" aria-hidden="true">
						<span>90 days ago</span>
						<span>Today</span>
					</div>
				</figure>

				<p v-if="data.since" class="readout st-msg">
					Monitoring since {{ formatDay(data.since) }}. Days before that show as no data.
				</p>
			</template>
			<p v-else class="readout st-msg">Loading checks…</p>
		</section>

		<section v-if="data" class="wrap st-sec" aria-labelledby="speed-title">
			<div class="sec-rule">
				<span class="readout text-[var(--accent)]">[ 02 / 03 ]</span>
				<span class="readout">Response time</span>
				<span class="readout ml-auto">Median per day, from GitHub's runners</span>
			</div>
			<h2 id="speed-title" class="sr-only">Response time</h2>

			<figure class="st-chart">
				<figcaption class="readout st-cap">
					<span>Median {{ data.history.medianMs ?? '–' }} ms over 90 days · tallest bar {{ maxMs }} ms</span>
				</figcaption>
				<div class="st-bars" role="img" :aria-label="speedLabel">
					<span
						v-for="d in data.history.days"
						:key="d.date"
						class="st-bar"
						:class="{ 'is-empty': !d.medianMs }"
						:style="{ height: d.medianMs ? `${Math.max(4, Math.round((d.medianMs / maxMs) * 100))}%` : undefined }"
						:title="d.medianMs ? `${d.date}: median ${d.medianMs} ms` : `${d.date}: no data`"
					></span>
				</div>
			</figure>

			<div v-if="data.lighthouse" class="st-lh">
				<p class="readout">Lighthouse, mobile</p>
				<p class="st-lh-scores">
					<span v-for="s in scores" :key="s.label"><b class="tabular-nums">{{ s.value }}</b> {{ s.label }}</span>
				</p>
				<p class="readout">Median of 3 runs on a GitHub Actions runner, {{ formatDay(Date.parse(data.lighthouse.measuredAt)) }}</p>
			</div>
		</section>

		<section v-if="data" class="wrap st-sec" aria-labelledby="incidents-title">
			<div class="sec-rule">
				<span class="readout text-[var(--accent)]">[ 03 / 03 ]</span>
				<span class="readout">Outages</span>
				<span class="readout ml-auto">Failed checks in a row</span>
			</div>
			<h2 id="incidents-title" class="sr-only">Outages</h2>

			<ol v-if="data.outages.length" class="st-outages">
				<li v-for="o in data.outages" :key="o.start" class="st-outage">
					<span class="readout">{{ formatTime(o.start) }}</span>
					<span>
						{{ o.end ? `Down for ${duration(o.end - o.start)}` : 'Ongoing' }} ·
						{{ o.checks }} failed check{{ o.checks === 1 ? '' : 's' }} ·
						first response {{ o.status === 0 ? 'no answer' : `HTTP ${o.status}` }}
					</span>
				</li>
			</ol>
			<p v-else class="st-msg">No failed checks on record.</p>

			<p class="st-note">
				A failed check is a non-2xx/3xx answer or no answer within 30 seconds. If the whole site is unreachable,
				the check can't report in either, so a full outage shows as missing checks rather than failures, and the
				Action run itself fails. GitHub can start scheduled runs late or skip them, so the number of checks per
				day varies. The workflow is
				<a :href="workflowUrl" target="_blank" rel="noopener noreferrer">ops-monitor.yml on GitHub ↗</a>, and
				<NuxtLink to="/teardown">the teardown</NuxtLink> shows the rest of the ops panel.
			</p>
		</section>
	</div>
</template>

<script setup>
import { computed } from 'vue';
import { timeAgo } from '~/utils/vercelRequest';


// Client-side, so the page reads the edge-cached endpoint instead of the
// database on every render
const { data, error } = useFetch('/api/status', { server: false, lazy: true });

const workflowUrl = 'https://github.com/idrewlong/idrew25/blob/main/.github/workflows/ops-monitor.yml';

const stateText = computed(() => {
	switch (data.value?.state) {
		case 'up':
			return 'Up and answering';
		case 'down':
			return 'Down: the last check failed';
		case 'unknown':
			return 'No recent checks';
		default:
			return error.value ? 'Unavailable' : 'Checking…';
	}
});

const lastCheck = computed(() => {
	const last = data.value?.history?.last;
	return last ? `${timeAgo(new Date(last.at).toISOString(), Date.now())} · ${last.ms} ms` : '';
});

const maxMs = computed(() => Math.max(1, ...(data.value?.history.days ?? []).map((d) => d.medianMs ?? 0)));

const stripLabel = computed(() => {
	const days = data.value?.history.days ?? [];
	const down = days.filter((d) => d.checks && d.up < d.checks).length;
	const empty = days.filter((d) => !d.checks).length;
	return `Uptime by day for 90 days: ${down} day${down === 1 ? '' : 's'} with failed checks, ${empty} with no data.`;
});

const speedLabel = computed(() => `Median response time by day for 90 days. Overall median ${data.value?.history.medianMs ?? 'unknown'} milliseconds.`);

const scores = computed(() => {
	const s = data.value?.lighthouse?.scores;
	return s
		? [
				{ label: 'Performance', value: s.performance },
				{ label: 'Accessibility', value: s.accessibility },
				{ label: 'Best practices', value: s.bestPractices },
				{ label: 'SEO', value: s.seo },
			]
		: [];
});

const dayTitle = (d) => (d.checks ? `${d.date}: ${d.up} of ${d.checks} checks up` : `${d.date}: no data`);

const formatDay = (ms) => new Date(ms).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const formatTime = (ms) =>
	new Date(ms).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' });

function duration(ms) {
	const min = Math.round(ms / 60_000);
	if (min < 1) return 'under a minute';
	if (min < 60) return `${min} min`;
	const h = Math.floor(min / 60);
	return `${h} h ${min % 60} min`;
}

useSeoMeta({
	title: 'Status',
	description: 'Live uptime and response time for idrewlong.com, checked every 15 minutes from GitHub Actions, with 90 days of history.',
	ogTitle: 'Site status | Andrew Long',
	ogDescription: 'Live uptime and response time for idrewlong.com, checked every 15 minutes from GitHub Actions, with 90 days of history.',
});
</script>

<style scoped>
.status {
	padding-bottom: 6rem;
}

.st-now {
	display: inline-flex;
	align-items: center;
	gap: 0.6rem;
	padding: 0.7rem 1rem;
	border: 1px solid var(--border);
	font-family: 'Geist Mono', monospace;
	font-size: 14px;
	color: var(--text);
}

.st-dot {
	width: 8px;
	height: 8px;
	background: var(--text-muted);
}

.st-now.is-up .st-dot {
	background: #3ddc84;
	box-shadow: 0 0 10px #3ddc84;
}

.st-now.is-down .st-dot {
	background: #ef4444;
}

.st-now.is-unknown .st-dot {
	background: #f59e0b;
}

.st-last {
	margin-top: 0.75rem;
}

.st-sec {
	margin-top: 5rem;
}

.st-msg {
	margin-top: 1.25rem;
	color: var(--text-muted);
}

.st-windows {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 1px;
	margin-top: 1.5rem;
	background: var(--border);
	border: 1px solid var(--border);
}

@media (min-width: 768px) {
	.st-windows {
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}
}

.st-window {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	padding: 1.1rem 1rem;
	background: var(--bg, #0a0b0c);
}

.st-pct {
	font-family: 'Geist Mono', monospace;
	font-size: clamp(1.5rem, 4vw, 2.25rem);
	color: var(--accent);
}

.st-chart {
	margin-top: 1.5rem;
	padding: 1rem;
	border: 1px solid var(--border);
}

.st-cap {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	gap: 0.5rem 1rem;
	margin-bottom: 0.9rem;
}

.st-key {
	display: inline-flex;
	flex-wrap: wrap;
	gap: 0.4rem 1rem;
}

.st-key span {
	display: inline-flex;
	align-items: center;
	gap: 0.4rem;
}

.st-swatch {
	display: inline-block;
	width: 8px;
	height: 8px;
	background: #3ddc84;
}

.st-strip {
	display: flex;
	gap: 2px;
	height: 40px;
}

.st-day {
	flex: 1;
	min-width: 0;
	background: #3ddc84;
}

.st-day.is-down,
.st-swatch.is-down {
	background: #ef4444;
}

.st-day.is-empty,
.st-swatch.is-empty {
	background: var(--border);
}

.st-axis {
	display: flex;
	justify-content: space-between;
	margin-top: 0.5rem;
}

.st-bars {
	display: flex;
	align-items: flex-end;
	gap: 2px;
	height: 120px;
}

.st-bar {
	flex: 1;
	min-width: 0;
	background: color-mix(in srgb, var(--accent) 75%, transparent);
}

.st-bar.is-empty {
	height: 2px;
	background: var(--border);
}

.st-lh {
	display: flex;
	flex-direction: column;
	gap: 0.6rem;
	margin-top: 2rem;
	padding-top: 1.25rem;
	border-top: 1px solid var(--border);
}

.st-lh-scores {
	display: flex;
	flex-wrap: wrap;
	gap: 0.4rem 1.4rem;
	font-family: 'Geist Mono', monospace;
	font-size: 14px;
	color: var(--text);
}

.st-lh-scores b {
	font-weight: 600;
	color: var(--accent);
}

.st-outages {
	margin-top: 1.5rem;
	border-top: 1px solid var(--border);
}

.st-outage {
	display: grid;
	grid-template-columns: 1fr;
	gap: 0.3rem;
	padding: 0.9rem 0;
	border-bottom: 1px solid var(--border);
	font-family: 'Geist Mono', monospace;
	font-size: 13px;
	color: var(--text);
}

@media (min-width: 768px) {
	.st-outage {
		grid-template-columns: 16rem 1fr;
	}
}

.st-note {
	max-width: 68ch;
	margin-top: 2rem;
	font-size: 0.9375rem;
	line-height: 1.6;
	color: var(--text-muted);
}

.st-note a {
	color: var(--text);
	text-decoration: underline;
	text-underline-offset: 3px;
}
</style>
