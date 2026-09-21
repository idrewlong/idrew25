<template>
	<div v-if="tags.length" class="flex flex-wrap items-center gap-2">
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
	padding: 5px 11px;
	border: 1px solid var(--border, #e7e5e4);
	border-radius: 999px;
	font-family: 'Geist Mono', monospace;
	font-size: 10px;
	letter-spacing: 0.15em;
	text-transform: uppercase;
	color: var(--text-muted, #78716c);
	text-decoration: none;
	transition:
		border-color 0.15s ease,
		color 0.15s ease,
		background 0.15s ease;
}

.tag-chip:hover {
	border-color: #d6d3d1;
	color: var(--text, #1c1917);
}

.tag-chip--active {
	background: var(--text, #1c1917);
	border-color: var(--text, #1c1917);
	color: #fafaf9;
}
</style>
