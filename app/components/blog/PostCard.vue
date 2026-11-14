<template>
	<NuxtLink :to="`/blog/${post.slug}/`" class="post-card group">
		<div class="post-meta">
			<time :datetime="post.publishedAt" class="readout !text-[var(--text)]">
				{{ formatPostDate(post.publishedAt) }}
			</time>
			<span v-for="tag in post.tags.slice(0, 2)" :key="tag.slug" class="readout post-tag">
				{{ tag.title }}
			</span>
		</div>
		<div class="post-copy">
			<h3 class="display post-title">{{ post.title }}</h3>
			<p class="post-desc">{{ post.description }}</p>
			<span class="readout post-read">Read <span aria-hidden="true">↗</span></span>
		</div>
		<div v-if="post.coverImage" class="post-media">
			<img
				:src="`${post.coverImage.url}?w=800&fm=webp&q=80`"
				:alt="post.coverImage.alt"
				:width="post.coverImage.width ?? undefined"
				:height="post.coverImage.height ?? undefined"
				loading="lazy"
				decoding="async"
				class="post-img"
			/>
		</div>
	</NuxtLink>
</template>

<script setup lang="ts">
import type { PostSummary } from '~~/server/utils/types';

defineProps<{ post: PostSummary }>();
</script>

<style scoped>
.post-card {
	display: grid;
	grid-template-columns: 1fr;
	gap: 1.25rem;
	padding: 2rem 0;
	border-bottom: 1px solid var(--border);
	text-decoration: none;
}

@media (min-width: 976px) {
	.post-card {
		grid-template-columns: 12rem minmax(0, 1fr) 20rem;
		gap: 3rem;
		align-items: start;
	}
}

.post-meta {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem 0.75rem;
}

@media (min-width: 976px) {
	.post-meta {
		flex-direction: column;
	}
}

.post-tag {
	color: var(--accent);
}

.post-title {
	font-size: clamp(1.9rem, 3.2vw, 2.75rem);
	line-height: 0.95;
	transition: color 0.2s ease;
}

.post-card:hover .post-title {
	color: var(--accent);
}

.post-desc {
	margin-top: 0.9rem;
	max-width: 56ch;
	font-size: 0.9375rem;
	line-height: 1.6;
	color: var(--text-muted);
}

.post-read {
	display: inline-flex;
	gap: 0.4rem;
	margin-top: 1.25rem;
	color: var(--text);
}

.post-card:hover .post-read {
	color: var(--accent);
}

.post-media {
	aspect-ratio: 16 / 10;
	overflow: hidden;
	border: 1px solid var(--border);
	background: var(--bg-card);
}

.post-img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	transition: transform 0.4s ease;
}

.post-card:hover .post-img {
	transform: scale(1.04);
}

@media (prefers-reduced-motion: reduce) {
	.post-title,
	.post-img {
		transition: none;
	}

	.post-card:hover .post-img {
		transform: none;
	}
}
</style>
