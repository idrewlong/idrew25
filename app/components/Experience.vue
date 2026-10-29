<template>
	<section id="experience" ref="root" class="wrap">
		<div class="sec-rule js-reveal">
			<span class="readout text-[var(--accent)]">03</span>
			<span class="readout">Service record</span>
			<span class="readout ml-auto">{{ experiences.length }} roles · since {{ firstYear }}</span>
		</div>
		<h2 class="display sec-word js-reveal">Experience<span class="sr-only">: roles and responsibilities</span></h2>

		<!-- Desktop: role index + detail panel (WAI-ARIA tabs, vertical) -->
		<div class="xp js-reveal">
			<div
				role="tablist"
				aria-orientation="vertical"
				aria-label="Roles"
				class="xp-list"
				@keydown="onKeydown"
			>
				<button
					v-for="(exp, i) in experiences"
					:id="`xp-tab-${i}`"
					:key="exp.title + exp.company"
					:ref="(el) => (tabEls[i] = el)"
					type="button"
					role="tab"
					class="xp-tab"
					:class="{ 'is-active': active === i }"
					:aria-selected="active === i"
					aria-controls="xp-panel"
					:tabindex="active === i ? 0 : -1"
					@click="select(i)"
				>
					<span class="readout xp-tab-period">{{ exp.period }}</span>
					<span class="display xp-tab-title">{{ exp.title }}</span>
					<span class="readout">{{ exp.company }}</span>
				</button>
			</div>

			<div
				id="xp-panel"
				ref="panelEl"
				role="tabpanel"
				class="xp-panel"
				:aria-labelledby="`xp-tab-${active}`"
				tabindex="0"
			>
				<ExperienceDetail :exp="experiences[active]" />
			</div>
		</div>

		<!-- Phones and tablets: accordion, newest role open -->
		<ol class="xp-accordion">
			<li v-for="(exp, i) in experiences" :key="exp.title + exp.company" class="xp-acc js-reveal">
				<h3>
					<button
						:id="`xp-acc-${i}`"
						type="button"
						class="xp-acc-head"
						:aria-expanded="open === i"
						:aria-controls="`xp-acc-panel-${i}`"
						@click="open = open === i ? -1 : i"
					>
						<span class="flex flex-col gap-1.5 text-left min-w-0">
							<span class="readout" :class="i === 0 ? '!text-[var(--accent)]' : ''">{{ exp.period }}</span>
							<span class="display xp-acc-title">{{ exp.title }}</span>
							<span class="readout">{{ exp.company }}</span>
						</span>
						<span class="xp-acc-icon" aria-hidden="true">{{ open === i ? '−' : '+' }}</span>
					</button>
				</h3>
				<div
					v-show="open === i"
					:id="`xp-acc-panel-${i}`"
					role="region"
					:aria-labelledby="`xp-acc-${i}`"
					class="xp-acc-panel"
				>
					<ExperienceDetail :exp="exp" :show-title="false" />
				</div>
			</li>
		</ol>
	</section>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import { experiences } from '~/utils/resume';

const { $gsap } = useNuxtApp();

const root = ref(null);
const panelEl = ref(null);
const tabEls = ref([]);
const active = ref(0);
const open = ref(0);
useReveal(root);


const firstYear = experiences[experiences.length - 1].period.match(/\d{4}/)[0];

function select(i) {
	if (i === active.value) return;
	active.value = i;
	// Small fade so the panel change reads as a switch, not a jump
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
	nextTick(() => {
		$gsap.fromTo(panelEl.value, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out', overwrite: true });
	});
}

// Arrow keys move between roles; Home/End jump to the ends
function onKeydown(e) {
	const last = experiences.length - 1;
	const next = { ArrowDown: active.value + 1, ArrowUp: active.value - 1, Home: 0, End: last }[e.key];
	if (next === undefined) return;
	e.preventDefault();
	const i = (next + experiences.length) % experiences.length;
	select(i);
	tabEls.value[i]?.focus();
}
</script>

<style scoped>
/* ── Desktop two-pane ── */
.xp {
	display: none;
}

@media (min-width: 976px) {
	.xp {
		display: grid;
		grid-template-columns: minmax(18rem, 26rem) 1fr;
		border-top: 1px solid var(--border);
	}

	.xp-accordion {
		display: none;
	}
}

.xp-list {
	display: flex;
	flex-direction: column;
	border-right: 1px solid var(--border);
}

.xp-tab {
	position: relative;
	display: flex;
	flex-direction: column;
	gap: 0.4rem;
	padding: 1.1rem 1.5rem 1.1rem 1.25rem;
	border-bottom: 1px solid var(--border);
	text-align: left;
	cursor: pointer;
	transition: background 0.2s ease;
}

.xp-tab:hover {
	background: var(--bg-card);
}

.xp-tab.is-active {
	background: var(--bg-card);
}

/* Signal bar on the selected role */
.xp-tab::before {
	content: '';
	position: absolute;
	left: 0;
	top: 0;
	bottom: 0;
	width: 2px;
	background: var(--accent);
	transform: scaleY(0);
	transition: transform 0.25s ease;
}

.xp-tab.is-active::before {
	transform: scaleY(1);
}

.xp-tab-title {
	font-size: 1.5rem;
	line-height: 1;
	color: var(--text-muted);
	transition: color 0.2s ease;
}

.xp-tab.is-active .xp-tab-title,
.xp-tab:hover .xp-tab-title {
	color: var(--text);
}

.xp-tab.is-active .xp-tab-period {
	color: var(--accent);
}

.xp-panel {
	padding: 2rem 0 2.5rem 3rem;
	min-width: 0;
}

/* ── Accordion (below 976px) ── */
.xp-accordion {
	border-top: 1px solid var(--border);
}

.xp-acc {
	border-bottom: 1px solid var(--border);
}

.xp-acc-head {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	width: 100%;
	min-height: 44px;
	padding: 1.25rem 0;
	cursor: pointer;
}

.xp-acc-title {
	font-size: 1.6rem;
	line-height: 1;
}

.xp-acc-icon {
	flex-shrink: 0;
	width: 2rem;
	height: 2rem;
	display: grid;
	place-items: center;
	border: 1px solid var(--border);
	font-family: 'Geist Mono', monospace;
	color: var(--text);
}

.xp-acc-head[aria-expanded='true'] .xp-acc-icon {
	border-color: var(--accent);
	color: var(--accent);
}

.xp-acc-panel {
	padding-bottom: 1.75rem;
}

@media (prefers-reduced-motion: reduce) {
	.xp-tab,
	.xp-tab::before,
	.xp-tab-title {
		transition: none;
	}
}
</style>
