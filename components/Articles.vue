<template>
	<section class="max-w-6xl mx-auto p-6" id="articles">
		<h1 class="text-3xl font-bold mb-2 font-mono">Articles</h1>
		<p class="text-gray-600 mb-8">
			Thoughts and insights on marketing, AI, and web development.
		</p>

		<div class="grid md:grid-cols-2 gap-6">
			<article
				v-for="article in articles"
				:key="article.url"
				class="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
			>
				<a
					:href="article.url"
					target="_blank"
					rel="noopener noreferrer"
					class="flex flex-col h-full"
				>
					<!-- Image Container with Fixed Height -->
					<div
						class="relative h-[240px] overflow-hidden bg-gradient-to-b"
						:class="article.bgColor"
					>
						<img
							:src="article.image"
							:alt="article.title"
							class="absolute inset-0 w-full h-full object-contain p-8 transition-transform duration-300 group-hover:scale-105"
						/>
					</div>

					<!-- Content Container with Fixed Height -->
					<div class="p-6 flex flex-col flex-grow bg-white">
						<div class="flex items-start justify-between gap-4 mb-3">
							<h2
								class="text-xl font-mono font-bold group-hover:text-orange-500 transition-colors line-clamp-2"
							>
								{{ article.title }}
							</h2>
							<time
								:datetime="article.date"
								class="text-sm text-gray-500 whitespace-nowrap font-mono"
							>
								{{ formatDate(article.date) }}
							</time>
						</div>
						<p class="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
							{{ article.description }}
						</p>
						<div
							class="flex items-center text-orange-500 group-hover:text-orange-600 transition-colors font-mono"
						>
							Read article
							<Icon
								icon="material-symbols:arrow-circle-right-outline"
								class="w-4 h-4 ml-1"
							/>
						</div>
					</div>
				</a>
			</article>
		</div>
	</section>
</template>

<script setup>
import { Icon } from '@iconify/vue';

const articles = [
	{
		title: "The Modern Marketer's Guide To AI Implementation",
		date: '2025-03-19',
		url: 'https://madg.com/2025/03/19/the-modern-marketers-guide-to-ai-implementation/',
		description:
			'A comprehensive guide on integrating AI tools and strategies into modern marketing workflows, focusing on practical applications and real-world examples.',
		image: '/images/tools.png',
		bgColor: 'from-yellow-400 to-yellow-500',
	},
	{
		title: 'SEO in the Age of AI Search Engines',
		date: '2025-01-07',
		url: 'https://madg.com/2025/01/07/seo-in-the-age-of-ai-search-engines/',
		description:
			'Exploring how AI-powered search engines are changing SEO practices and what marketers need to know to stay ahead of the curve.',
		image: '/images/computer.png',
		bgColor: 'from-purple-400 to-purple-500',
	},
];

const formatDate = (dateString) => {
	return new Date(dateString).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});
};
</script>
