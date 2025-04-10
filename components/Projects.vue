<template>
	<section class="max-w-6xl mx-auto p-6" id="projects">
		<h1 class="text-3xl font-bold mb-2">Projects</h1>
		<p class="text-gray-600 mb-8">Some open things I've worked on.</p>

		<div class="grid md:grid-cols-2 gap-6">
			<div
				v-for="project in visibleProjects"
				:key="project.title"
				class="group"
			>
				<!-- Project Card -->
				<div class="flex flex-col">
					<!-- Project Image Container -->
					<div class="rounded-lg overflow-hidden mb-4 bg-gray-100">
						<div class="aspect-[16/9] relative">
							<img
								:src="project.image"
								:alt="project.title"
								class="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-300 hover:grayscale-0"
							/>
						</div>
					</div>

					<!-- Project Info -->
					<div class="flex items-start justify-between gap-4">
						<h3 class="text-xl font-bold mb-2">{{ project.title }}</h3>
						<div class="flex gap-2">
							<Icon
								v-for="tech in project.technologies"
								:key="tech"
								:icon="tech"
								class="w-5 h-5"
							/>
						</div>
					</div>
					<p class="text-gray-600 text-sm mb-2">
						{{ project.description }}
					</p>
					<a
						:href="project.link"
						class="font-medium hover:text-gray-900 transition-colors inline-flex items-center gap-1"
					>
						Check it out
						<Icon
							icon="material-symbols:arrow-circle-right-outline"
							class="w-4 h-4 relative top-[1px]"
						/>
					</a>
				</div>
			</div>
		</div>

		<div class="mt-8 text-center">
			<button
				v-if="!isExpanded && hasMoreProjects"
				@click="loadMore"
				class="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 flex items-center mx-auto gap-2"
			>
				<span>Show More Projects</span>
				<svg
					class="w-4 h-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</button>

			<button
				v-if="isExpanded"
				@click="showLess"
				class="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 flex items-center mx-auto gap-2"
			>
				<span>Show Less</span>
				<svg
					class="w-4 h-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M5 15l7-7 7 7"
					/>
				</svg>
			</button>
		</div>
	</section>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Icon } from '@iconify/vue';

const INITIAL_VISIBLE_COUNT = 4;

const projects = [
	{
		title: 'Victory Native',
		description:
			'High-performance charting library for React Native powered by Reanimated, Skia, Gesture Handler, and D3.',
		image: '/images/fat8.jpg',
		link: '#',
		technologies: ['logos:react', 'logos:typescript-icon'],
	},
	{
		title: 'Pro-link Resumes',
		description:
			'A Raycast extension for running Open Source Intelligence checks on a domain.',
		image: '/images/fat8.jpg',
		link: '#',
		technologies: ['logos:typescript-icon', 'logos:nodejs-icon'],
	},
	{
		title: 'ID-SEO',
		description:
			'A type and runtime safe query builder for the GROQ query language.',
		image: '/images/fat8.jpg',
		link: '#',
		technologies: ['logos:typescript-icon', 'logos:javascript'],
	},
	{
		title: 'Porta Productions',
		description: 'A screen recording app built with web technologies.',
		image: '/images/fat8.jpg',
		link: 'https://porta.productions/',
		technologies: ['logos:electron', 'logos:javascript'],
	},
	{
		title: 'Mandelbruh',
		description: 'An interactive Mandelbrot set explorer built with WebGL.',
		image: '/images/fat8.jpg',
		link: '#',
		technologies: ['logos:webgl', 'logos:javascript'],
	},
	{
		title: 'React Native Zephyr',
		description: 'A design system and component library for React Native.',
		image: '/images/fat8.jpg',
		link: '#',
		technologies: ['logos:react', 'logos:typescript-icon'],
	},
];

const visibleCount = ref(INITIAL_VISIBLE_COUNT);
const isExpanded = ref(false);

const visibleProjects = computed(() => {
	return projects.slice(0, visibleCount.value);
});

const hasMoreProjects = computed(() => {
	return visibleCount.value < projects.length;
});

const loadMore = () => {
	visibleCount.value = projects.length;
	isExpanded.value = true;
};

const showLess = () => {
	visibleCount.value = INITIAL_VISIBLE_COUNT;
	isExpanded.value = false;
};
</script>
