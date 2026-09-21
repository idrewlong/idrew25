<template>
	<NuxtLink :to="`/blog/${post.slug}/`" class="post-card group">
		<div v-if="post.coverImage" class="post-card-media">
			<img
				:src="`${post.coverImage.url}?w=800&fm=webp&q=80`"
				:alt="post.coverImage.alt"
				:width="post.coverImage.width ?? undefined"
				:height="post.coverImage.height ?? undefined"
				loading="lazy"
				decoding="async"
				class="post-card-img"
			/>
		</div>
		<div class="p-6">
			<div class="flex items-center gap-2 mb-2">
				<time :datetime="post.publishedAt" class="text-xs text-stone-400">
					{{ formatPostDate(post.publishedAt) }}
				</time>
				<span v-if="post.tags.length" class="text-stone-300">·</span>
				<span
					v-for="tag in post.tags.slice(0, 2)"
					:key="tag.slug"
					class="text-[10px] font-mono uppercase tracking-[0.15em] text-stone-400"
				>
					{{ tag.title }}
				</span>
			</div>
			<h2
				class="font-serif font-bold text-lg text-stone-900 group-hover:text-orange-500 transition-colors"
			>
				{{ post.title }}
			</h2>
			<p class="mt-2 text-sm text-stone-500 line-clamp-2">
				{{ post.description }}
			</p>
		</div>
	</NuxtLink>
</template>

<script setup lang="ts">
import type { PostSummary } from '~~/server/utils/types';

defineProps<{ post: PostSummary }>();

</script>

<style scoped>
.post-card {
	display: flex;
	flex-direction: column;
	background: #fff;
	border: 1px solid var(--border, #e7e5e4);
	border-radius: 1rem;
	overflow: hidden;
	transition:
		border-color 0.3s ease,
		box-shadow 0.3s ease;
}

.post-card:hover {
	border-color: #d6d3d1;
	box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.post-card-media {
	height: 200px;
	overflow: hidden;
	background: #f5f5f4;
}

.post-card-img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	transition: transform 0.3s ease;
}

.post-card:hover .post-card-img {
	transform: scale(1.04);
}

@media (prefers-reduced-motion: reduce) {
	.post-card-img {
		transition: none;
	}
	.post-card:hover .post-card-img {
		transform: none;
	}
}
</style>
