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
				<h3 class="display feature-title line-clamp-2">
					{{ feature.title }}
				</h3>
				<time
					:datetime="feature.publishedAt"
					class="readout whitespace-nowrap"
				>
					{{ formatPostDate(feature.publishedAt) }}
				</time>
			</div>
			<p class="feature-desc line-clamp-2 flex-grow">
				{{ feature.description }}
			</p>
			<div class="flex items-center justify-between">
				<span class="readout">
					{{ feature.publisher }}
				</span>
				<span class="readout feature-read">Read article <span aria-hidden="true">↗</span></span>
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
	background: var(--bg-card);
	border: 1px solid var(--border);
	overflow: hidden;
	transition:
		border-color 0.3s ease,
		box-shadow 0.3s ease;
}

.feature-card:hover {
	border-color: var(--accent);
}

.feature-title {
	font-size: 1.6rem;
	line-height: 0.95;
	transition: color 0.2s ease;
}

.feature-card:hover .feature-title,
.feature-card:hover .feature-read {
	color: var(--accent);
}

.feature-desc {
	margin-bottom: 1.25rem;
	font-size: 0.9375rem;
	line-height: 1.55;
	color: var(--text-muted);
}

.feature-read {
	color: var(--text);
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
