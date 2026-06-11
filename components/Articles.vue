<template>
  <section ref="articlesSection" class="max-w-6xl w-full min-w-0 mx-auto px-4 sm:px-6 py-6" id="articles">
    <div ref="title" class="flex items-center gap-3 mb-10">
      <span class="text-[10px] font-bold tracking-[0.25em] uppercase text-stone-400">Articles</span>
      <div class="flex-1 h-px bg-stone-200"></div>
      <div class="flex items-center gap-2">
        <button
          type="button"
          aria-label="Previous article"
          :disabled="!canScrollPrev"
          @click="scrollByCard(-1)"
          class="flex items-center justify-center w-9 h-9 rounded-full border border-stone-200 text-stone-500 hover:border-stone-300 hover:text-orange-500 transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          <Icon icon="heroicons:chevron-left-20-solid" class="w-5 h-5" />
        </button>
        <button
          type="button"
          aria-label="Next article"
          :disabled="!canScrollNext"
          @click="scrollByCard(1)"
          class="flex items-center justify-center w-9 h-9 rounded-full border border-stone-200 text-stone-500 hover:border-stone-300 hover:text-orange-500 transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          <Icon icon="heroicons:chevron-right-20-solid" class="w-5 h-5" />
        </button>
      </div>
    </div>

    <div
      ref="scroller"
      class="no-scrollbar flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 -mb-2"
      @scroll="updateScrollState"
    >
      <article
        v-for="article in articles"
        :key="article.url"
        class="article-card group snap-start shrink-0 w-[85%] sm:w-[calc(50%-12px)] bg-white rounded-2xl overflow-hidden border border-stone-200 hover:border-stone-300 shadow-sm hover:shadow-md transition-all duration-300"
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
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { Icon } from '@iconify/vue';

const { $gsap } = useNuxtApp();

const articlesSection = ref(null);
const title = ref(null);
const scroller = ref(null);

const canScrollPrev = ref(false);
const canScrollNext = ref(false);

const articles = [
  {
    title: "When Tools Are Smart Enough, All That's Left Is Taste",
    date: '2026-05-12',
    url: 'https://madg.com/blog/when-tools-are-smart-enough-all-thats-left-is-taste/',
    description:
      'As AI levels the playing field on tool proficiency, taste and judgment become the real differentiators for agencies in an AI-enabled landscape.',
    image: '/images/taste.webp',
    bgColor: 'from-[#de6daa] to-[#de6daa] text-[#000d0f]',
  },
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

const updateScrollState = () => {
  const el = scroller.value;
  if (!el) return;
  const maxScroll = el.scrollWidth - el.clientWidth;
  canScrollPrev.value = el.scrollLeft > 1;
  canScrollNext.value = el.scrollLeft < maxScroll - 1;
};

const scrollByCard = (dir) => {
  const el = scroller.value;
  if (!el) return;
  const card = el.querySelector('.article-card');
  const gap = 24; // matches gap-6
  const step = card ? card.offsetWidth + gap : el.clientWidth;
  el.scrollBy({ left: dir * step, behavior: 'smooth' });
};

const initScrollAnimations = () => {
  if (!articlesSection.value || !title.value || !scroller.value) {
    return;
  }

  updateScrollState();

  $gsap.set(title.value, {
    opacity: 0,
    y: 20,
  });

  const articleCards = scroller.value.querySelectorAll('.article-card');
  $gsap.set(articleCards, {
    opacity: 0,
    y: 40,
  });

  const tl = $gsap.timeline({
    scrollTrigger: {
      trigger: articlesSection.value,
      start: 'top 90%',
      toggleActions: 'play none none none',
    },
  });

  tl.to(title.value, {
    opacity: 1,
    y: 0,
    duration: 0.5,
    ease: 'power2.out',
  }).to(
    articleCards,
    {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'expo.out',
      stagger: 0.15,
      clearProps: 'transform',
    },
    '-=0.5'
  );
};

onMounted(() => {
  nextTick(initScrollAnimations);
  window.addEventListener('resize', updateScrollState);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateScrollState);
});
</script>

<style scoped>
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-x: contain;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
