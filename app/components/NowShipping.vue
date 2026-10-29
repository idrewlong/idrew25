<template>
	<section id="shipping" ref="root" class="wrap">
		<div class="sec-rule js-reveal">
			<span class="readout text-[var(--accent)]">08</span>
			<span class="readout">Now shipping</span>
			<span class="readout ml-auto inline-flex items-center gap-2">
				<span class="ship-live" aria-hidden="true"></span>
				Live from GitHub
			</span>
		</div>
		<div class="ship-head">
			<h2 class="display sec-word js-reveal">Shipping<span class="sr-only">: recent GitHub activity</span></h2>

			<!-- Live GitHub panel: contribution grid, totals, recently pushed repos -->
			<div v-if="pulse?.days?.length" class="ship-pulse">
				<dl class="pulse-stats">
					<div v-for="s in stats" :key="s.label">
						<dt class="readout">{{ s.label }}</dt>
						<dd class="display pulse-num tabular-nums">{{ s.value.toLocaleString('en-US') }}</dd>
					</div>
				</dl>

				<div
					class="pulse-grid"
					role="img"
					:aria-label="`GitHub contributions, last ${weeks} weeks: ${pulse.days.reduce((n, d) => n + d.count, 0).toLocaleString('en-US')} in total`"
				>
					<span
						v-for="d in pulse.days"
						:key="d.date"
						class="pulse-day"
						:data-level="d.level"
						:title="`${d.count} on ${d.date}`"
					></span>
				</div>
				<p class="readout pulse-legend">
					<span>{{ weeks }} weeks · contributions per day</span>
					<a href="https://github.com/idrewlong" target="_blank" rel="noopener noreferrer">github.com/idrewlong ↗</a>
				</p>

				<p v-if="pulse.repos.length" class="readout pulse-repos">
					<span>Recently pushed</span>
					<a
						v-for="r in pulse.repos"
						:key="r.name"
						:href="`https://github.com/${r.name}`"
						target="_blank"
						rel="noopener noreferrer"
						class="pulse-repo"
					>{{ r.name.split('/')[1] }}</a>
				</p>
			</div>
		</div>

		<div class="ship-term js-reveal">
			<p class="readout ship-cmd">
				<span class="text-[var(--accent)]">$</span> git log --author=idrewlong --public
			</p>

			<ol v-if="entries?.length" class="ship-list">
				<li v-for="e in entries" :key="e.repo + e.sha">
					<a :href="e.url" target="_blank" rel="noopener noreferrer" class="ship-row">
						<span class="readout ship-time">
							<time :datetime="e.at">{{ ago(e.at) }}</time>
						</span>
						<span class="readout ship-sha">{{ e.sha.slice(0, 7) }}</span>
						<span class="readout ship-repo">{{ e.repo.split('/')[1] }}</span>
						<span class="ship-msg">{{ e.message || 'Pushed to ' + (e.branch || 'main') }}</span>
						<span class="ship-arrow" aria-hidden="true">↗</span>
					</a>
				</li>
			</ol>

			<p v-else-if="error" class="ship-empty readout">Feed unavailable right now. Everything lives on <a href="https://github.com/idrewlong" target="_blank" rel="noopener noreferrer" class="underline">GitHub</a>.</p>

			<ol v-else class="ship-list" aria-hidden="true">
				<li v-for="n in 4" :key="n" class="ship-row ship-skeleton"><span></span></li>
			</ol>
		</div>
	</section>
</template>

<script setup>
import { ref, computed } from 'vue';

const root = ref(null);
useReveal(root);

// Client-side, after paint: never blocks the page render
const { data: entries, error } = useFetch('/api/github-activity', { server: false, lazy: true });
const { data: pulse } = useFetch('/api/github-pulse', { server: false, lazy: true });

const weeks = computed(() => Math.ceil((pulse.value?.days.length ?? 0) / 7));
const stats = computed(() => [
	{ label: 'This week', value: pulse.value?.totals.week ?? 0 },
	{ label: 'Last 30 days', value: pulse.value?.totals.month ?? 0 },
	{ label: 'Past year', value: pulse.value?.totals.year ?? 0 },
]);

const UNITS = [
	['year', 31536000],
	['month', 2592000],
	['day', 86400],
	['hour', 3600],
	['minute', 60],
];
const fmt = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
function ago(iso) {
	const secs = (new Date(iso).getTime() - Date.now()) / 1000;
	for (const [unit, size] of UNITS) {
		if (Math.abs(secs) >= size) return fmt.format(Math.round(secs / size), unit);
	}
	return 'just now';
}
</script>

<style scoped>
/* Heading and the GitHub panel share a row on desktop; the panel fills
   the space the giant word leaves on the right */
.ship-head {
	display: grid;
	grid-template-columns: 1fr;
}

.ship-pulse {
	margin-bottom: 2.5rem;
	animation: pulse-in 0.6s ease both;
}

@keyframes pulse-in {
	from {
		opacity: 0;
	}
}

@media (min-width: 1100px) {
	.ship-head {
		grid-template-columns: auto minmax(0, 1fr);
		align-items: end;
		gap: 4rem;
	}

	.ship-pulse {
		margin-bottom: 3.5rem;
	}
}

.pulse-stats {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	border-top: 1px solid var(--border);
}

.pulse-stats > div {
	padding: 0.75rem 0;
}

.pulse-stats > div + div {
	padding-left: 1rem;
	border-left: 1px solid var(--border);
}

.pulse-num {
	margin-top: 0.35rem;
	font-size: clamp(1.75rem, 3vw, 2.5rem);
	line-height: 1;
	color: var(--text);
}

/* 7 rows (Sun–Sat), one column per week, filled down then across */
.pulse-grid {
	display: grid;
	grid-template-rows: repeat(7, auto);
	grid-auto-flow: column;
	grid-auto-columns: minmax(0, 1fr);
	gap: 3px;
	margin-top: 1rem;
}

.pulse-day {
	aspect-ratio: 1;
	background: var(--bg-elevated);
}

.pulse-day[data-level='1'] { background: rgba(255, 91, 31, 0.3); }
.pulse-day[data-level='2'] { background: rgba(255, 91, 31, 0.5); }
.pulse-day[data-level='3'] { background: rgba(255, 91, 31, 0.75); }
.pulse-day[data-level='4'] { background: var(--accent); }

.pulse-legend,
.pulse-repos {
	display: flex;
	flex-wrap: wrap;
	gap: 0.4rem 1rem;
	margin-top: 0.75rem;
}

.pulse-legend a {
	margin-left: auto;
	color: var(--text);
	text-decoration: none;
}

.pulse-repos {
	padding-top: 0.75rem;
	border-top: 1px solid var(--border);
}

.pulse-repo {
	color: var(--text);
	text-decoration: none;
}

.pulse-legend a:hover,
.pulse-repo:hover {
	color: var(--accent);
}

/* Thumb-sized targets without changing how the rows look */
@media (pointer: coarse) {
	.pulse-legend,
	.pulse-repos {
		align-items: center;
		row-gap: 0;
	}

	.pulse-legend a,
	.pulse-repo {
		display: inline-flex;
		align-items: center;
		min-height: 44px;
	}
}

.ship-term {
	border: 1px solid var(--border);
	background: #050506;
}

.ship-cmd {
	padding: 0.9rem 1.25rem;
	border-bottom: 1px solid var(--border);
	color: var(--text);
	text-transform: none;
	letter-spacing: 0.08em;
}

.ship-live {
	width: 6px;
	height: 6px;
	background: #3ddc84;
	animation: ship-live 2s ease-in-out infinite;
}

@keyframes ship-live {
	50% {
		opacity: 0.25;
	}
}

.ship-row {
	display: grid;
	grid-template-columns: 6.5rem 1fr auto;
	grid-template-areas:
		'time sha arrow'
		'repo repo repo'
		'msg msg msg';
	align-items: baseline;
	gap: 0.35rem 1rem;
	padding: 1rem 1.25rem;
	border-bottom: 1px solid var(--border);
	text-decoration: none;
	transition: background 0.2s ease;
}

@media (min-width: 976px) {
	.ship-row {
		grid-template-columns: 8rem 5rem 12rem 1fr auto;
		grid-template-areas: 'time sha repo msg arrow';
	}
}

li:last-child .ship-row {
	border-bottom: 0;
}

a.ship-row:hover {
	background: var(--bg-card);
}

.ship-time { grid-area: time; }
.ship-sha { grid-area: sha; color: var(--accent); }
.ship-repo { grid-area: repo; color: var(--text); }
.ship-arrow { grid-area: arrow; color: var(--text-muted); }

.ship-msg {
	grid-area: msg;
	min-width: 0;
	font-family: 'Geist Mono', monospace;
	font-size: 13px;
	line-height: 1.5;
	color: #c9cdd2;
	/* Phones: up to two lines; one line with an ellipsis on wide screens */
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
}

@media (min-width: 976px) {
	.ship-msg {
		display: block;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}

a.ship-row:hover .ship-arrow {
	color: var(--accent);
}

.ship-empty {
	padding: 1.25rem;
	text-transform: none;
	letter-spacing: 0.06em;
}

.ship-skeleton {
	display: block;
	height: 3.25rem;
}

.ship-skeleton span {
	display: block;
	width: 60%;
	height: 10px;
	background: var(--bg-elevated);
}

@media (prefers-reduced-motion: reduce) {
	.ship-live,
	.ship-pulse {
		animation: none;
	}
}
</style>
