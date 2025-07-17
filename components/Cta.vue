<template>
  <div ref="ctaSection" class="">
    <div
      class="container max-w-6xl mx-auto px-4 md:px-8 py-16 sm:py-24 text-center md:text-left"
    >
      <div
        ref="header"
        class="flex items-center justify-center md:justify-start mb-4"
      >
        <h2 class="text-3xl font-bold text-black">Let's Work Together</h2>
        <div class="h-1 hidden md:block bg-orange-400 w-32 ml-4"></div>
      </div>
      <p
        ref="description"
        class="text-lg text-gray-600 mb-8 max-w-3xl mx-auto md:mx-0"
      >
        I'm always looking for new projects and opportunities. If you have a
        project in mind or just want to say hello, feel free to reach out. Let's
        create something amazing together!
      </p>
      <div ref="button">
        <NuxtLink
          to="/contact"
          class="inline-block bg-orange-500 text-white font-bold py-4 px-8 rounded-lg hover:bg-orange-600 transition-colors text-lg"
        >
          Get in Touch
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';

const { $gsap, $ScrollTrigger } = useNuxtApp();

const ctaSection = ref(null);
const header = ref(null);
const description = ref(null);
const button = ref(null);

const initScrollAnimations = () => {
  if (
    !ctaSection.value ||
    !header.value ||
    !description.value ||
    !button.value
  ) {
    return;
  }

  const elements = [header.value, description.value, button.value];

  // Set initial states
  $gsap.set(elements, {
    opacity: 0,
    y: 30,
  });

  // Create a timeline for the animation
  const tl = $gsap.timeline({
    scrollTrigger: {
      trigger: ctaSection.value,
      start: 'top 60%',
      toggleActions: 'play none none none',
    },
  });

  tl.to(elements, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'expo.out',
    stagger: 0.2,
    clearProps: 'all',
  });
};

onMounted(() => {
  nextTick(initScrollAnimations);
});
</script>
