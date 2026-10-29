<template>
	<div ref="root" class="scene" :data-cursor="kind === 'globe' ? 'drag' : undefined">
		<div ref="host" class="scene-host" :class="{ 'is-ready': ready }"></div>
		<p v-if="!supported" class="scene-fallback readout">WebGL isn't available in this browser.</p>

		<div v-if="kind === 'rocket'" class="scene-scrub">
			<label for="rocket-scrub" class="readout">Scrub</label>
			<input id="rocket-scrub" v-model.number="progress" type="range" min="0" max="1" step="0.001" />
			<span class="readout tabular-nums !text-[var(--text)]">{{ Math.round(progress * 100) }}%</span>
		</div>
		<p v-else class="scene-hint readout">Drag to rotate</p>
	</div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { onPageLeft } from '~/composables/usePageLeave';

/** Live copy of a site scene, centred for a demo panel. */
const props = defineProps({
	kind: { type: String, required: true }, // 'globe' | 'rocket'
});

const root = ref(null);
const host = ref(null);
const ready = ref(false);
const supported = ref(true);
const progress = ref(0.3);

let scene = null;
let io = null;
let disposed = false;

watch(progress, (p) => {
	if (scene) scene.progress = p;
});

async function mount() {
	try {
		const c = document.createElement('canvas');
		supported.value = Boolean(c.getContext('webgl2') || c.getContext('webgl'));
	} catch {
		supported.value = false;
	}
	if (!supported.value) return;

	const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	if (props.kind === 'globe') {
		const { GlobeScene } = await import('~/scenes/GlobeScene');
		if (disposed) return;
		scene = new GlobeScene(host.value, { centered: true });
		scene.reduceMotion = reduce;
		$fetch('/api/satellites')
			.then((d) => !disposed && scene?.setSatellites(d.featured, d.swarm))
			.catch(() => {});
	} else {
		const { RocketScene } = await import('~/scenes/RocketScene');
		if (disposed) return;
		scene = new RocketScene(host.value, { centered: true });
		scene.reduceMotion = reduce;
		scene.progress = progress.value;
	}
	ready.value = true;
	io = new IntersectionObserver(([e]) => (e.isIntersecting ? scene.start() : scene.stop()));
	io.observe(root.value);
}

onMounted(mount);

onPageLeft(() => {
	disposed = true;
	io?.disconnect();
	scene?.dispose();
	scene = null;
});
</script>

<style scoped>
.scene {
	position: absolute;
	inset: 0;
}

.scene-host {
	position: absolute;
	inset: 0;
	opacity: 0;
	transition: opacity 0.8s ease;
}

.scene-host.is-ready {
	opacity: 1;
}

.scene-fallback {
	position: absolute;
	inset: 0;
	display: grid;
	place-items: center;
}

.scene-scrub {
	position: absolute;
	left: 1rem;
	right: 1rem;
	bottom: 1rem;
	z-index: 5;
	display: flex;
	align-items: center;
	gap: 1rem;
	padding: 0.6rem 0.9rem;
	border: 1px solid var(--border);
	background: rgba(10, 11, 12, 0.85);
}

.scene-scrub input {
	flex: 1;
	min-height: 44px;
	accent-color: var(--accent);
}

.scene-hint {
	position: absolute;
	right: 1rem;
	bottom: 1rem;
	z-index: 5;
}

@media (prefers-reduced-motion: reduce) {
	.scene-host {
		transition: none;
	}
}
</style>
