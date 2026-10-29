<template>
	<div class="sats">
		<table v-if="rows.length" class="sats-table">
			<caption class="sr-only">Live satellite positions, updated every second</caption>
			<thead>
				<tr>
					<th scope="col" class="readout">Object</th>
					<th scope="col" class="readout">Lat</th>
					<th scope="col" class="readout">Lon</th>
					<th scope="col" class="readout">Alt</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="r in rows" :key="r.label">
					<th scope="row" class="sats-name">{{ r.label }}</th>
					<td class="tabular-nums">{{ fmt(r.lat, 'N', 'S') }}</td>
					<td class="tabular-nums">{{ fmt(r.lon, 'E', 'W') }}</td>
					<td class="tabular-nums">{{ Math.round(r.altKm) }} km</td>
				</tr>
			</tbody>
		</table>
		<p v-else class="readout sats-wait">{{ error ? 'CelesTrak data unavailable right now.' : 'Fetching orbital elements…' }}</p>
		<p class="readout sats-foot">SGP4 · elements from CelesTrak · {{ swarm }} Starlink in the swarm</p>
	</div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const rows = ref([]);
const error = ref(false);
const swarm = ref(0);
let timer;
let disposed = false;

const fmt = (v, pos, neg) => `${Math.abs(v).toFixed(2)}°${v >= 0 ? pos : neg}`;

onMounted(async () => {
	try {
		const [data, { satellitePosition }] = await Promise.all([$fetch('/api/satellites'), import('~/scenes/orbits')]);
		// Left the page while the data was loading: don't start the clock
		if (disposed) return;
		swarm.value = data.swarm.length;
		const tick = () => {
			const now = new Date();
			rows.value = data.featured.flatMap((f) => {
				const p = satellitePosition(f, now);
				return p ? [{ label: f.label, ...p }] : [];
			});
		};
		tick();
		timer = setInterval(tick, 1000);
	} catch {
		error.value = true;
	}
});

onBeforeUnmount(() => {
	disposed = true;
	clearInterval(timer);
});
</script>

<style scoped>
.sats {
	position: absolute;
	inset: 0;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 3.5rem 1.5rem 1.5rem;
}

.sats-table {
	width: 100%;
	border-collapse: collapse;
	font-family: 'Geist Mono', monospace;
	font-size: 13px;
}

.sats-table th,
.sats-table td {
	padding: 0.9rem 0.5rem;
	border-bottom: 1px solid var(--border);
	text-align: left;
	color: #c9cdd2;
}

.sats-table thead th {
	padding-top: 0;
}

.sats-name {
	color: var(--accent) !important;
	font-weight: 500;
}

.sats-wait {
	text-align: center;
}

.sats-foot {
	margin-top: 1.25rem;
}
</style>
