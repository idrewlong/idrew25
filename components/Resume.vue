<template>
  <div ref="resumeContainer" class="container max-w-6xl mx-auto p-8">
    <div ref="headerSection" class="flex items-center mb-8">
      <h1 class="text-3xl font-bold font-serif text-stone-900">More About Me</h1>
      <div class="h-px hidden md:block bg-orange-400/50 w-32 ml-4"></div>
    </div>
    <div ref="tabsSection" class="mb-8 border-b border-stone-200">
      <nav class="-mb-px flex space-x-8" aria-label="Tabs">
        <button
          @click="activeTab = 'about'"
          :class="[
            'whitespace-nowrap py-4 px-1 border-b-2 text-sm tracking-wide transition-colors duration-200',
            activeTab === 'about'
              ? 'border-orange-500 text-stone-900'
              : 'border-transparent text-stone-400 hover:text-stone-700 hover:border-stone-300',
          ]"
        >
          About
        </button>
        <button
          @click="activeTab = 'skills'"
          :class="[
            'whitespace-nowrap py-4 px-1 border-b-2 text-sm tracking-wide transition-colors duration-200',
            activeTab === 'skills'
              ? 'border-orange-500 text-stone-900'
              : 'border-transparent text-stone-400 hover:text-stone-700 hover:border-stone-300',
          ]"
        >
          Skills
        </button>
        <button
          @click="activeTab = 'education'"
          :class="[
            'whitespace-nowrap py-4 px-1 border-b-2 text-sm tracking-wide transition-colors duration-200',
            activeTab === 'education'
              ? 'border-orange-500 text-stone-900'
              : 'border-transparent text-stone-400 hover:text-stone-700 hover:border-stone-300',
          ]"
        >
          Education
        </button>
      </nav>
    </div>
    <div ref="contentSection">
      <div v-if="activeTab === 'about'">
        <About />
      </div>
      <div v-if="activeTab === 'skills'">
        <Skills />
      </div>
      <div v-if="activeTab === 'education'">
        <Education />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import About from './About.vue';
import Skills from './Skills.vue';
import Education from './Education.vue';

const { $gsap } = useNuxtApp();

const activeTab = ref('about');

const resumeContainer = ref(null);
const headerSection = ref(null);
const tabsSection = ref(null);
const contentSection = ref(null);

const initScrollAnimations = () => {
  if (
    !resumeContainer.value ||
    !headerSection.value ||
    !tabsSection.value ||
    !contentSection.value
  )
    return;

  $gsap.set(headerSection.value, { opacity: 0, y: 30 });
  $gsap.set(tabsSection.value, { opacity: 0, y: 20 });
  $gsap.set(contentSection.value, { opacity: 0, y: 20 });

  const tl = $gsap.timeline({
    scrollTrigger: {
      trigger: resumeContainer.value,
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
  });

  tl.to(headerSection.value, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power2.out',
  })
    .to(
      tabsSection.value,
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
      },
      '-=0.6'
    )
    .to(
      contentSection.value,
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
      },
      '-=0.4'
    );
};

// Animate content when tab changes
watch(activeTab, () => {
  if (contentSection.value) {
    $gsap.fromTo(
      contentSection.value,
      {
        opacity: 0,
        y: 10,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power2.out',
      }
    );
  }
});

onMounted(() => {
  nextTick(initScrollAnimations);
});
</script>
