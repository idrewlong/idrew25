<template>
  <section ref="educationSection" class="max-w-6xl mx-auto px-6">
    <!-- Notion-style section label -->
    <div ref="labelEl" class="flex items-center gap-3 mb-10">
      <span class="text-[10px] font-bold tracking-[0.25em] uppercase text-stone-400">Education</span>
      <div class="flex-1 h-px bg-stone-200"></div>
    </div>

    <div ref="educationContainer" class="grid md:grid-cols-2 gap-6">
      <div
        v-for="education in educationList"
        :key="education.year"
        class="education-item relative flex flex-col bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm"
      >
        <!-- Top accent bar -->
        <div class="h-px w-full bg-gradient-to-r from-orange-300/60 via-orange-200/40 to-transparent"></div>

        <div class="flex flex-col flex-1 p-6">
          <!-- Header: degree + year badge -->
          <div class="flex items-start justify-between gap-4 mb-1">
            <div>
              <h2 class="text-2xl font-bold font-serif text-stone-900 leading-tight">
                {{ education.degree }}
              </h2>
              <p class="text-base text-orange-500 font-serif mt-0.5">{{ education.major }}</p>
            </div>
            <span
              class="shrink-0 mt-1 text-[11px] font-medium tabular-nums text-stone-400 bg-stone-100 px-2.5 py-1 rounded-full"
            >
              {{ education.year }}
            </span>
          </div>

          <!-- School name -->
          <p class="text-xs text-stone-400 tracking-wide mb-5 mt-1">{{ education.school }}</p>

          <!-- Divider -->
          <div class="h-px bg-stone-100 mb-5"></div>

          <!-- Achievements -->
          <ul class="flex flex-col gap-y-2.5 flex-1">
            <li
              v-for="(achievement, index) in education.achievements"
              :key="index"
              class="flex gap-3 items-start text-sm text-stone-500"
            >
              <span class="text-orange-400 shrink-0 leading-5">—</span>
              <span class="leading-relaxed">{{ achievement }}</span>
            </li>
          </ul>
        </div>

        <!-- Logo watermark -->
        <img
          v-if="education.logo"
          :src="education.logo"
          :alt="`${education.school} logo`"
          class="absolute bottom-5 right-5 w-10 h-10 object-contain opacity-20"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';

const { $gsap } = useNuxtApp();

const educationSection = ref(null);
const labelEl = ref(null);
const educationContainer = ref(null);

const educationList = [
  {
    degree: 'B.A',
    major: 'University Studies',
    achievements: [
      'Lyceum Scholar',
      'Lens Collective Program',
      "Chancellor's Leadership Class",
    ],
    school: 'University of Mississippi',
    year: '2022',
    logo: '/images/olemiss.png',
  },
  {
    degree: 'A.A',
    major: 'Pre-Engineering',
    achievements: ['Phi Theta Kappa President', 'Hall of Fame', 'NASA Scholar'],
    school: 'Mississippi Delta Community College',
    year: '2016',
    logo: '/images/mdcc.webp',
  },
];

onMounted(() => {
  nextTick(() => {
    if (!educationSection.value) return;

    $gsap.set(labelEl.value, { opacity: 0, y: 20 });

    const items = educationContainer.value?.querySelectorAll('.education-item');
    if (items?.length) $gsap.set(items, { opacity: 0, y: 30 });

    const tl = $gsap.timeline({
      scrollTrigger: {
        trigger: educationSection.value,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });

    tl.to(labelEl.value, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
    if (items?.length) {
      tl.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'expo.out',
        stagger: 0.15,
        clearProps: 'all',
      }, '-=0.2');
    }
  });
});
</script>
