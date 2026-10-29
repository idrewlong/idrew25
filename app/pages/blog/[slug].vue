<template>
	<article v-if="post" class="wrap post-page">
		<NuxtLink to="/blog/" class="readout post-back">← All posts</NuxtLink>

		<header class="post-head">
			<div class="post-meta">
				<time :datetime="post.publishedAt" class="readout !text-[var(--text)]">
					{{ formatPostDate(post.publishedAt, 'long') }}
				</time>
				<NuxtLink v-for="tag in post.tags" :key="tag.slug" :to="`/blog/?tag=${tag.slug}`" class="readout post-tag">
					{{ tag.title }}
				</NuxtLink>
			</div>
			<h1 class="display post-title">{{ post.title }}</h1>
			<p class="post-desc">{{ post.description }}</p>
		</header>

		<img
			v-if="post.coverImage"
			:src="`${post.coverImage.url}?w=1600&fm=webp&q=82`"
			:alt="post.coverImage.alt"
			:width="post.coverImage.width ?? undefined"
			:height="post.coverImage.height ?? undefined"
			class="post-cover"
		/>

		<!-- With enough headings, the body gets a table of contents: pinned to
		     the left on desktop, collapsible above the body on smaller screens. -->
		<div
			v-if="showToc"
			class="lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-16"
		>
			<aside class="hidden lg:block">
				<div
					class="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pb-4"
				>
					<BlogTableOfContents :headings="post.headings" />
				</div>
			</aside>

			<details ref="mobileTocEl" class="mobile-toc lg:hidden">
				<summary class="mobile-toc-summary">
					On this page
					<Icon
						name="heroicons:chevron-down-20-solid"
						class="mobile-toc-chevron"
						aria-hidden="true"
					/>
				</summary>
				<div class="pt-4">
					<BlogTableOfContents
						:headings="post.headings"
						class="mobile-toc-list"
						@navigate="closeMobileToc"
					/>
				</div>
			</details>

			<BlogPostBody :html="post.bodyHtml" />
		</div>

		<BlogPostBody v-else :html="post.bodyHtml" />
	</article>
</template>

<script setup lang="ts">
const route = useRoute();
const slug = computed(() => String(route.params.slug));

const { data: post } = await useFetch(() => `/api/blog/posts/${slug.value}`);

if (!post.value) {
	throw createError({
		statusCode: 404,
		statusMessage: 'Post not found',
		fatal: true,
	});
}

const showToc = computed(() => (post.value?.headings?.length ?? 0) >= 2);

const mobileTocEl = ref<HTMLDetailsElement | null>(null);
const closeMobileToc = () => {
	if (mobileTocEl.value) mobileTocEl.value.open = false;
};

// Sanity's CDN crops to the 1200x630 that social platforms expect. Falling
// back to the site-wide OG image means a post without a cover still shares.
const ogImage = computed(() =>
	post.value?.coverImage
		? `${post.value.coverImage.url}?w=1200&h=630&fit=crop&fm=jpg`
		: 'https://www.idrewlong.com/og/andrew-long.jpg'
);

// Sanity titles can carry stray whitespace; posts without a description
// fall back to a generic line instead of shipping an empty one
const postTitle = computed(() => post.value?.title?.trim() || 'Post');
const postDescription = computed(
	() => post.value?.description?.trim() || `${postTitle.value}: a post by Andrew Long on building for the web.`
);

useSeoMeta({
	title: () => postTitle.value,
	description: () => postDescription.value,
	ogTitle: () => postTitle.value,
	ogDescription: () => postDescription.value,
	ogImage: () => ogImage.value,
	ogImageAlt: () => postTitle.value,
	ogType: 'article',
	articlePublishedTime: () => post.value?.publishedAt ?? '',
});

useSchemaOrg([
	defineArticle({
		headline: () => postTitle.value,
		description: () => postDescription.value,
		image: () => ogImage.value,
		datePublished: () => post.value?.publishedAt,
	}),
]);
</script>

<style scoped>
.post-page {
	padding-top: 2.5rem;
	padding-bottom: 6rem;
}

.post-back {
	display: inline-flex;
	align-items: center;
	min-height: 44px;
	text-decoration: none;
}

.post-back:hover {
	color: var(--accent);
}

.post-head {
	max-width: 62rem;
	margin: 2rem 0 3rem;
	padding-bottom: 2.5rem;
	border-bottom: 1px solid var(--border);
}

.post-meta {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem 1rem;
	margin-bottom: 1.25rem;
}

.post-tag {
	color: var(--accent);
	text-decoration: none;
}

.post-tag:hover {
	color: var(--text);
}

.post-title {
	font-size: clamp(3rem, 7vw, 6.5rem);
	line-height: 0.9;
}

.post-desc {
	margin-top: 1.5rem;
	max-width: 46rem;
	font-size: 1.125rem;
	line-height: 1.6;
	color: var(--text-muted);
}

.post-cover {
	width: 100%;
	margin-bottom: 4rem;
	border: 1px solid var(--border);
}

/* Collapsible table of contents shown above the body below lg */
.mobile-toc {
	margin-bottom: 2.5rem;
	padding: 0.875rem 1rem;
	border: 1px solid var(--border);
}

.mobile-toc-summary {
	display: flex;
	align-items: center;
	justify-content: space-between;
	cursor: pointer;
	list-style: none;
	font-family: 'Geist Mono', monospace;
	font-size: 10px;
	letter-spacing: 0.2em;
	text-transform: uppercase;
	color: var(--text-muted);
}

.mobile-toc-summary::-webkit-details-marker {
	display: none;
}

.mobile-toc-chevron {
	width: 1rem;
	height: 1rem;
	transition: transform 0.2s ease;
}

.mobile-toc[open] .mobile-toc-chevron {
	transform: rotate(180deg);
}

/* The summary already says "On this page" */
.mobile-toc-list :deep(.toc-label) {
	display: none;
}

@media (prefers-reduced-motion: reduce) {
	.mobile-toc-chevron {
		transition: none;
	}
}
</style>
