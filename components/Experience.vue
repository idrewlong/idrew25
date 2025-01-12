<template>
	<section class="max-w-6xl mx-auto p-6">
		<h1 class="text-3xl font-bold mb-2">Background & Experience</h1>
		<p class="text-gray-600 mb-8">
			My work history. From creating marketing strategies to slinging code.
		</p>

		<div class="space-y-12">
			<div
				v-for="experience in visibleExperiences"
				:key="experience.period"
				class="flex sm:gap-x-4 items-end"
			>
				<!-- Experience Content -->
				<div class="flex flex-col gap-y-3 flex-1">
					<div>
						<div class="text-xs text-black-light font-medium">
							{{ experience.period }}
						</div>
						<div class="text-lg font-bold">
							{{ experience.title }} @
							<span class="text-orange-400">{{ experience.company }}</span>
						</div>
					</div>

					<div class="text-sm text-gray-600">
						{{ experience.description }}
					</div>

					<ul class="text-sm text-gray-600 flex flex-col gap-y-1.5">
						<li
							v-for="(achievement, index) in experience.achievements"
							:key="index"
							class="flex gap-x-2 items-start"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 448 512"
								fill="currentColor"
								class="w-3.5 h-3.5 pt-1.5 shrink-0"
							>
								<path
									d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"
								/>
							</svg>
							<span>{{ achievement }}</span>
						</li>
					</ul>
				</div>

				<!-- Company Logo -->
				<img
					v-if="experience.logo"
					:src="experience.logo"
					:alt="`${experience.company} logo`"
					class="hidden sm:block w-24 h-24 object-contain aspect-square flex-shrink-0 opacity-30 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
					:style="{ aspectRatio: '100 / 100' }"
					width="200"
					height="200"
					loading="lazy"
					decoding="async"
				/>
			</div>
		</div>

		<div class="mt-8 text-center">
			<button
				v-if="!isExpanded && hasMoreExperiences"
				@click="loadMore"
				class="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 flex items-center mx-auto gap-2"
			>
				<span>Show More Experience</span>
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

const INITIAL_VISIBLE_COUNT = 3;

const experiences = [
	{
		period: 'June 2024 – Present',
		title: 'SEO Developer',
		company: 'Mad Genius',
		description:
			'Full-stack web development using React and Python. Leading initiatives to streamline cardholder and admin workflows.',
		achievements: [
			'Led a team of fantastic engineers on the spend management frontend team.',
			'Led the development of a new cardholder experience on web.',
			"Overhauled the core of Ramp's card transaction web interfaces.",
		],
		logo: '/images/madg.png',
	},
	{
		period: 'December 2023 – June 2024',
		title: 'Marketing Project Manager',
		company: 'Thompson Machinery',
		description:
			'Led comprehensive marketing and data initiatives across multiple divisions while managing a small team and developing technical solutions.',
		achievements: [
			'Spearheaded multi-channel advertising campaigns including email, PPC, and social media while building custom landing pages using Next.js, TailwindCSS, and WordPress development',
			'Developed internal tools and automation using Microsoft Power Apps, .NET/C#, and Microsoft Dynamics to streamline workflows and customer journeys',
			'Created data visualization solutions with Power BI and MySQL databases to track sales metrics and market share, while implementing SEO strategies using Google Analytics and Semrush.',
		],
		logo: '/images/thompson.png',
	},
	{
		period: 'September 2022 – April 2024',
		title: 'Marketing Project Manager',
		company: 'Finders Guide',
		description:
			'Led web development and digital marketing initiatives for multiple clients while managing remote teams and implementing comprehensive branding strategies.',
		achievements: [
			'Developed modern web solutions using React, Next.js, and Svelte.js while creating high-converting landing pages and implementing SEO strategies to expand client market reach',
			'Established complete branding strategies for diverse clients including construction, VFX, and manufacturing companies while optimizing their business processes and data utilization',
		],
		logo: '/images/g2.png',
	},
	{
		period: 'March 2022 – January 2023',
		title: 'Customer Support Specialist',
		company: 'Core Logic',
		description:
			'Provided expert software support and customer service while collaborating with development teams to enhance product features and user experience.',
		achievements: [
			'Maintained an exceptional 95% customer satisfaction score while providing specialized support for industry-specific software including DASH, Pro-Assist, and Xactimate',
			'Facilitated effective communication between customers and development teams using Jira and Salesforce while working in an agile SCRUM environment',
		],
		logo: '/images/corelogic.webp',
	},
	{
		period: 'January 2018 – December 2020',
		title: 'Media Coordinator',
		company: 'LMC',
		description:
			'Managed end-to-end video production projects while coordinating content strategy and advertising campaigns for diverse clients including artists and businesses.',
		achievements: [
			'Produced and edited over 100 media projects including music videos and commercials while ensuring consistent quality and client satisfaction throughout the creative process',
			'Orchestrated social media content management using Hootsuite to enhance consumer engagement while maintaining strict project schedules and deadlines',
		],
		logo: '/images/IDLOGO.png',
	},
];

const visibleCount = ref(INITIAL_VISIBLE_COUNT);
const isExpanded = ref(false);

const visibleExperiences = computed(() => {
	return experiences.slice(0, visibleCount.value);
});

const hasMoreExperiences = computed(() => {
	return visibleCount.value < experiences.length;
});

const loadMore = () => {
	visibleCount.value = experiences.length;
	isExpanded.value = true;
};

const showLess = () => {
	visibleCount.value = INITIAL_VISIBLE_COUNT;
	isExpanded.value = false;
};
</script>
