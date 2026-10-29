<template>
	<div v-if="tags.length" class="tag-bar" role="navigation" aria-label="Filter posts by tag">
		<NuxtLink
			to="/blog/"
			class="tag-chip"
			:class="{ 'tag-chip--active': !active }"
		>
			All
		</NuxtLink>
		<NuxtLink
			v-for="tag in tags"
			:key="tag.slug"
			:to="`/blog/?tag=${tag.slug}`"
			class="tag-chip"
			:class="{ 'tag-chip--active': active === tag.slug }"
		>
			{{ tag.title }}
		</NuxtLink>
	</div>
</template>

<script setup lang="ts">
import type { Tag } from '~~/server/utils/types';

defineProps<{ tags: Tag[]; active?: string }>();
</script>

<style scoped>
.tag-chip {
	display: inline-flex;
	align-items: center;
	min-height: 44px;
	padding: 0 1rem;
	border-right: 1px solid var(--border);
	font-family: 'Geist Mono', monospace;
	font-size: 10px;
	letter-spacing: 0.15em;
	text-transform: uppercase;
	color: var(--text-muted);
	text-decoration: none;
	transition:
		color 0.15s ease,
		background 0.15s ease;
}

.tag-bar {
	display: inline-flex;
	flex-wrap: wrap;
	border: 1px solid var(--border);
	border-right: 0;
}

.tag-chip:hover {
	color: var(--text);
}

.tag-chip--active {
	background: var(--text);
	color: var(--bg);
}
</style>
