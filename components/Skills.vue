<template>
  <div
    ref="skillsContainer"
    class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8"
  >
    <div
      v-for="(category, index) in skillCategories"
      :key="category.title"
      :ref="(el) => (skillCategories[index] = el)"
      class="skill-category"
    >
      <h3
        class="text-lg md:text-xl font-bold mb-2 pb-2 border-b-2 border-orange-400 inline-block"
      >
        {{ category.title }}
      </h3>
      <ul class="mt-4 space-y-2 text-sm md:text-base">
        <li v-for="skill in category.skills" :key="skill" class="text-gray-600">
          {{ skill }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const { $gsap, $ScrollTrigger } = useNuxtApp();

const skillsContainer = ref(null);
const skillCategoryRefs = ref([]);

const skillCategories = [
  {
    title: 'Frontend',
    skills: [
      'React/Next.js',
      'Vue/Nuxt.js',
      'Svelte/SvelteKit',
      'Tailwind',
      'GSAP',
      'WordPress',
      'Headless WordPress',
    ],
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
    title: 'Software',
    skills: [
      'Figma',
      'Adobe Suite',
      'Screaming Frog SEO Spider',
      'SEM Rush',
      'Google Analytics',
      'Google Search Console',
      'Google Tag Manager',
    ],
  },
];

onMounted(() => {
  nextTick(() => {
    const skillElements =
      skillsContainer.value.querySelectorAll('.skill-category');

    $gsap.fromTo(
      skillElements,
      {
        opacity: 0,
        y: 40,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: skillsContainer.value,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );
  });
});
</script>
