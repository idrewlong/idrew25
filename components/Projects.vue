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
      <div class="grid md:grid-cols-5 gap-8 items-center">
        <!-- Left Column: Text, Counter, Thumbnails -->
        <div ref="leftColumn" class="md:col-span-2">
          <div class="flex items-center gap-4 mb-4 text-sm text-white">
            <div class="w-8 h-px bg-white"></div>
            <span
              >{{ String(activeIndex + 1).padStart(2, '0') }} /
              {{ String(projects.length).padStart(2, '0') }}</span
            >
          </div>

          <a :href="activeProject.link" target="_blank" class="block mb-4">
            <h2
              ref="titleEl"
              class="text-3xl font-bold text-white hover:text-orange-100 transition-colors duration-300 inline-flex items-center gap-2"
            >
              {{ activeProject.title }}
              <Icon icon="heroicons:arrow-right-20-solid" class="w-5 h-5" />
            </h2>
          </a>
          <p class="text-white mb-8" ref="descriptionEl">
            {{ activeProject.description }}
          </p>

          <div
            ref="techIconsEl"
            v-if="activeProject.technologies"
            class="flex flex-wrap gap-3 mb-8"
          >
            <Icon
              v-for="tech in activeProject.technologies"
              :key="tech"
              :icon="tech"
              class="w-8 h-8 text-white"
            />
          </div>

          <div ref="buttonsEl" class="flex gap-2">
            <button
              @click="prevSlide"
              class="bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full p-2 transition"
            >
              <Icon icon="heroicons:arrow-left-20-solid" class="w-5 h-5" />
            </button>
            <button
              @click="nextSlide"
              class="bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full p-2 transition"
            >
              <Icon icon="heroicons:arrow-right-20-solid" class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Right Column: Image -->
        <div ref="rightColumn" class="md:col-span-3">
          <div
            class="relative rounded-lg overflow-hidden border border-gray-200 w-full h-0 pb-[56.25%]"
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
import { ref, computed, onMounted, watch } from 'vue';
import { Icon } from '@iconify/vue';

const { $gsap, $ScrollTrigger } = useNuxtApp();

const projects = [
  {
    title: 'Mad Genius - 5.0',
    description:
      'High-performance charting library for React Native powered by Reanimated, Skia, Gesture Handler, and D3.',
    image: '/images/madgcover.png',
    link: 'https://madg.com/',
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
      'A Raycast extension for running Open Source Intelligence checks on a domain.',
    image: '/images/Yates.png',
    link: 'https://wgyates.com/',
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
      'A type and runtime safe query builder for the GROQ query language.',
    image: '/images/Regional.png',
    link: 'https://regionalhomes.net/',
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
    description: 'A screen recording app built with web technologies.',
    image: '/images/EGH.png',
    link: 'https://eleyguildhardy.com/',
    technologies: [
      'logos:wordpress-icon',
      'logos:tailwindcss-icon',
      'logos:wpengine',
    ],
  },
  {
    title: "Lusco's Restaurant",
    description: 'An interactive Mandelbrot set explorer built with WebGL.',
    image: '/images/luscos.png',
    link: 'https://luscos.restaurant/',
    technologies: [
      'logos:nuxt-icon',
      'logos:tailwindcss-icon',
      'logos:wordpress-icon',
      'logos:graphql',
      'logos:wpengine',
    ],
  },
  {
    title: 'React Native Zephyr',
    description: 'A design system and component library for React Native.',
    image: '/images/fat8.jpg',
    link: '#',
    technologies: ['logos:react', 'logos:typescript-icon'],
  },
];

const activeIndex = ref(0);
const activeProject = computed(() => projects[activeIndex.value]);

const projectsSection = ref(null);
const leftColumn = ref(null);
const rightColumn = ref(null);
const titleEl = ref(null);
const descriptionEl = ref(null);
const imageEl = ref(null);
const techIconsEl = ref(null);
const buttonsEl = ref(null);

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
  const textElements = [
    titleEl.value,
    descriptionEl.value,
    techIconsEl.value,
  ].filter(Boolean);

  $gsap.fromTo(
    textElements,
    { opacity: 0, y: 10 },
    {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power3.out',
      stagger: 0.1,
    }
  );

  $gsap.fromTo(
    imageEl.value,
    {
      opacity: 0,
      scale: 1.05,
    },
    {
      opacity: 1,
      scale: 1,
      duration: 0.7,
      ease: 'power3.out',
    }
  );
});

onMounted(() => {
  nextTick(() => {
    initScrollAnimations();
  });
});
</script>

<style scoped>
/* Scoped styles can be added here if needed */
</style>
