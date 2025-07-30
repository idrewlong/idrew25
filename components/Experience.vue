<template>
  <section ref="experienceSection" class="max-w-6xl mx-auto p-6">
    <h1 ref="title" class="text-3xl font-bold mb-2">Experience & Projects</h1>
    <p ref="subtitle" class="text-gray-600 mb-8">
      My work history. From creating marketing strategies to slinging code.
    </p>

    <div class="flex flex-col md:flex-row gap-y-8 md:gap-x-12">
      <!-- Left sticky navigation -->
      <div ref="navigation" class="w-full md:w-1/4 md:sticky top-20 h-full">
        <ul
          class="flex flex-row flex-wrap items-center gap-x-4 gap-y-1 md:flex-col md:items-stretch md:gap-0 md:space-y-4"
        >
          <li
            v-for="(experience, index) in experiences"
            :key="index"
            :class="[
              'border-b-4 md:border-l-4 md:border-b-0 transition-colors duration-200 whitespace-nowrap',
              selectedIndex === index
                ? 'border-orange-400'
                : 'border-transparent',
            ]"
          >
            <button
              @click="selectExperience(index)"
              :class="[
                'w-full text-left py-2 px-2 md:px-4',
                selectedIndex === index
                  ? 'text-black'
                  : 'text-gray-500 hover:text-black',
              ]"
            >
              {{ experience.company }}
            </button>
          </li>
        </ul>
      </div>

      <!-- Right content -->
      <div class="w-full md:w-3/4" ref="contentContainer">
        <div
          v-if="selectedExperience"
          class="flex flex-col-reverse md:flex-row gap-8 items-start"
        >
          <div class="flex-grow space-y-4">
            <div>
              <div class="text-xs text-black-light font-medium">
                {{ selectedExperience.period }}
              </div>
              <div class="text-lg font-bold">
                {{ selectedExperience.title }} @
                <span class="text-orange-400">{{
                  selectedExperience.company
                }}</span>
              </div>
            </div>
            <div class="text-sm text-gray-600">
              {{ selectedExperience.description }}
            </div>
            <ul class="text-sm text-gray-600 flex flex-col gap-y-1.5">
              <li
                v-for="(achievement, index) in selectedExperience.achievements"
                :key="index"
                class="flex gap-x-2 items-start"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  fill="currentColor"
                  class="w-3.5 h-3.5 pt-1.5 shrink-0"
                >
                  <path
                    d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"
                  />
                </svg>
                <span>{{ achievement }}</span>
              </li>
            </ul>
          </div>
          <div class="hidden md:block flex-shrink-0 self-center md:self-auto">
            <img
              v-if="selectedExperience.logo"
              :src="selectedExperience.logo"
              :alt="`${selectedExperience.company} logo`"
              :class="[
                'w-24 h-24 object-contain',
                selectedExperience.company === 'Finders Guide'
                  ? 'scale-75'
                  : '',
              ]"
              width="96"
              height="96"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch, computed, onMounted, nextTick } from 'vue';

const { $gsap, $ScrollTrigger } = useNuxtApp();

const experiences = [
  {
    period: 'June 2024 – Present',
    title: 'SEO Developer',
    company: 'Mad Genius',
    description:
      'Full-stack web development using Nuxt, React, React Native, Laravel, WordPress, and more. Leading SEO initiatives and comprehensive digital marketing strategies for enterprise clients including Yates Construction, Regional Homes, and the Mississippi State Department of Health.',
    achievements: [
      'Develop and execute SEO and digital marketing strategies with in-depth audits covering web presence, AI integration, and social media optimization including YouTube SEO.',
      'Build and maintain WordPress sites, headless WordPress implementations with Nuxt, React Native mobile applications, and full-stack Laravel web applications.',
      'Work fluently between multiple teams to properly implement development standards and SEO content across all client projects.',
      'Design and build various internal tools including web crawlers and automation scripts to streamline SEO analysis and reporting processes.',
    ],
    logo: '/images/madg.png',
  },
  {
    period: 'December 2023 – June 2024',
    title: 'Marketing Project Manager',
    company: 'Thompson Machinery',
    description:
      'Led comprehensive marketing and data initiatives across multiple divisions while managing a small team and developing technical solutions.',
    achievements: [
      'Spearheaded multi-channel advertising campaigns including email, PPC, and social media while building custom landing pages using Next.js, TailwindCSS, and WordPress.',
      'Developed internal tools and automation using Microsoft Power Apps, .NET/C#, and Microsoft Dynamics to streamline workflows and customer journeys.',
      'Created data visualization solutions with Power BI and MySQL databases to track sales metrics and market share, while implementing SEO strategies using Google Analytics and Semrush.',
    ],
    logo: '/images/thompson.png',
  },
  {
    period: 'September 2022 – December 2023',
    title: 'Marketing Project Manager',
    company: 'Finders Guide',
    description:
      'Led web development and digital marketing initiatives for multiple clients while managing remote teams and implementing comprehensive branding strategies.',
    achievements: [
      'Developed modern web solutions using React, Next.js, and Svelte.js while creating high-converting landing pages and implementing SEO strategies to expand client market reach.',
      'Established complete branding strategies for diverse clients including construction, VFX, and manufacturing companies while optimizing their business processes and data utilization.',
    ],
    logo: '/images/g2.png',
  },
  {
    period: 'March 2022 – January 2023',
    title: 'Customer Support Specialist',
    company: 'Core Logic',
    description:
      'Provided expert software support and customer service while collaborating with development teams to enhance product features and user experience.',
    achievements: [
      'Maintained an exceptional 95% customer satisfaction score while providing specialized support for industry-specific software including DASH, Pro-Assist, and Xactimate',
      'Facilitated effective communication between customers and development teams using Jira and Salesforce while working in an agile SCRUM environment',
    ],
    logo: '/images/corelogic.webp',
  },
  {
    period: 'January 2018 – December 2020',
    title: 'Media Coordinator',
    company: 'LMC',
    description:
      'Managed end-to-end video production projects while coordinating content strategy and advertising campaigns for diverse clients including artists and businesses.',
    achievements: [
      'Produced and edited over 100 media projects including music videos and commercials while ensuring consistent quality and client satisfaction throughout the creative process',
      'Orchestrated social media content management using Hootsuite to enhance consumer engagement while maintaining strict project schedules and deadlines',
    ],
    logo: '/images/IDLOGO.png',
  },
];

const selectedIndex = ref(0);
const contentContainer = ref(null);
const experienceSection = ref(null);
const title = ref(null);
const subtitle = ref(null);
const navigation = ref(null);

const selectedExperience = computed(() => experiences[selectedIndex.value]);

const selectExperience = (index) => {
  selectedIndex.value = index;
};

const initScrollAnimations = () => {
  if (
    !experienceSection.value ||
    !title.value ||
    !subtitle.value ||
    !navigation.value ||
    !contentContainer.value
  )
    return;

  $gsap.set([title.value, subtitle.value], { opacity: 0, y: 30 });
  $gsap.set(navigation.value, { opacity: 0, x: -30 });
  $gsap.set(contentContainer.value, { opacity: 0, x: 30 });

  const tl = $gsap.timeline({
    scrollTrigger: {
      trigger: experienceSection.value,
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
  });

  tl.to([title.value, subtitle.value], {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power2.out',
    stagger: 0.2,
  })
    .to(
      navigation.value,
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power2.out',
      },
      '-=0.6'
    )
    .to(
      contentContainer.value,
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power2.out',
      },
      '<'
    );
};

watch(selectedExperience, () => {
  if (contentContainer.value) {
    $gsap.fromTo(
      contentContainer.value,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
    );
  }
});

onMounted(() => {
  nextTick(initScrollAnimations);
});
</script>
