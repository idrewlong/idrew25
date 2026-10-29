<template>
	<header ref="root" class="wrap ph">
		<NuxtLink v-if="back" to="/" class="readout ph-back">← Home</NuxtLink>
		<p class="readout ph-kicker">
			<span class="text-[var(--text)]">{{ index }}</span> · {{ kicker }}
		</p>

		<div class="ph-grid" :class="{ 'ph-grid--stack': stack }">
			<div class="ph-title-box">
				<h1 class="display ph-title" :aria-label="title.join(' ')" :style="{ '--ph-chars': longest }">
					<span v-for="(line, i) in title" :key="line" class="ph-line" aria-hidden="true">
						<span class="ph-word" :class="{ outline: i % 2 === 1 }">{{ line }}</span>
					</span>
				</h1>
			</div>

			<div class="ph-intro">
				<p v-if="lede" class="ph-lede">{{ lede }}</p>
				<slot />
			</div>
		</div>
	</header>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { onPageLeft } from '~/composables/usePageLeave';

/**
 * Shared header for inner pages: back link, index kicker, a giant two-tone
 * title (solid, then outline) and an intro column. Opens with the title
 * rising out of line masks; reduced motion just shows it.
 */
const props = defineProps({
	index: { type: String, required: true }, // e.g. "[ 00 / 01 ]"
	kicker: { type: String, required: true },
	title: { type: Array, required: true }, // lines, alternating solid / outline
	lede: { type: String, default: '' },
	back: { type: Boolean, default: true },
});

// Lines wrap at spaces, so the longest word is what has to fit its column
const longest = computed(() => Math.max(...props.title.flatMap((line) => line.split(' ')).map((word) => word.length)));
// Long words ("something") would shrink beside the intro, so they get the full width
const stack = computed(() => longest.value > 7);

const root = ref(null);
const { $gsap } = useNuxtApp();
let mm;

onMounted(() => {
	mm = $gsap.matchMedia(root.value);
	mm.add('(prefers-reduced-motion: reduce)', () => {
		$gsap.set('.ph-word, .ph-back, .ph-kicker, .ph-intro > *', { autoAlpha: 1 });
	});
	mm.add('(prefers-reduced-motion: no-preference)', () => {
		$gsap
			.timeline({ defaults: { ease: 'expo.out' } })
			.fromTo('.ph-word', { yPercent: 110, autoAlpha: 1 }, { yPercent: 0, duration: 1.1, stagger: 0.08 })
			.fromTo('.ph-back, .ph-kicker', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.05 }, 0.1)
			.fromTo('.ph-intro > *', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08 }, 0.35);
	});
});

onPageLeft(() => mm?.revert());
</script>

<style scoped>
.ph {
	padding-top: 2.5rem;
	padding-bottom: 4rem;
	border-bottom: 1px solid var(--border);
	margin-bottom: 5rem;
}

/* Everything the open animation reveals starts hidden, so nothing flashes.
   :deep reaches slotted content like StatTiles. */
.ph-back,
.ph-kicker,
.ph-intro > :deep(*) {
	visibility: hidden;
}

.ph-back {
	display: inline-flex;
	align-items: center;
	min-height: 44px;
	text-decoration: none;
}

.ph-back:hover {
	color: var(--accent);
}

.ph-kicker {
	margin-top: 2rem;
	padding-left: 0.75rem;
	border-left: 1px solid var(--text);
}

.ph-grid {
	display: grid;
	grid-template-columns: 1fr;
	gap: 2.5rem;
	margin-top: 1rem;
}

@media (min-width: 976px) {
	.ph-grid {
		grid-template-columns: minmax(0, 1fr) 34rem;
		align-items: end;
	}

	.ph-grid--stack .ph-title-box {
		grid-column: 1 / -1;
	}

	.ph-grid--stack .ph-intro {
		grid-column: 2;
	}
}

.ph-title-box {
	container-type: inline-size;
	min-width: 0;
}

/* Capped so the longest word fits the column: display caps run up to about
   0.55em per character (W, M), so 100cqi / (chars × 0.58) always fits */
.ph-title {
	font-size: min(clamp(5.5rem, 22vw, 17rem), calc(100cqi / (var(--ph-chars, 6) * 0.58)));
	line-height: 0.82;
}

/* Masks for the open animation */
.ph-line {
	display: block;
	overflow: hidden;
	padding-bottom: 0.04em;
}

.ph-word {
	display: inline-block;
	/* Revealed by the open animation, so it never flashes in first */
	visibility: hidden;
}

.ph-lede {
	font-size: 1.125rem;
	line-height: 1.6;
	color: var(--text);
}
</style>
