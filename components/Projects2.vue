<template>
	<section
		ref="sectionEl"
		id="projects"
		class="bg-stone-100/70 border-y border-stone-200 py-16"
		@mousemove="onMouseMove"
		@mouseleave="onSectionLeave"
	>
		<div class="max-w-6xl mx-auto px-4 sm:px-6">
			<!-- Header -->
			<div
				class="flex items-center gap-4 mb-10 text-[11px] font-mono text-stone-400 uppercase tracking-widest"
			>
				<span>Selected Work</span>
				<span class="flex-1 h-px bg-stone-200" aria-hidden="true"></span>
				<span>{{ projects.length }} Projects</span>
			</div>

			<!-- Accordion rows -->
			<div ref="accordionEl">
				<div
					v-for="(project, i) in projects"
					:key="project.title"
					class="accordion-row border-t border-stone-200"
					:class="{ 'border-b border-stone-200': i === projects.length - 1 }"
				>
					<!-- Row header -->
					<button
						class="relative w-full flex items-center gap-3 sm:gap-5 py-5 sm:py-6 group text-left overflow-hidden md:cursor-none"
						:aria-expanded="openIndex === i"
						:aria-controls="`drawer-${i}`"
						@click="toggleRow(i)"
						@mouseenter="onRowEnter($event)"
						@mouseleave="onRowLeave"
					>
						<!-- Hover background sweep -->
						<span
							class="absolute inset-0 z-0 bg-white/60 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out pointer-events-none"
							aria-hidden="true"
						></span>

						<!-- Image peek (right edge, closed rows only) -->
						<div
							v-if="openIndex !== i"
							class="absolute right-0 top-0 bottom-0 w-44 z-[1] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
							aria-hidden="true"
						>
							<img
								:src="project.image"
								:alt="project.title"
								class="h-full w-full object-cover object-left"
								draggable="false"
							/>
							<!-- Fade left edge into row background -->
							<div
								class="absolute inset-0 bg-gradient-to-r from-stone-100 via-stone-100/60 to-transparent"
							></div>
						</div>

						<!-- Index -->
						<span
							class="relative z-10 font-mono text-[11px] shrink-0 w-6 tabular-nums transition-colors duration-300"
							:class="
								openIndex === i ? 'text-orange-400' : 'text-stone-300'
							"
							aria-hidden="true"
						>
							{{ String(i + 1).padStart(2, '0') }}
						</span>

						<!-- Title -->
						<h3
							class="relative z-10 flex-1 font-serif leading-none transition-colors duration-300"
							:class="[
								openIndex === i
									? 'text-orange-500'
									: 'text-stone-900 group-hover:text-orange-500',
								'text-2xl sm:text-3xl lg:text-4xl',
							]"
						>
							{{ project.title }}
						</h3>

						<!-- Work type dot -->
						<span
							class="relative z-10 w-1.5 h-1.5 rounded-full shrink-0 hidden sm:block"
							:class="
								project.isRealWork ? 'bg-emerald-400' : 'bg-amber-300'
							"
							:title="project.isRealWork ? 'Client work' : 'Side project'"
						></span>

						<!-- Plus → × icon -->
						<div
							class="relative z-10 shrink-0 w-5 h-5 flex items-center justify-center"
						>
							<Icon
								icon="heroicons:plus-small"
								class="w-5 h-5 text-stone-400 transition-all duration-300 group-hover:text-orange-500"
								:style="{
									transform:
										openIndex === i ? 'rotate(45deg)' : 'rotate(0deg)',
								}"
							/>
						</div>
					</button>

					<!-- Drawer body -->
					<div
						:id="`drawer-${i}`"
						ref="bodyEls"
						style="height: 0; overflow: hidden"
					>
						<div class="pb-6 sm:pb-10 pt-1">
							<div class="grid md:grid-cols-5 gap-5 sm:gap-8 lg:gap-12">
								<!-- Left: text details -->
								<div class="md:col-span-2 flex flex-col gap-5 drawer-text">
									<p
										class="text-sm text-stone-500 leading-relaxed"
										style="max-width: 40ch"
									>
										{{ project.description }}
									</p>

									<div class="flex flex-wrap gap-2">
										<span
											v-for="tag in project.workTypes"
											:key="tag"
											class="px-2.5 py-1 rounded-full text-[10px] font-medium text-stone-500 bg-white border border-stone-200"
										>
											{{ tag }}
										</span>
									</div>

									<div class="flex items-center gap-4">
										<div class="flex items-center gap-1.5">
											<Icon
												v-for="tech in project.technologies.slice(0, 5)"
												:key="tech"
												:icon="tech"
												class="w-5 h-5 opacity-50"
											/>
										</div>
										<a
											:href="project.link"
											target="_blank"
											rel="noopener noreferrer"
											class="inline-flex items-center gap-1.5 text-[11px] font-mono text-stone-600 hover:text-orange-500 border border-stone-300 hover:border-orange-300 rounded-full px-3 py-1.5 transition-colors duration-200"
										>
											Visit site
											<Icon
												icon="heroicons:arrow-up-right-20-solid"
												class="w-3.5 h-3.5"
											/>
										</a>
									</div>
								</div>

								<!-- Right: project image -->
								<div class="md:col-span-3 drawer-img overflow-hidden rounded-xl">
									<img
										:src="project.image"
										:alt="project.title"
										class="w-full aspect-video object-cover rounded-xl"
										draggable="false"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Circular "SEE THE WORK" cursor (desktop only) -->
		<ClientOnly>
			<Teleport to="body">
				<div
					ref="cursorEl"
					class="fixed top-0 left-0 pointer-events-none z-[9999] select-none hidden md:flex items-center justify-center"
					style="opacity: 0; will-change: transform; width: 112px; height: 112px; margin: -56px 0 0 -56px;"
					aria-hidden="true"
				>
					<!-- Rotating ring with text -->
					<svg
						ref="cursorRing"
						class="absolute inset-0 w-full h-full"
						viewBox="0 0 112 112"
					>
						<defs>
							<path
								id="seework-path"
								d="M 56,56 m -39,0 a 39,39 0 1,1 78,0 a 39,39 0 1,1 -78,0"
								fill="none"
							/>
						</defs>
						<!-- Orange circle with inner dashed ring -->
						<circle cx="56" cy="56" r="52" fill="#f97316" />
						<circle cx="56" cy="56" r="49" fill="none" stroke="white" stroke-width="0.75" stroke-dasharray="4 3" opacity="0.35" />
						<!-- Circular text in white -->
						<text
							fill="white"
							font-size="8"
							font-family="'Courier New', monospace"
							letter-spacing="3.5"
							font-weight="500"
						>
							<textPath href="#seework-path" startOffset="0%">
								SEE THE WORK • SEE THE WORK •
							</textPath>
						</text>
					</svg>

					<!-- Center: orange arrow -->
					<div class="relative z-10 flex items-center justify-center">
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M7 17L17 7M17 7H7M17 7V17"
								stroke="white"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</div>
				</div>
			</Teleport>
		</ClientOnly>
	</section>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { Icon } from '@iconify/vue';

const { $gsap } = useNuxtApp();

const projects = [
	{
		title: 'Mad Genius - 5.0',
		description:
			'Creative agency site redesign; assisted in rebuilding architecture for optimized GSAP transitions and stronger SEO.',
		image: '/images/madgcover.webp',
		link: 'https://madg.com/',
		workTypes: ['Web Development', 'SEO'],
		isRealWork: true,
		technologies: [
			'logos:nuxt-icon',
			'logos:typescript-icon',
			'logos:tailwindcss-icon',
			'logos:wordpress-icon',
			'logos:graphql',
		],
	},
	{
		title: 'Yates Construction',
		description:
			'Corporate website for a national construction firm; modular templates and performance/SEO improvements.',
		image: '/images/Yates.webp',
		link: 'https://wgyates.com/',
		workTypes: ['Web Development', 'SEO'],
		isRealWork: true,
		technologies: [
			'logos:nuxt-icon',
			'logos:tailwindcss-icon',
			'logos:wordpress-icon',
			'logos:graphql',
			'logos:wpengine',
		],
	},
	{
		title: 'Regional Homes',
		description:
			'Marketing site for a home builder; flexible components and streamlined lead-gen pages. Over 50 sites total.',
		image: '/images/Regional.webp',
		link: 'https://regionalhomes.net/',
		workTypes: ['Web Development', 'SEO'],
		isRealWork: true,
		technologies: [
			'logos:nuxt-icon',
			'logos:tailwindcss-icon',
			'logos:wordpress-icon',
			'logos:graphql',
			'logos:wpengine',
		],
	},
	{
		title: 'Eley Guild Hardy',
		description: 'Architecture portfolio; optimized imagery and page transitions.',
		image: '/images/EGH.webp',
		link: 'https://eleyguildhardy.com/',
		workTypes: ['Web Development'],
		isRealWork: true,
		technologies: [
			'logos:wordpress-icon',
			'logos:tailwindcss-icon',
			'logos:wpengine',
		],
	},
	{
		title: 'idrewfilm',
		description:
			'Photography portfolio; optimized imagery and page transitions. Digital Ocean Droplet, hosted on Cloudflare.',
		image: '/images/idrewfilm.webp',
		link: 'https://idrewfilm.com/',
		workTypes: ['Web Development', 'Web Design', 'Branding', 'SEO'],
		isRealWork: false,
		technologies: [
			'logos:nuxt-icon',
			'logos:tailwindcss-icon',
			'logos:wordpress-icon',
			'logos:graphql',
		],
	},
	{
		title: 'Taylor Trolley',
		description:
			'Brand and marketing site for a charter trolley service in Oxford/Taylor, MS.',
		image: '/images/taylortrolley.webp',
		link: 'https://taylortrolley.vercel.app/',
		workTypes: ['Web Development', 'Web Design', 'Branding'],
		isRealWork: false,
		technologies: ['logos:nuxt-icon', 'logos:tailwindcss-icon'],
	},
];

const sectionEl = ref(null);
const accordionEl = ref(null);
const bodyEls = ref([]);
const openIndex = ref(-1);
const cursorEl = ref(null);
const cursorRing = ref(null);
let isCursorVisible = false;
let hasValidPosition = false;
let hideTimer = null;

const hideCursor = () => {
	if (!isCursorVisible || !cursorEl.value) return;
	isCursorVisible = false;
	$gsap.to(cursorEl.value, {
		opacity: 0,
		scale: 0.8,
		duration: 0.22,
		ease: 'power2.in',
	});
};

const onMouseMove = (e) => {
	if (!cursorEl.value) return;
	hasValidPosition = true;
	$gsap.to(cursorEl.value, {
		x: e.clientX,
		y: e.clientY,
		duration: 0.5,
		ease: 'power3.out',
		overwrite: 'auto',
	});
};

const onRowEnter = (e) => {
	clearTimeout(hideTimer);
	// Snap cursor to actual mouse position before revealing —
	// prevents the stuck-at-top-left bug when scroll brings a row under the cursor
	if (e?.clientX != null && cursorEl.value) {
		$gsap.set(cursorEl.value, { x: e.clientX, y: e.clientY });
		hasValidPosition = true;
	}
	if (!isCursorVisible && cursorEl.value && hasValidPosition) {
		isCursorVisible = true;
		$gsap.to(cursorEl.value, {
			opacity: 1,
			scale: 1,
			duration: 0.3,
			ease: 'back.out(1.4)',
		});
	}
};

const onRowLeave = () => {
	// Small delay prevents flicker when moving between adjacent rows
	hideTimer = setTimeout(hideCursor, 80);
};

const onSectionLeave = () => {
	clearTimeout(hideTimer);
	hasValidPosition = false;
	hideCursor();
};

const openRow = (i) => {
	const body = bodyEls.value[i];
	if (!body) return;

	$gsap.to(body, {
		height: 'auto',
		duration: 0.5,
		ease: 'power3.out',
		onComplete: () => $gsap.set(body, { overflow: 'visible' }),
	});

	const text = body.querySelector('.drawer-text');
	if (text) {
		$gsap.fromTo(
			text.children,
			{ opacity: 0, y: 14 },
			{
				opacity: 1,
				y: 0,
				duration: 0.45,
				stagger: 0.07,
				ease: 'power2.out',
				delay: 0.15,
			}
		);
	}

	const img = body.querySelector('.drawer-img');
	if (img) {
		$gsap.fromTo(
			img,
			{ opacity: 0, x: 30 },
			{ opacity: 1, x: 0, duration: 0.55, ease: 'power3.out', delay: 0.1 }
		);
	}
};

const closeRow = (i) => {
	const body = bodyEls.value[i];
	if (!body) return;
	$gsap.set(body, { overflow: 'hidden' });
	$gsap.to(body, {
		height: 0,
		duration: 0.38,
		ease: 'power3.inOut',
	});
};

const toggleRow = (i) => {
	if (openIndex.value === i) {
		closeRow(i);
		openIndex.value = -1;
	} else {
		if (openIndex.value !== -1) closeRow(openIndex.value);
		openIndex.value = i;
		openRow(i);
	}
};

onMounted(() => {
	nextTick(() => {
		if (!sectionEl.value || !accordionEl.value) return;

		const rows = accordionEl.value.querySelectorAll('.accordion-row');

		$gsap.set(rows, { opacity: 0, y: 20 });
		$gsap.to(rows, {
			opacity: 1,
			y: 0,
			duration: 0.6,
			stagger: 0.07,
			ease: 'power2.out',
			onComplete: () => toggleRow(0),
			scrollTrigger: {
				trigger: sectionEl.value,
				start: 'top 75%',
				toggleActions: 'play none none none',
			},
		});

		// Start continuous ring rotation
		if (cursorRing.value) {
			$gsap.set(cursorEl.value, { scale: 0.8 });
			$gsap.to(cursorRing.value, {
				rotation: 360,
				duration: 9,
				ease: 'none',
				repeat: -1,
				transformOrigin: '50% 50%',
			});
		}
	});
});
</script>
