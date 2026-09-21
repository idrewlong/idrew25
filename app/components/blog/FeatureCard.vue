<template>
	<a
		:href="feature.externalUrl"
		target="_blank"
		rel="noopener noreferrer"
		class="feature-card group"
	>
		<div
			class="feature-card-media"
			:style="{ backgroundColor: feature.accentColor }"
		>
			<img
				:src="feature.image.url"
				:alt="feature.image.alt"
				loading="lazy"
				decoding="async"
				class="feature-card-img"
			/>
		</div>
		<div class="p-6 flex flex-col flex-grow">
			<div class="flex items-start justify-between gap-4 mb-3">
				<h3
					class="text-base font-serif font-bold text-stone-900 group-hover:text-orange-500 transition-colors line-clamp-2"
				>
					{{ feature.title }}
				</h3>
				<time
					:datetime="feature.publishedAt"
					class="text-xs text-stone-400 whitespace-nowrap"
				>
					{{ formatPostDate(feature.publishedAt) }}
				</time>
			</div>
			<p class="text-stone-500 text-sm mb-4 line-clamp-2 flex-grow">
				{{ feature.description }}
			</p>
			<div class="flex items-center justify-between">
				<span
					class="text-[10px] font-mono uppercase tracking-[0.15em] text-stone-400"
				>
					{{ feature.publisher }}
				</span>
				<span
					class="flex items-center text-orange-500 group-hover:text-orange-600 transition-colors text-sm"
				>
					Read article
					<Icon
						name="material-symbols:arrow-circle-right-outline"
						class="w-4 h-4 ml-1"
					/>
				</span>
			</div>
		</div>
	</a>
</template>

<script setup lang="ts">
import type { FeaturedArticle } from '~/utils/featuredArticles';

defineProps<{ feature: FeaturedArticle }>();

</script>

<style scoped>
.feature-card {
	display: flex;
	flex-direction: column;
	height: 100%;
	background: #fff;
	border: 1px solid var(--border, #e7e5e4);
	border-radius: 1rem;
	overflow: hidden;
	transition:
		border-color 0.3s ease,
		box-shadow 0.3s ease;
}

.feature-card:hover {
	border-color: #d6d3d1;
	box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.feature-card-media {
	position: relative;
	height: 180px;
	overflow: hidden;
}

@media (min-width: 640px) {
	.feature-card-media {
		height: 240px;
	}
}

.feature-card-img {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	object-fit: contain;
	padding: 2rem;
	transition: transform 0.3s ease;
}

.feature-card:hover .feature-card-img {
	transform: scale(1.05);
}

@media (prefers-reduced-motion: reduce) {
	.feature-card-img {
		transition: none;
	}
	.feature-card:hover .feature-card-img {
		transform: none;
	}
}
</style>
