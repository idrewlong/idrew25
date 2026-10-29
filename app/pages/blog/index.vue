<template>
	<div ref="pageRoot" class="blog-page">
		<PageHeader
			index="[ 00 / 01 ]"
			kicker="Blog"
			:title="['Writing']"
			lede="Notes on building things for the web: development, strategy, and whatever I'm currently arguing with."
		>
			<StatTiles
				:items="[
					{ value: String(posts?.length ?? 0).padStart(2, '0'), label: activeTag ? 'Posts in this tag' : 'Posts' },
					{ value: String(features.length).padStart(2, '0'), label: 'Published elsewhere' },
				]"
			/>
		</PageHeader>

		<section class="wrap">
			<div class="sec-rule">
				<span class="readout text-[var(--accent)]">[ 01 ]</span>
				<span class="readout">Posts</span>
			</div>
			<BlogTagFilter :tags="tags ?? []" :active="activeTag" class="mt-6 mb-4" />

			<div v-if="posts?.length" class="border-t border-[var(--border)] mt-6">
				<BlogPostCard v-for="post in posts" :key="post.slug" :post="post" />
			</div>
			<p v-else class="readout py-10">
				{{ activeTag ? 'No posts with that tag yet.' : 'No posts published yet.' }}
			</p>
		</section>

		<section v-if="features?.length" class="wrap mt-24 sm:mt-32">
			<div class="sec-rule">
				<span class="readout text-[var(--accent)]">[ 02 ]</span>
				<span class="readout">Published elsewhere</span>
			</div>
			<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-8">
				<BlogFeatureCard v-for="feature in features" :key="feature.externalUrl" :feature="feature" />
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
import { onPageLeft } from '~/composables/usePageLeave';
const route = useRoute();

const activeTag = computed(() =>
	typeof route.query.tag === 'string' && route.query.tag
		? route.query.tag
		: undefined
);

// `query` is reactive, so changing ?tag= refetches without a full navigation.
const { data: posts } = await useFetch('/api/blog/posts', {
	query: { tag: activeTag },
});
const { data: tags } = await useFetch('/api/blog/tags');
const features = featuredArticles;

useSeoMeta({
	title: 'Blog',
	description:
		'Notes on web development, strategy, and building things, by Andrew Long.',
	ogTitle: 'Blog | Andrew Long',
	ogDescription:
		'Notes on web development, strategy, and building things, by Andrew Long.',
});

const { $gsap } = useNuxtApp();
const pageRoot = ref<HTMLElement | null>(null);
let ctx: gsap.Context | undefined;

onPageLeft(() => ctx?.revert());

onMounted(() => {
	nextTick(() => {
		if (!pageRoot.value) return;

		// Respect the OS setting rather than animating regardless.
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			return;
		}

		const cards = pageRoot.value.querySelectorAll('.post-card, .feature-card');
		if (!cards.length) return;

		ctx = $gsap.context(() => {
			$gsap.set(cards, { opacity: 0, y: 40 });
			$gsap.to(cards, {
				opacity: 1,
				y: 0,
				duration: 0.7,
				ease: 'expo.out',
				stagger: 0.08,
				clearProps: 'transform',
				scrollTrigger: {
					trigger: pageRoot.value,
					start: 'top 90%',
					toggleActions: 'play none none none',
				},
			});
		});
	});
});
</script>

<style scoped>
.blog-page {
	padding-bottom: 6rem;
}
</style>
