<template>
	<div class="post-body" v-html="html" />
</template>

<script setup lang="ts">
defineProps<{ html: string }>();
</script>

<style scoped>
.post-body {
	max-width: 42rem;
	font-size: 1rem;
	line-height: 1.75;
	color: var(--text, #050506);
}

.post-body :deep(p) {
	margin: 0 0 1.35em;
}

.post-body :deep(h2) {
	margin: 2.2em 0 0.6em;
	font-family: var(--font-display);
	font-size: 2.25rem;
	font-weight: 800;
	line-height: 0.95;
	text-transform: uppercase;
	scroll-margin-top: 5rem;
}

.post-body :deep(h3) {
	margin: 2em 0 0.6em;
	font-size: 1.15rem;
	font-weight: 700;
	scroll-margin-top: 5rem;
}

.post-body :deep(h4) {
	margin: 1.8em 0 0.5em;
	font-size: 1rem;
	font-weight: 700;
	letter-spacing: 0.01em;
	scroll-margin-top: 5rem;
}

.post-body :deep(u) {
	text-decoration: underline;
	text-underline-offset: 2px;
}

.post-body :deep(s) {
	text-decoration: line-through;
	color: var(--text-muted, #78716c);
}

.post-body :deep(.body-divider) {
	margin: 2.5em 0;
	border: 0;
	border-top: 1px solid var(--border, #e7e5e0);
}

.post-body :deep(.callout) {
	margin: 1.8em 0;
	padding: 1.1rem 1.25rem;
	border-left: 3px solid var(--border, #e7e5e0);
	border-radius: 0;
	background: var(--bg-card);
}

.post-body :deep(.callout p) {
	margin: 0;
}

.post-body :deep(.callout p + p) {
	margin-top: 0.4em;
}

.post-body :deep(.callout-title) {
	font-weight: 700;
	font-size: 0.9375rem;
}

.post-body :deep(.callout--note) {
	border-left-color: #78716c;
	background: var(--bg-elevated);
}

.post-body :deep(.callout--warning) {
	border-left-color: #d97706;
	background: rgba(217, 119, 6, 0.1);
}

.post-body :deep(.callout--tip) {
	border-left-color: var(--accent);
	background: rgba(255, 91, 31, 0.08);
}

.post-body :deep(.video-embed) {
	margin: 2em 0;
}

.post-body :deep(.video-embed iframe) {
	display: block;
	width: 100%;
	aspect-ratio: 16 / 9;
	height: auto;
	border: 0;
	border-radius: 0;
	background: #050506;
}

.post-body :deep(.video-embed figcaption) {
	margin-top: 0.6rem;
	font-size: 0.8rem;
	color: var(--text-muted, #78716c);
}

.post-body :deep(a) {
	color: var(--accent);
	text-decoration: underline;
	text-underline-offset: 2px;
}

.post-body :deep(a:hover) {
	color: #ff7a45;
}

.post-body :deep(ul),
.post-body :deep(ol) {
	margin: 0 0 1.35em;
	padding-left: 1.4em;
}

.post-body :deep(ul) {
	list-style: disc;
}

.post-body :deep(ol) {
	list-style: decimal;
}

.post-body :deep(li) {
	margin-bottom: 0.4em;
}

.post-body :deep(blockquote) {
	margin: 1.8em 0;
	padding-left: 1.25rem;
	border-left: 2px solid var(--accent);
	font-family: var(--font-display);
	font-size: 1.6rem;
	line-height: 1.05;
	text-transform: uppercase;
	color: var(--text);
}

.post-body :deep(.inline-code) {
	padding: 0.15em 0.4em;
	background: var(--bg-elevated);
	border-radius: 0;
	font-family: 'Geist Mono', monospace;
	font-size: 0.875em;
}

.post-body :deep(.code-block) {
	margin: 1.8em 0;
	border: 1px solid var(--border, #e7e5e0);
	border-radius: 0;
	overflow: hidden;
}

.post-body :deep(.code-filename) {
	padding: 0.5rem 1rem;
	background: var(--bg-card);
	border-bottom: 1px solid var(--border, #e7e5e0);
	font-family: 'Geist Mono', monospace;
	font-size: 10px;
	letter-spacing: 0.15em;
	text-transform: uppercase;
	color: var(--text-muted, #78716c);
}

.post-body :deep(pre.shiki) {
	margin: 0;
	padding: 1.1rem 1.25rem;
	overflow-x: auto;
	font-size: 0.85rem;
	line-height: 1.6;
}

.post-body :deep(pre.shiki code) {
	font-family: 'Geist Mono', monospace;
}

.post-body :deep(.body-image) {
	margin: 2em 0;
}

.post-body :deep(.body-image img) {
	width: 100%;
	height: auto;
	border-radius: 0;
}

.post-body :deep(.body-image figcaption) {
	margin-top: 0.6rem;
	font-size: 0.8rem;
	color: var(--text-muted, #78716c);
}
</style>
