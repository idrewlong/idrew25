<template>
	<div ref="pageRoot" class="max-w-6xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-16">
		<div class="flex items-center gap-3 mb-6 sm:mb-10">
			<span
				class="text-[10px] font-bold tracking-[0.25em] uppercase text-stone-400"
			>
				Blog
			</span>
			<div class="flex-1 h-px bg-stone-200" />
		</div>

		<div class="mb-10 sm:mb-14">
			<h1
				class="font-serif italic text-stone-900 leading-[0.92] tracking-tight text-4xl sm:text-6xl"
			>
				Writing
			</h1>
			<p class="mt-5 text-sm text-stone-500 leading-relaxed max-w-md">
				Notes on building things for the web — development, strategy, and
				whatever I'm currently arguing with.
			</p>
		</div>

		<BlogTagFilter :tags="tags ?? []" :active="activeTag" class="mb-10" />

		<div
			v-if="posts?.length"
			class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
		>
			<BlogPostCard v-for="post in posts" :key="post.slug" :post="post" />
		</div>
		<p v-else class="text-sm text-stone-500 py-10">
			{{
				activeTag
					? 'No posts with that tag yet.'
					: 'No posts published yet.'
			}}
		</p>

		<section v-if="features?.length" class="mt-20 sm:mt-28">
			<div class="flex items-center gap-3 mb-10">
				<span
					class="text-[10px] font-bold tracking-[0.25em] uppercase text-stone-400"
				>
					Published Elsewhere
				</span>
				<div class="flex-1 h-px bg-stone-200" />
			</div>
			<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				<BlogFeatureCard
					v-for="feature in features"
					:key="feature.externalUrl"
					:feature="feature"
				/>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
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
const { data: features } = await useFetch('/api/blog/features');
const { data: tags } = await useFetch('/api/blog/tags');

useSeoMeta({
	title: 'Blog',
	description:
		'Notes on web development, strategy, and building things — by Andrew Long.',
	ogTitle: 'Blog — Andrew Long',
	ogDescription:
		'Notes on web development, strategy, and building things — by Andrew Long.',
	ogImage: '/images/OG.webp',
});

const { $gsap } = useNuxtApp();
const pageRoot = ref<HTMLElement | null>(null);

onMounted(() => {
	nextTick(() => {
		if (!pageRoot.value) return;

		// Respect the OS setting rather than animating regardless.
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			return;
		}

		const cards = pageRoot.value.querySelectorAll(
			'.post-card, .feature-card'
		);
		if (!cards.length) return;

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
</script>
