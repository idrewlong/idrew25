<template>
  <section ref="skillsSection" class="max-w-6xl mx-auto px-6">
    <!-- Notion-style section label -->
    <div ref="labelEl" class="flex items-center gap-3 mb-10">
      <span class="text-[10px] font-bold tracking-[0.25em] uppercase text-stone-400">Skills</span>
      <div class="flex-1 h-px bg-stone-200"></div>
    </div>

    <!-- Notion properties table -->
    <div class="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
      <div
        v-for="(category, i) in skillCategories"
        :key="category.title"
        :ref="(el) => { if (el) rowEls[i] = el }"
        class="flex items-start border-b border-stone-100 last:border-b-0"
      >
        <!-- Property label -->
        <div
          class="w-32 md:w-44 shrink-0 px-5 py-4 border-r border-stone-100 bg-stone-50/60 self-stretch flex items-start"
        >
          <span class="text-[10px] font-bold tracking-[0.2em] uppercase text-stone-400 pt-0.5">
            {{ category.title }}
          </span>
        </div>
        <!-- Skills value -->
        <div class="flex flex-wrap items-center gap-x-0 gap-y-0.5 px-5 py-4">
          <span
            v-for="(skill, j) in category.skills"
            :key="skill"
            class="text-sm text-stone-600"
          >{{ skill }}<span v-if="j < category.skills.length - 1" class="text-stone-300 mx-2">·</span></span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';

const { $gsap } = useNuxtApp();

const skillsSection = ref(null);
const labelEl = ref(null);
const rowEls = ref([]);

const skillCategories = [
  {
    title: 'Frontend',
    skills: ['React / Next.js', 'Vue / Nuxt.js', 'Svelte / SvelteKit', 'Tailwind CSS', 'GSAP', 'WordPress', 'Headless CMS'],
  },
  {
    title: 'Backend',
    skills: ['PHP', 'Laravel', 'Node.js', 'GraphQL', 'Golang', 'WP REST API'],
  },
  {
    title: 'Dev-Ops',
    skills: ['Docker', 'CI/CD', 'Git', 'Digital Ocean', 'Vercel'],
  },
  {
    title: 'Data',
    skills: ['Python', 'Pandas', 'NumPy', 'MySQL', 'PostgreSQL'],
  },
  {
    title: 'Design & SEO',
    skills: ['Figma', 'Adobe Suite', 'Screaming Frog', 'SEM Rush', 'Google Analytics', 'Google Search Console', 'Google Tag Manager'],
  },
];

onMounted(() => {
  nextTick(() => {
    if (!skillsSection.value) return;

    $gsap.set(labelEl.value, { opacity: 0, y: 20 });
    $gsap.set(rowEls.value.filter(Boolean), { opacity: 0, x: -16 });

    const tl = $gsap.timeline({
      scrollTrigger: {
        trigger: skillsSection.value,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    tl.to(labelEl.value, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' })
      .to(rowEls.value.filter(Boolean), {
        opacity: 1,
        x: 0,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.07,
        clearProps: 'all',
      }, '-=0.2');
  });
});
</script>
