<template>
	<section
		ref="projectsSection"
		class="bg-stone-100/70 border-y border-stone-200 py-16"
		id="projects"
		@mousemove="onMouseMove"
		@mouseleave="onSectionLeave"
	>
		<div class="max-w-6xl mx-auto px-6">
			<!-- Header -->
			<div
				class="flex items-center gap-4 mb-12 text-[11px] text-stone-400 uppercase tracking-widest font-mono"
			>
				<span>Selected Work</span>
				<span class="flex-1 h-px bg-stone-200" aria-hidden="true"></span>
				<span>{{ projects.length }} Projects</span>
			</div>

			<!-- Project rows -->
			<div ref="listEl">
				<a
					v-for="(project, i) in projects"
					:key="project.title"
					:href="project.link"
					target="_blank"
					rel="noopener noreferrer"
					class="project-row group flex items-center gap-5 py-5 sm:py-6 border-b border-stone-200 first:border-t cursor-none"
					@mouseenter="onRowEnter(i)"
					@mouseleave="onRowLeave"
					:aria-label="`Visit ${project.title}`"
				>
					<!-- Number -->
					<span
						class="font-mono text-[11px] text-stone-300 w-6 shrink-0 select-none"
						aria-hidden="true"
					>
						{{ String(i + 1).padStart(2, '0') }}
					</span>

					<!-- Title -->
					<h3
						class="flex-1 font-serif text-2xl sm:text-3xl text-stone-900 group-hover:text-orange-500 transition-colors duration-300 leading-none truncate"
					>
						{{ project.title }}
					</h3>

					<!-- Tags (desktop) -->
					<div class="hidden md:flex items-center gap-2 shrink-0">
						<span
							v-for="tag in project.workTypes.slice(0, 2)"
							:key="tag"
							class="px-2.5 py-1 rounded-full text-[10px] font-medium text-stone-500 bg-white border border-stone-200 group-hover:border-orange-200 group-hover:text-orange-600 transition-colors duration-300"
						>
							{{ tag }}
						</span>
					</div>

					<!-- Work type dot -->
					<span
						class="w-1.5 h-1.5 rounded-full shrink-0 hidden sm:block"
						:class="project.isRealWork ? 'bg-emerald-400' : 'bg-amber-300'"
						:title="project.isRealWork ? 'Client work' : 'Side project'"
					></span>

					<!-- Arrow -->
					<Icon
						icon="heroicons:arrow-up-right-20-solid"
						class="w-4 h-4 text-stone-300 group-hover:text-orange-500 shrink-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
						aria-hidden="true"
					/>
				</a>
			</div>
		</div>

		<!-- Floating cursor preview (desktop only, client-only to avoid SSR issues) -->
		<ClientOnly>
			<Teleport to="body">
				<div
					ref="cursorEl"
					class="fixed top-0 left-0 pointer-events-none z-[9999] select-none hidden md:block"
					style="opacity: 0; will-change: transform"
					aria-hidden="true"
				>
					<div
						class="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5 bg-stone-900"
						style="width: 300px; transform: translate(20px, -55%)"
					>
						<div class="relative aspect-video">
							<img
								ref="previewImg"
								:src="previewProject.image"
								:alt="previewProject.title"
								class="absolute inset-0 w-full h-full object-cover"
							/>
							<div
								class="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent"
							>
								<div class="absolute bottom-0 inset-x-0 p-3">
									<p class="text-white/90 text-sm font-serif leading-none">
										{{ previewProject.title }}
									</p>
									<p
										class="text-white/50 text-[10px] mt-1 font-mono uppercase tracking-wide"
									>
										{{ previewProject.workTypes.slice(0, 2).join(' · ') }}
									</p>
								</div>
							</div>
						</div>
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
		image: '/images/madgcover.png',
		link: 'https://madg.com/',
		workTypes: ['Web Development', 'SEO'],
		isRealWork: true,
		technologies: [
			'logos:nuxt-icon',
			'logos:typescript-icon',
			'logos:tailwindcss-icon',
			'logos:wordpress-icon',
			'logos:graphql',
			'logos:wpengine',
		],
	},
	{
		title: 'Yates Construction',
		description:
			'Corporate website for a national construction firm; modular templates and performance/SEO improvements.',
		image: '/images/Yates.png',
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
			'Marketing site for a home builder; flexible components and streamlined lead‑gen pages. All-in-all over 50 sites.',
		image: '/images/Regional.png',
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
		description: 'Architecture portfolio; Optimized imagery and page transitions.',
		image: '/images/EGH.png',
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
		image: '/images/idrewfilm.png',
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
		image: '/images/taylortrolley.png',
		link: 'https://taylortrolley.vercel.app/',
		workTypes: ['Web Development', 'Web Design', 'Branding'],
		isRealWork: false,
		technologies: ['logos:nuxt-icon', 'logos:tailwindcss-icon'],
	},
];

const projectsSection = ref(null);
const listEl = ref(null);
const cursorEl = ref(null);
const previewImg = ref(null);
const previewProject = ref(projects[0]);
let isCursorVisible = false;

const onMouseMove = (e) => {
	if (!cursorEl.value) return;
	$gsap.to(cursorEl.value, {
		x: e.clientX,
		y: e.clientY,
		duration: 0.55,
		ease: 'power3.out',
		overwrite: 'auto',
	});
};

const onRowEnter = (i) => {
	const project = projects[i];
	const isNewProject = previewProject.value !== project;

	previewProject.value = project;

	if (isNewProject && previewImg.value) {
		$gsap.fromTo(
			previewImg.value,
			{ opacity: 0, y: 8 },
			{ opacity: 1, y: 0, duration: 0.28, ease: 'power2.out' }
		);
	}

	if (!isCursorVisible && cursorEl.value) {
		isCursorVisible = true;
		$gsap.to(cursorEl.value, {
			opacity: 1,
			duration: 0.2,
			ease: 'power2.out',
		});
	}
};

const onRowLeave = () => {
	// keep visible while moving between rows — sectionLeave handles hiding
};

const onSectionLeave = () => {
	if (!isCursorVisible || !cursorEl.value) return;
	isCursorVisible = false;
	$gsap.to(cursorEl.value, {
		opacity: 0,
		duration: 0.18,
		ease: 'power2.in',
	});
};

const initScrollAnimation = () => {
	if (!listEl.value || !projectsSection.value) return;
	const rows = listEl.value.querySelectorAll('.project-row');
	if (!rows.length) return;

	$gsap.set(rows, { opacity: 0, y: 22 });
	$gsap.to(rows, {
		opacity: 1,
		y: 0,
		duration: 0.65,
		stagger: 0.08,
		ease: 'power2.out',
		scrollTrigger: {
			trigger: projectsSection.value,
			start: 'top 75%',
			toggleActions: 'play none none none',
		},
	});
};

onMounted(() => {
	nextTick(initScrollAnimation);
});
</script>

<style scoped>
.project-row {
	position: relative;
}

.project-row::before {
	content: '';
	position: absolute;
	inset: 0;
	background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.015));
	opacity: 0;
	transition: opacity 0.25s ease;
	pointer-events: none;
}

.project-row:hover::before {
	opacity: 1;
}
</style>
