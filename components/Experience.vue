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
					class="hidden sm:block w-16 h-16 object-contain aspect-square flex-shrink-0 opacity-30 grayscale"
					:style="{ aspectRatio: '100 / 100' }"
					width="100"
					height="100"
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
		logo: '/images/IDLOGO.png',
	},
	{
		period: 'December 2023 – June 2024',
		title: 'Marketing Project Manager',
		company: 'Thompson Machinery',
		description:
			'Helping client engineering teams shine their brightest. Overseeing the development of open source software and community outreach.',
		achievements: [
			'Oversaw client projects and ensured client teams had what they needed to succeed.',
			'Led client projects as an IC when needed.',
			'Led the open source program at Formidable, maintaining existing projects and creating new ones based on client needs and ecosystem trends.',
		],
		logo: '/images/IDLOGO.png',
	},
	{
		period: 'November 2021 – June 2022',
		title: 'Sr. Software Engineer',
		company: 'Finders Guide',
		description:
			"Full stack web and mobile on the Platform team. Built client SDKs and developer tools to help third parties integrate with Coinbase's fiat payment rails.",
		achievements: [
			"Helped bring Coinbase Pay to market, allowing partners to use Coinbase's fiat rails to on-ramp into the crypto ecosystem.",
			'Development of Coinbase Pay SDKs for web and mobile.',
		],
		logo: '/images/IDLOGO.png',
	},
	{
		period: 'Jan. 2021 – Nov. 2021',
		title: 'Software Engineer',
		company: 'Previous Company',
		description: 'Additional experience details...',
		achievements: ['Achievement 1', 'Achievement 2', 'Achievement 3'],
		logo: '/images/IDLOGO.png',
	},
	// {
	// 	period: 'June 2020 – Jan. 2021',
	// 	title: 'Junior Developer',
	// 	company: 'First Company',
	// 	description: 'Early career experience...',
	// 	achievements: ['Achievement 1', 'Achievement 2'],
	// 	logo: '/images/IDLOGO.png',
	// },
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
