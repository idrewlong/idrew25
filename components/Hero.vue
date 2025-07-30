<template>
  <div
    class="container mx-auto px-4 md:px-8 pt-8 mb-16 sm:pt-24 sm:mb-24 max-w-7xl"
  >
    <section
      ref="heroSection"
      class="relative bg-gradient-to-br from-orange-400 via-orange-500 to-orange-400 rounded-2xl overflow-hidden flex flex-col sm:flex-row justify-center items-center w-full shadow-2xl"
    >
      <!-- Background decorative elements -->
      <div class="absolute inset-0 overflow-hidden">
        <div
          class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)]"
        ></div>
        <div
          class="absolute inset-0 bg-[linear-gradient(45deg,transparent_0%,rgba(255,255,255,0.05)_50%,transparent_100%)]"
        ></div>
      </div>

      <!-- Content -->
      <div
        class="relative p-8 sm:p-12 flex flex-1 flex-col gap-y-6 sm:gap-y-8 self-start sm:self-end max-w-2xl"
      >
        <div class="flex flex-col gap-y-1 sm:gap-y-2">
          <div
            ref="greeting"
            class="text-lg sm:text-xl font-medium text-gray-100 tracking-wide"
          >
            Hi, I'm Andrew
          </div>
          <h1
            ref="title"
            class="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight"
          >
            I like to build
            <span
              class="text-transparent bg-clip-text bg-gradient-to-r from-orange-200 to-white"
            >
              amazing <span class="typewriter">{{ currentWord }}</span>
            </span>
          </h1>
        </div>
        <p
          ref="description"
          class="text-base sm:text-lg text-gray-100 leading-relaxed max-w-xl"
        >
          TypeScript connoisseur. AI nerd. Animation aficionado. Fullstack web,
          mostly React, Svelte, Next or Nuxt. Backend with Lavarel, Node.js, and
          PHP. Have written a Python bot or two.
        </p>
        <div ref="buttons" class="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <NuxtLink
            to="/contact"
            class="inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-white text-orange-600 font-medium hover:bg-gray-100 transition-colors duration-300 text-sm sm:text-base"
          >
            Let's work
            <Icon
              name="heroicons:arrow-right"
              class="w-4 h-4 sm:w-5 sm:h-5 ml-2"
              aria-hidden="true"
            />
          </NuxtLink>
          <NuxtLink
            to="#projects"
            @click.prevent="scrollToProjects"
            class="inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg border border-white/20 text-white font-medium hover:bg-white/10 transition-colors duration-300 text-sm sm:text-base"
          >
            View Projects
          </NuxtLink>
        </div>
      </div>

      <!-- Tech Icons and Image -->
      <div ref="imageContainer" class="relative flex-shrink-0 mt-8 sm:mt-0">
        <div
          class="relative flex justify-end items-end"
          style="width: 450px; height: 450px"
        >
          <TechIcons :scroll="scrollPosition" />
          <div
            class="relative mt-12 transform hover:scale-105 transition-transform duration-500"
            style="height: 475px; width: 335px"
          >
            <img
              v-if="!isClient"
              :src="images[0]"
              alt="Andrew's photo"
              class="relative z-10 w-full h-full"
              loading="lazy"
            />
            <ClientOnly>
              <img
                v-for="(image, index) in images"
                :key="index"
                :src="image"
                alt="Andrew's photo"
                :class="[
                  'absolute top-0 left-0 w-full h-full z-10 smooth-image',
                  { 'opacity-0': image !== currentImage },
                ]"
                style="height: 475px; width: 335px; top: 64px"
                loading="lazy"
              />
            </ClientOnly>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';

const { $gsap } = useNuxtApp();

const scrollPosition = ref(0);
const isClient = ref(false);
const currentImage = ref('');
const currentWord = ref('');
const words = ['sites', 'apps', 'bots'];
let currentWordIndex = 0;
const images = ['/images/me_1.png', '/images/me_3.png'];
let imageTransitioning = false;
let imageInterval;
let typewriterTimeout;

// Template refs
const heroSection = ref(null);
const greeting = ref(null);
const title = ref(null);
const description = ref(null);
const buttons = ref(null);
const imageContainer = ref(null);

// Typewriter state
let wordIndex = 0;
let letterIndex = 0;
let isDeleting = false;

const typewriterEffect = () => {
  const currentTargetWord = words[wordIndex];
  let newWord = '';
  let delay = 100;

  if (isDeleting) {
    newWord = currentTargetWord.substring(0, letterIndex - 1);
    letterIndex--;
    delay = 100; // Slower deletion
  } else {
    newWord = currentTargetWord.substring(0, letterIndex + 1);
    letterIndex++;
    delay = 75; // Typing speed
  }

  currentWord.value = newWord;

  if (!isDeleting && newWord === currentTargetWord) {
    // Word typed, pause, then start deleting
    isDeleting = true;
    delay = 2500;
  } else if (isDeleting && newWord === '') {
    // Word deleted, pause, then start next word
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    letterIndex = 0;
    delay = 500;
  }

  typewriterTimeout = setTimeout(typewriterEffect, delay);
};

const scrollToProjects = () => {
  const projectsSection = document.getElementById('projects');
  if (projectsSection) {
    projectsSection.scrollIntoView({ behavior: 'smooth' });
  }
};

const updateScroll = () => {
  requestAnimationFrame(() => {
    scrollPosition.value = window.scrollY / 1000;
  });
};

const changeImage = () => {
  if (imageTransitioning) return;
  imageTransitioning = true;
  currentImage.value = currentImage.value === images[0] ? images[1] : images[0];
  setTimeout(() => {
    imageTransitioning = false;
  }, 2000); // Aligned with CSS transition for a smoother effect
};

const initAnimations = () => {
  // Set initial states
  $gsap.set([greeting.value, title.value, description.value, buttons.value], {
    opacity: 0,
    y: 30,
  });

  $gsap.set(imageContainer.value, {
    opacity: 0,
    scale: 0.9,
  });

  // Create timeline for entrance animations
  const tl = $gsap.timeline();

  tl.to(greeting.value, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power2.out',
  })
    .to(
      title.value,
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
      },
      '-=0.6'
    )
    .to(
      description.value,
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
      },
      '-=0.6'
    )
    .to(
      buttons.value,
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
      },
      '-=0.6'
    )
    .to(
      imageContainer.value,
      {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'power2.out',
      },
      '-=0.8'
    );
};

onMounted(() => {
  // Set up scroll listener with throttling
  window.addEventListener('scroll', updateScroll, { passive: true });

  // Preload images
  images.forEach((src) => {
    const img = new Image();
    img.src = src;
    img.decode().catch(() => {});
  });

  // Initialize current image and word
  isClient.value = true;
  currentImage.value = images[0];
  typewriterEffect(); // Start typewriter

  // Set up image rotation only
  imageInterval = setInterval(changeImage, 4000);

  // Initialize GSAP animations
  nextTick(() => {
    initAnimations();
  });
});

onUnmounted(() => {
  window.removeEventListener('scroll', updateScroll);
  if (imageInterval) clearInterval(imageInterval);
  if (typewriterTimeout) clearTimeout(typewriterTimeout);
});
</script>

<style scoped>
.smooth-image {
  transform: translate(0, 0);
  transform: translateZ(0);
  -webkit-transform: translate3d(0, 0, 0);
  transition: opacity 2s cubic-bezier(0.4, 0, 0.2, 1);
  backface-visibility: hidden;
  will-change: opacity;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  image-rendering: -webkit-optimize-contrast;
}

.word-transition {
  display: inline-block;
  transition: all 0.5s ease;
  opacity: 1;
  transform: translateY(0);
  position: relative;
  min-width: 60px; /* Ensure space for the words */
}

.word-transition.changing {
  opacity: 0;
  transform: translateY(20px);
}

/* Prevent flickering in Webkit browsers */
@media not all and (min-resolution: 0.001dpcm) {
  @supports (-webkit-appearance: none) {
    .smooth-image {
      -webkit-transform: translate3d(0, 0, 0);
    }
  }
}

/* Improve performance in Firefox */
@-moz-document url-prefix() {
  .smooth-image {
    transform: translate(0, 0);
    transform: translate3d(0, 0, 0);
  }
}

.typewriter {
  display: inline-block;
  min-width: 80px;
  border-right: 2px solid white;
  padding-right: 4px;
  animation: blink 0.75s step-end infinite;
}

@keyframes blink {
  from,
  to {
    border-color: transparent;
  }
  50% {
    border-color: white;
  }
}
</style>
