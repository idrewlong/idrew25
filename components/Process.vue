<template>
	<section ref="sectionEl" class="max-w-6xl mx-auto px-4 sm:px-6">
		<!-- Section label -->
		<div ref="labelEl" class="flex items-center gap-3 mb-10">
			<span class="text-[10px] font-bold tracking-[0.25em] uppercase text-stone-400">
				Process
			</span>
			<div class="flex-1 h-px bg-stone-200"></div>
		</div>

		<!-- Pull quote -->
		<blockquote
			ref="quoteEl"
			class="text-lg sm:text-xl md:text-2xl font-mono italic text-stone-400 leading-relaxed mb-12 sm:mb-16 max-w-3xl"
		>
			"I don't follow a rigid process. I follow the problem and
			<span class="text-orange-500">let context shape the approach.</span>"
		</blockquote>

		<!-- Desktop: horizontal accordion -->
		<div ref="panelsEl" class="hidden md:flex gap-2 items-stretch">
			<div
				v-for="(card, i) in cards"
				:key="card.title"
				:ref="(el) => { if (el) panelEls[i] = el }"
				class="process-panel relative rounded-2xl border border-stone-200 overflow-hidden cursor-pointer"
				:class="activeIndex === i ? 'bg-white shadow-lg' : 'bg-stone-50 hover:bg-stone-100/80 shadow-sm'"
				@click="setActive(i)"
			>
				<!-- Collapsed state: vertical label -->
				<div
					:ref="(el) => { if (el) collapsedEls[i] = el }"
					class="flex flex-col items-center justify-center gap-3 py-8 px-3 h-full absolute inset-0"
				>
					<span class="font-mono text-[11px] tabular-nums text-stone-300">
						{{ String(i + 1).padStart(2, '0') }}
					</span>
					<span class="font-serif text-base lg:text-lg font-bold text-stone-500 writing-vertical whitespace-nowrap">
						{{ card.title }}
					</span>
				</div>

				<!-- Expanded state: full content -->
				<div
					:ref="(el) => { if (el) expandedEls[i] = el }"
					class="expanded-inner p-6 lg:p-8"
				>
					<!-- Top: index + title -->
					<span class="font-mono text-[11px] tabular-nums text-orange-400 block mb-2">
						{{ String(i + 1).padStart(2, '0') }}
					</span>
					<h3 class="font-serif text-2xl lg:text-3xl font-bold text-stone-900 leading-tight mb-5">
						{{ card.title }}
					</h3>

					<!-- Description -->
					<p class="text-sm text-stone-500 leading-relaxed mb-5 max-w-md">
						{{ card.description }}
					</p>

					<!-- Points -->
					<ul class="space-y-2.5">
						<li
							v-for="(point, j) in card.points"
							:key="j"
							class="process-point flex items-start gap-3"
						>
							<span class="w-1 h-1 rounded-full bg-orange-400 mt-2 shrink-0"></span>
							<span class="text-sm text-stone-600 leading-relaxed">{{ point }}</span>
						</li>
					</ul>
				</div>

				<!-- Decorative keyword: pinned to panel, not to expanded content -->
				<span
					class="process-keyword hidden lg:block font-serif italic text-[80px] xl:text-[96px] leading-none text-stone-100 select-none pointer-events-none absolute bottom-4 right-6"
					aria-hidden="true"
				>
					{{ card.keyword }}
				</span>
			</div>
		</div>

		<!-- Mobile: simple tab + content -->
		<div class="md:hidden">
			<!-- Tab bar -->
			<div ref="mobileTabsEl" class="flex gap-1 mb-6 overflow-x-auto pb-2 -mx-1 px-1">
				<button
					v-for="(card, i) in cards"
					:key="card.title"
					class="shrink-0 px-4 py-2.5 rounded-xl text-[11px] font-mono uppercase tracking-wider transition-all duration-300 border"
					:class="activeIndex === i
						? 'bg-white border-stone-200 text-orange-500 shadow-sm'
						: 'bg-transparent border-transparent text-stone-400 hover:text-stone-600'"
					@click="setActive(i)"
				>
					{{ String(i + 1).padStart(2, '0') }}
				</button>
			</div>

			<!-- Content panel -->
			<div
				ref="mobileContentEl"
				class="bg-white border border-stone-200 rounded-2xl p-5 relative overflow-hidden"
			>
				<div
					v-for="(card, i) in cards"
					:key="card.title"
					:ref="(el) => { if (el) mobilePanelEls[i] = el }"
					:class="activeIndex === i ? '' : 'absolute inset-0 p-5 opacity-0 pointer-events-none'"
				>
					<span class="font-mono text-[11px] tabular-nums text-orange-400 block mb-2">
						{{ String(i + 1).padStart(2, '0') }}
					</span>
					<h3 class="font-serif text-xl font-bold text-stone-900 leading-tight mb-4">
						{{ card.title }}
					</h3>
					<p class="text-sm text-stone-500 leading-relaxed mb-5">
						{{ card.description }}
					</p>
					<ul class="space-y-2.5">
						<li
							v-for="(point, j) in card.points"
							:key="j"
							class="flex items-start gap-3"
						>
							<span class="w-1 h-1 rounded-full bg-orange-400 mt-2 shrink-0"></span>
							<span class="text-sm text-stone-600 leading-relaxed">{{ point }}</span>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';

const { $gsap } = useNuxtApp();

const sectionEl = ref(null);
const labelEl = ref(null);
const quoteEl = ref(null);
const panelsEl = ref(null);
const panelEls = ref([]);
const collapsedEls = ref([]);
const expandedEls = ref([]);
const mobileTabsEl = ref(null);
const mobileContentEl = ref(null);
const mobilePanelEls = ref([]);
const activeIndex = ref(0);

const cards = [
	{
		title: 'Understand the problem first',
		keyword: 'Why',
		description:
			'Before writing a single line of code, I make sure I actually understand what needs to happen and why. Talk to the stakeholders, dig into the data, map out the edges.',
		points: [
			'Ask the questions nobody else is asking',
			'Identify constraints early. They shape the solution',
			'Separate what the client wants from what they need',
		],
	},
	{
		title: 'Research before building',
		keyword: 'How',
		description:
			'I\'m a researcher by nature. If I don\'t know something, I find the answer. I look at how others have solved similar problems, evaluate the tradeoffs, and pick the right tool.',
		points: [
			'Evaluate existing solutions before inventing one',
			'Prototype the risky parts first',
			'Let the tech serve the goal, not the other way around',
		],
	},
	{
		title: 'Build with intention',
		keyword: 'Build',
		description:
			'Every decision should be traceable to a reason. Architecture, stack choices, even naming. Intentionality compounds over time into systems that are easy to maintain and extend.',
		points: [
			'Write code that explains itself',
			'Optimize for the team, not just the task',
			'Ship incrementally. Small wins build momentum',
		],
	},
	{
		title: 'Think beyond the code',
		keyword: 'Think',
		description:
			'Understanding the business context changes everything. I translate technical complexity into clear direction and make sure the work connects to real outcomes.',
		points: [
			'Bridge the gap between technical and non-technical',
			'Use data to inform decisions, not just validate them',
			'Keep the end user in the room, even when they\'re not',
		],
	},
	{
		title: 'Iterate and refine',
		keyword: 'Ship',
		description:
			'Done is better than perfect, but done doesn\'t mean finished. Ship it, measure it, learn from it, and make it better. The best work comes from cycles, not sprints.',
		points: [
			'Get feedback early and often',
			'Measure what matters, not everything',
			'Treat every project as a foundation for the next',
		],
	},
];

const updateExpandedWidth = () => {
	if (!panelsEl.value) return;
	const totalPanels = cards.length;
	const collapsedWidth = 8;
	const containerWidth = panelsEl.value.offsetWidth;
	const gapTotal = (totalPanels - 1) * 8; // gap-2 = 0.5rem = 8px
	const expandedPx = (containerWidth - gapTotal) * (100 - collapsedWidth * (totalPanels - 1)) / 100;
	panelsEl.value.style.setProperty('--expanded-width', expandedPx + 'px');
};

let resizeObserver = null;

const initPanelStates = () => {
	// Set all expanded content hidden, all collapsed visible
	expandedEls.value.forEach((el, idx) => {
		if (!el) return;
		if (idx === activeIndex.value) {
			$gsap.set(el, { height: 'auto', opacity: 1 });
		} else {
			$gsap.set(el, { height: 0, opacity: 0, overflow: 'hidden' });
		}
	});
	collapsedEls.value.forEach((el, idx) => {
		if (!el) return;
		$gsap.set(el, { opacity: idx === activeIndex.value ? 0 : 1 });
	});
};

const setActive = (i) => {
	if (activeIndex.value === i) return;
	const prev = activeIndex.value;
	activeIndex.value = i;

	const dur = 0.5;
	const ease = 'power3.inOut';

	// Desktop: animate panel widths + content swap
	if (panelsEl.value) {
		const totalPanels = cards.length;
		const collapsedWidth = 8;
		const expandedWidth = 100 - collapsedWidth * (totalPanels - 1);

		// Animate widths
		panelEls.value.forEach((panel, idx) => {
			if (!panel) return;
			$gsap.to(panel, {
				width: (idx === i ? expandedWidth : collapsedWidth) + '%',
				duration: dur,
				ease,
			});
		});

		// Collapse old expanded content
		if (expandedEls.value[prev]) {
			$gsap.to(expandedEls.value[prev], {
				height: 0,
				opacity: 0,
				overflow: 'hidden',
				duration: dur * 0.6,
				ease: 'power2.in',
			});
		}
		// Show old collapsed label
		if (collapsedEls.value[prev]) {
			$gsap.to(collapsedEls.value[prev], {
				opacity: 1,
				duration: dur * 0.5,
				delay: dur * 0.3,
				ease: 'power2.out',
			});
		}

		// Hide new collapsed label
		if (collapsedEls.value[i]) {
			$gsap.to(collapsedEls.value[i], {
				opacity: 0,
				duration: dur * 0.3,
				ease: 'power2.in',
			});
		}
		// Expand new content
		if (expandedEls.value[i]) {
			$gsap.to(expandedEls.value[i], {
				height: 'auto',
				opacity: 1,
				overflow: 'visible',
				duration: dur,
				delay: dur * 0.2,
				ease: 'power3.out',
			});
		}

		// Stagger in the points
		const activePanel = panelEls.value[i];
		if (activePanel) {
			const points = activePanel.querySelectorAll('.process-point');
			$gsap.fromTo(
				points,
				{ opacity: 0, x: -8 },
				{
					opacity: 1,
					x: 0,
					duration: 0.35,
					stagger: 0.05,
					ease: 'power2.out',
					delay: dur * 0.5,
				}
			);

			const keyword = activePanel.querySelector('.process-keyword');
			if (keyword) {
				$gsap.fromTo(
					keyword,
					{ opacity: 0, scale: 0.9 },
					{ opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out', delay: dur * 0.4 }
				);
			}
		}
	}

	// Mobile: crossfade content
	if (mobilePanelEls.value[prev]) {
		$gsap.to(mobilePanelEls.value[prev], {
			opacity: 0,
			x: -20,
			duration: 0.25,
			ease: 'power2.in',
		});
	}
	if (mobilePanelEls.value[i]) {
		$gsap.fromTo(
			mobilePanelEls.value[i],
			{ opacity: 0, x: 20 },
			{ opacity: 1, x: 0, duration: 0.35, ease: 'power2.out', delay: 0.15 }
		);
	}
};

onMounted(() => {
	nextTick(() => {
		if (!sectionEl.value) return;

		// Set initial widths and content states for desktop panels
		const totalPanels = cards.length;
		const collapsedWidth = 8;
		const expandedWidth = 100 - collapsedWidth * (totalPanels - 1);

		panelEls.value.forEach((panel, i) => {
			if (!panel) return;
			panel.style.width = (i === 0 ? expandedWidth : collapsedWidth) + '%';
			panel.style.flexShrink = '0';
		});

		initPanelStates();
		updateExpandedWidth();

		// Watch for resize to recalculate expanded width
		resizeObserver = new ResizeObserver(() => updateExpandedWidth());
		resizeObserver.observe(panelsEl.value);

		// Measure the tallest expanded content, then lock the container height
		expandedEls.value.forEach((el) => {
			if (el) $gsap.set(el, { height: 'auto', opacity: 1 });
		});
		const maxHeight = Math.max(
			...panelEls.value.map((p) => p?.offsetHeight || 0)
		);
		panelsEl.value.style.height = maxHeight + 'px';
		// Reset back to initial states
		initPanelStates();

		// Entrance animation
		$gsap.set(labelEl.value, { opacity: 0, y: 20 });
		$gsap.set(quoteEl.value, { opacity: 0, y: 30 });

		const desktopPanels = panelEls.value.filter(Boolean);
		if (desktopPanels.length) {
			$gsap.set(desktopPanels, { opacity: 0, y: 20 });
		}

		if (mobileContentEl.value) {
			$gsap.set(mobileContentEl.value, { opacity: 0, y: 20 });
		}
		if (mobileTabsEl.value) {
			$gsap.set(mobileTabsEl.value, { opacity: 0, y: 12 });
		}

		const tl = $gsap.timeline({
			scrollTrigger: {
				trigger: sectionEl.value,
				start: 'top 80%',
				toggleActions: 'play none none none',
			},
		});

		tl.to(labelEl.value, {
			opacity: 1,
			y: 0,
			duration: 0.5,
			ease: 'power2.out',
		})
			.to(
				quoteEl.value,
				{ opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' },
				'-=0.3'
			)
			.to(
				desktopPanels,
				{
					opacity: 1,
					y: 0,
					duration: 0.5,
					stagger: 0.07,
					ease: 'power2.out',
				},
				'-=0.4'
			)
			.to(
				[mobileTabsEl.value, mobileContentEl.value].filter(Boolean),
				{
					opacity: 1,
					y: 0,
					duration: 0.5,
					stagger: 0.1,
					ease: 'power2.out',
				},
				'-=0.5'
			);
	});
});

onUnmounted(() => {
	if (resizeObserver) resizeObserver.disconnect();
});
</script>

<style scoped>
.writing-vertical {
	writing-mode: vertical-rl;
	text-orientation: mixed;
}

.process-panel {
	min-width: 0;
	overflow: hidden;
	transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.expanded-inner {
	/* Lock width so text never reflows during panel width animation */
	min-width: var(--expanded-width);
	width: var(--expanded-width);
}
</style>
