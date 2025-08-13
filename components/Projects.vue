<template>
  <section
    ref="projectsSection"
    class="bg-gradient-to-br from-orange-400 via-orange-500 to-orange-400 py-12"
    id="projects"
  >
    <div class="max-w-6xl mx-auto p-6 relative">
      <!-- Main Slider Content -->
      <!-- <h2 class="text-3xl font-bold text-white mb-2">Projects</h2>
      <p class="text-white mb-8">
        Here are some of the projects I've worked on.
      </p> -->
      <div class="grid md:grid-cols-5 gap-8 md:gap-12 items-center">
        <!-- Left Column: Text, Counter, Thumbnails -->
        <div ref="leftColumn" class="md:col-span-2">
          <!-- Meta row: work origin + counter -->
          <div
            ref="metaEl"
            class="flex items-center gap-3 mb-2 text-xs text-white/80"
          >
            <span
              class="inline-flex items-center gap-2"
              aria-label="Project type"
            >
              <span
                :class="
                  activeProject.isRealWork ? 'bg-emerald-400' : 'bg-amber-300'
                "
                class="w-2 h-2 rounded-full"
              ></span>
              {{ activeProject.isRealWork ? 'Real Work' : 'Side Project' }}
            </span>
            <span class="w-6 h-px bg-white/20" aria-hidden="true"></span>
            <span
              >{{ String(activeIndex + 1).padStart(2, '0') }} /
              {{ String(projects.length).padStart(2, '0') }}</span
            >
          </div>

          <a
            :href="activeProject.link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open project website"
            class="block mb-2"
          >
            <h2
              ref="titleEl"
              class="text-3xl md:text-4xl font-bold tracking-tight leading-tight text-white hover:text-orange-100 transition-colors duration-300 inline-flex items-center gap-2"
            >
              {{ activeProject.title }}
              <Icon icon="heroicons:arrow-right-20-solid" class="w-5 h-5" />
            </h2>
          </a>
          <p
            class="text-white/90 mb-6 max-w-prose md:max-w-[52ch] leading-relaxed"
            ref="descriptionEl"
          >
            {{ activeProject.description }}
          </p>

          <!-- Work type pills -->
          <div
            ref="workTypesEl"
            v-if="activeProject.workTypes && activeProject.workTypes.length"
            class="flex flex-wrap items-center gap-2 mb-6"
          >
            <span
              v-for="tag in visibleWorkTypes"
              :key="tag"
              class="px-2.5 py-1 rounded-full text-[11px] font-medium text-white/90 bg-white/10 border border-white/15"
            >
              {{ tag }}
            </span>

            <div
              v-if="hiddenWorkTypes.length"
              ref="workTypeOverflowWrapper"
              class="relative inline-block"
              @mouseenter="isHoverCapable ? openOverflow() : null"
              @mouseleave="isHoverCapable ? closeOverflow() : null"
            >
              <button
                type="button"
                class="px-2.5 py-1 rounded-full text-[11px] text-white/80 bg-white/5 border border-white/10"
                @click="toggleOverflow"
                @touchstart.prevent.stop="toggleOverflow"
                @keydown.enter.prevent="toggleOverflow"
                @keydown.space.prevent="toggleOverflow"
                aria-haspopup="true"
                :aria-expanded="showWorkTypeOverflow ? 'true' : 'false'"
                aria-label="Show more work types"
              >
                +{{ hiddenWorkTypes.length }}
              </button>

              <div
                v-show="showWorkTypeOverflow"
                class="absolute top-full mt-2 left-0 z-50 rounded-lg border border-white/10 bg-white/10 backdrop-blur-sm px-2 py-1 whitespace-nowrap shadow-lg"
              >
                <span
                  v-for="tag in hiddenWorkTypes"
                  :key="tag"
                  class="mr-2 last:mr-0 inline-block px-2.5 py-1 rounded-full text-[11px] font-medium text-white/90 bg-white/10 border border-white/15"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>

          <div
            ref="techIconsEl"
            v-if="activeProject.technologies"
            class="flex flex-wrap gap-2.5 mb-8"
          >
            <Icon
              v-for="tech in (activeProject.technologies || []).slice(0, 6)"
              :key="tech"
              :icon="tech"
              class="w-6 h-6 text-white/80 opacity-80"
            />
          </div>

          <div ref="buttonsEl" class="flex gap-2">
            <button
              @click="prevSlide"
              aria-label="Previous project"
              class="bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full p-2 transition"
            >
              <Icon icon="heroicons:arrow-left-20-solid" class="w-5 h-5" />
            </button>
            <button
              @click="nextSlide"
              aria-label="Next project"
              class="bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full p-2 transition"
            >
              <Icon icon="heroicons:arrow-right-20-solid" class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Right Column: Image -->
        <div ref="rightColumn" class="md:col-span-3">
          <div
            class="relative rounded-xl overflow-hidden ring-1 ring-white/10 shadow-lg w-full h-0 pb-[56.25%]"
          >
            <img
              :src="activeProject.image"
              :alt="activeProject.title"
              ref="imageEl"
              class="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { Icon } from '@iconify/vue';

const { $gsap, $ScrollTrigger } = useNuxtApp();

const projects = [
  {
    title: 'Mad Genius - 5.0',
    description:
      'Creative agency site redesign; assisted in rebuilding architecture for optimized GSAP transitions and stronger SEO.',
    image: '/images/madgcover.png',
    link: 'https://madg.com/',
    workTypes: ['Web Development', 'SEO'],
    isRealWork: true,
    technologies: [
      'logos:nuxt-icon',
      'logos:typescript-icon',
      'logos:tailwindcss-icon',
      'logos:wordpress-icon',
      'logos:graphql',
      'logos:wpengine',
    ],
  },
  {
    title: 'Yates Construction',
    description:
      'Corporate website for a national construction firm; modular templates and performance/SEO improvements.',
    image: '/images/Yates.png',
    link: 'https://wgyates.com/',
    workTypes: ['Web Development', 'SEO'],
    isRealWork: true,
    technologies: [
      'logos:nuxt-icon',
      'logos:tailwindcss-icon',
      'logos:wordpress-icon',
      'logos:graphql',
      'logos:wpengine',
    ],
  },
  {
    title: 'Regional Homes',
    description:
      'Marketing site for a home builder; flexible components and streamlined lead‑gen pages. All-in-all over 50 sites.',
    image: '/images/Regional.png',
    link: 'https://regionalhomes.net/',
    workTypes: ['Web Development', 'SEO'],
    isRealWork: true,
    technologies: [
      'logos:nuxt-icon',
      'logos:tailwindcss-icon',
      'logos:wordpress-icon',
      'logos:graphql',
      'logos:wpengine',
    ],
  },
  {
    title: 'Eley Guild Hardy',
    description:
      'Architecture portfolio; Optimized imagery and page transitions.',
    image: '/images/EGH.png',
    link: 'https://eleyguildhardy.com/',
    workTypes: ['Web Development'],
    isRealWork: true,
    technologies: [
      'logos:wordpress-icon',
      'logos:tailwindcss-icon',
      'logos:wpengine',
    ],
  },
  {
    title: "Lusco's Restaurant",
    description:
      'Restaurant website; menu/reservations UX and refreshed brand look.',
    image: '/images/luscos.png',
    link: 'https://luscos.restaurant/',
    workTypes: ['Web Development', 'Web Design', 'Branding', 'SEO'],
    isRealWork: false,
    technologies: [
      'logos:nuxt-icon',
      'logos:tailwindcss-icon',
      'logos:wordpress-icon',
      'logos:graphql',
      'logos:wpengine',
    ],
  },
  {
    title: 'Taylor Trolley',
    description:
      'Brand and marketing site for a charter trolley service in Oxford/Taylor, MS.',
    image: '/images/taylortrolley.png',
    link: 'https://taylortrolley.vercel.app/',
    workTypes: ['Web Development', 'Web Design', 'Branding'],
    isRealWork: false,
    technologies: ['logos:nuxt-icon', 'logos:tailwindcss-icon'],
  },
];

const activeIndex = ref(0);
const activeProject = computed(() => projects[activeIndex.value]);
const showWorkTypeOverflow = ref(false);
const isHoverCapable = ref(false);

const visibleWorkTypes = computed(() => {
  const types = activeProject.value?.workTypes || [];
  return types.slice(0, 3);
});

const hiddenWorkTypes = computed(() => {
  const types = activeProject.value?.workTypes || [];
  return types.slice(3);
});

const projectsSection = ref(null);
const leftColumn = ref(null);
const rightColumn = ref(null);
const titleEl = ref(null);
const descriptionEl = ref(null);
const imageEl = ref(null);
const techIconsEl = ref(null);
const workTypesEl = ref(null);
const metaEl = ref(null);
const workTypeOverflowWrapper = ref(null);
const buttonsEl = ref(null);

const openOverflow = () => {
  showWorkTypeOverflow.value = true;
};

const closeOverflow = () => {
  showWorkTypeOverflow.value = false;
};

const toggleOverflow = () => {
  showWorkTypeOverflow.value = !showWorkTypeOverflow.value;
};

const nextSlide = () => {
  goToSlide((activeIndex.value + 1) % projects.length);
};

const prevSlide = () => {
  goToSlide((activeIndex.value - 1 + projects.length) % projects.length);
};

const goToSlide = (index) => {
  if (index === activeIndex.value) return;
  activeIndex.value = index;
};

const initScrollAnimations = () => {
  if (!projectsSection.value || !leftColumn.value || !rightColumn.value) return;

  $gsap.set(leftColumn.value, { opacity: 0, x: -50 });
  $gsap.set(rightColumn.value, { opacity: 0, x: 50 });

  const tl = $gsap.timeline({
    scrollTrigger: {
      trigger: projectsSection.value,
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
  });

  tl.to(leftColumn.value, {
    opacity: 1,
    x: 0,
    duration: 0.8,
    ease: 'power2.out',
  }).to(
    rightColumn.value,
    {
      opacity: 1,
      x: 0,
      duration: 0.8,
      ease: 'power2.out',
    },
    '-=0.6'
  );
};

watch(activeIndex, () => {
  // close overflow on slide change
  showWorkTypeOverflow.value = false;
  const textElements = [
    metaEl.value,
    titleEl.value,
    descriptionEl.value,
    workTypesEl.value,
    techIconsEl.value,
  ].filter(Boolean);

  $gsap.fromTo(
    textElements,
    { opacity: 0, y: 6 },
    {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: 'power3.out',
      stagger: 0.06,
    }
  );

  $gsap.fromTo(
    imageEl.value,
    {
      opacity: 0,
      scale: 1.02,
    },
    {
      opacity: 1,
      scale: 1,
      duration: 0.55,
      ease: 'power3.out',
    }
  );
});

onMounted(() => {
  nextTick(() => {
    initScrollAnimations();
  });
  // detect hover capability for desktop-only hover behavior
  if (typeof window !== 'undefined' && 'matchMedia' in window) {
    try {
      isHoverCapable.value = window.matchMedia('(hover: hover)').matches;
    } catch (_) {
      isHoverCapable.value = false;
    }
  }
  // click outside to close on mobile/desktop
  const onDocClick = (e) => {
    if (!showWorkTypeOverflow.value) return;
    const wrapper = workTypeOverflowWrapper.value;
    if (wrapper && !wrapper.contains(e.target)) {
      closeOverflow();
    }
  };
  document.addEventListener('click', onDocClick, true);
  document.addEventListener('touchstart', onDocClick, true);
});
</script>

<style scoped>
/* Scoped styles can be added here if needed */
</style>
