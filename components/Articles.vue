<template>
  <section ref="articlesSection" class="max-w-6xl mx-auto px-4 sm:px-6 py-6" id="articles">
    <div ref="title" class="flex items-center gap-3 mb-10">
      <span class="text-[10px] font-bold tracking-[0.25em] uppercase text-stone-400">Articles</span>
      <div class="flex-1 h-px bg-stone-200"></div>
    </div>

    <div ref="articlesGrid" class="grid md:grid-cols-2 gap-6">
      <article
        v-for="article in articles"
        :key="article.url"
        class="article-card group bg-white rounded-2xl overflow-hidden border border-stone-200 hover:border-stone-300 shadow-sm hover:shadow-md transition-all duration-300"
      >
        <a
          :href="article.url"
          target="_blank"
          rel="noopener noreferrer"
          class="flex flex-col h-full"
        >
          <!-- Image Container with Fixed Height -->
          <div
            class="relative h-[180px] sm:h-[240px] overflow-hidden bg-gradient-to-b"
            :class="article.bgColor"
          >
            <img
              :src="article.image"
              :alt="article.title"
              class="absolute inset-0 w-full h-full object-contain p-8 transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          <!-- Content Container with Fixed Height -->
          <div class="p-6 flex flex-col flex-grow">
            <div class="flex items-start justify-between gap-4 mb-3">
              <h2
                class="text-base font-serif font-bold text-stone-900 group-hover:text-orange-500 transition-colors line-clamp-2"
              >
                {{ article.title }}
              </h2>
              <time
                :datetime="article.date"
                class="text-xs text-stone-400 whitespace-nowrap"
              >
                {{ formatDate(article.date) }}
              </time>
            </div>
            <p class="text-stone-500 text-sm mb-4 line-clamp-2 flex-grow">
              {{ article.description }}
            </p>
            <div
              class="flex items-center text-orange-500 group-hover:text-orange-600 transition-colors text-sm"
            >
              Read article
              <Icon
                icon="material-symbols:arrow-circle-right-outline"
                class="w-4 h-4 ml-1"
              />
            </div>
          </div>
        </a>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { Icon } from '@iconify/vue';

const { $gsap } = useNuxtApp();

const articlesSection = ref(null);
const title = ref(null);
const articlesGrid = ref(null);

const articles = [
  {
    title: "The Modern Marketer's Guide To AI Implementation",
    date: '2025-03-19',
    url: 'https://madg.com/2025/03/19/the-modern-marketers-guide-to-ai-implementation/',
    description:
      'A comprehensive guide on integrating AI tools and strategies into modern marketing workflows, focusing on practical applications and real-world examples.',
    image: '/images/tools.webp',
    bgColor: 'from-yellow-400 to-yellow-500',
  },
  {
    title: 'SEO in the Age of AI Search Engines',
    date: '2025-01-07',
    url: 'https://madg.com/2025/01/07/seo-in-the-age-of-ai-search-engines/',
    description:
      'Exploring how AI-powered search engines are changing SEO practices and what marketers need to know to stay ahead of the curve.',
    image: '/images/computer.webp',
    bgColor: 'from-purple-400 to-purple-500',
  },
];

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const initScrollAnimations = () => {
  if (
    !articlesSection.value ||
    !title.value ||
    !articlesGrid.value
  ) {
    return;
  }
  // Set initial states with slide positions
  $gsap.set(title.value, {
    opacity: 0,
    y: 20,
  });

  const articleCards = articlesGrid.value.querySelectorAll('.article-card');
  articleCards.forEach((card, index) => {
    $gsap.set(card, {
      opacity: 0,
      x: index % 2 === 0 ? -60 : 60, // Alternate left/right
    });
  });

  // Create timeline for all animations
  const tl = $gsap.timeline({
    scrollTrigger: {
      trigger: articlesSection.value,
      start: 'top 90%', // Start animation when 90% of the element is in view
      toggleActions: 'play none none none',
    },
  });

  // Animate title, subtitle, and cards
  tl.to(title.value, {
    opacity: 1,
    y: 0,
    duration: 0.5,
    ease: 'power2.out',
  })
    .to(
      articleCards,
      {
        opacity: 1,
        x: 0,
        duration: 0.7,
        ease: 'expo.out',
        stagger: 0.15,
        clearProps: 'all',
      },
      '-=0.5'
    ); // Overlap with subtitle animation
};

onMounted(() => {
  nextTick(initScrollAnimations);
});
</script>
