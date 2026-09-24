<template>
	<article v-if="post" class="max-w-6xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-16">
		<NuxtLink
			to="/blog/"
			class="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-stone-400 hover:text-orange-500 transition-colors mb-10"
		>
			<Icon name="heroicons:arrow-left-20-solid" class="w-3.5 h-3.5" />
			All posts
		</NuxtLink>

		<header class="mb-10 sm:mb-14 max-w-3xl">
			<div class="flex flex-wrap items-center gap-2 mb-4">
				<time :datetime="post.publishedAt" class="text-xs text-stone-400 mr-1">
					{{ formatPostDate(post.publishedAt, 'long') }}
				</time>
				<NuxtLink
					v-for="tag in post.tags"
					:key="tag.slug"
					:to="`/blog/?tag=${tag.slug}`"
					class="inline-flex items-center px-3 py-1.5 rounded-full border border-stone-200 text-[10px] leading-none font-mono uppercase tracking-[0.15em] text-stone-500 hover:text-orange-500 hover:border-orange-300 transition-colors"
				>
					{{ tag.title }}
				</NuxtLink>
			</div>
			<h1
				class="font-serif italic text-stone-900 leading-[0.98] tracking-tight text-3xl sm:text-5xl"
			>
				{{ post.title }}
			</h1>
			<p class="mt-5 text-base text-stone-500 leading-relaxed max-w-2xl">
				{{ post.description }}
			</p>
		</header>

		<img
			v-if="post.coverImage"
			:src="`${post.coverImage.url}?w=1600&fm=webp&q=82`"
			:alt="post.coverImage.alt"
			:width="post.coverImage.width ?? undefined"
			:height="post.coverImage.height ?? undefined"
			class="w-full rounded-2xl mb-12 sm:mb-16"
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
		: 'https://www.idrewlong.com/images/OG.webp'
);

useSeoMeta({
	title: () => post.value?.title ?? 'Post',
	description: () => post.value?.description ?? '',
	ogTitle: () => post.value?.title ?? 'Post',
	ogDescription: () => post.value?.description ?? '',
	ogImage: () => ogImage.value,
	ogImageWidth: 1200,
	ogImageHeight: 630,
	ogType: 'article',
	articlePublishedTime: () => post.value?.publishedAt ?? '',
});
</script>

<style scoped>
/* Collapsible table of contents shown above the body below lg */
.mobile-toc {
	margin-bottom: 2.5rem;
	padding: 0.875rem 1rem;
	border: 1px solid var(--border, #e7e5e0);
	border-radius: 0.75rem;
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
	color: var(--text-muted, #78716c);
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
