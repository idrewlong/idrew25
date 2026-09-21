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
				<time :datetime="post.publishedAt" class="text-xs text-stone-400">
					{{ formatPostDate(post.publishedAt, 'long') }}
				</time>
				<span v-if="post.tags.length" class="text-stone-300">·</span>
				<NuxtLink
					v-for="tag in post.tags"
					:key="tag.slug"
					:to="`/blog/?tag=${tag.slug}`"
					class="text-[10px] font-mono uppercase tracking-[0.15em] text-stone-400 hover:text-orange-500 transition-colors"
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

		<BlogPostBody :html="post.bodyHtml" />
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
