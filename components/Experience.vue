<template>
  <section ref="expSection" class="max-w-6xl mx-auto px-6">
    <!-- Notion-style section label -->
    <div ref="labelEl" class="flex items-center gap-3 mb-12">
      <span class="text-[10px] font-bold tracking-[0.25em] uppercase text-stone-400">Experience</span>
      <div class="flex-1 h-px bg-stone-200"></div>
    </div>

    <!-- Timeline -->
    <div class="relative">
      <!-- Vertical line (draws on scroll) -->
      <div class="absolute left-2 top-5 bottom-5 w-px bg-stone-100">
        <div ref="timelineLine" class="w-full h-full bg-stone-300 origin-top"></div>
      </div>

      <!-- Experience items -->
      <div class="space-y-12 md:space-y-14">
        <div
          v-for="(exp, i) in experiences"
          :key="exp.company"
          :ref="(el) => { if (el) itemEls[i] = el }"
          class="flex gap-8 items-start"
        >
          <!-- Dot column -->
          <div class="w-4 shrink-0 pt-1 relative z-10">
            <div
              class="w-4 h-4 rounded-full bg-white border-2 border-stone-300 flex items-center justify-center"
            >
              <div class="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0 pb-2">
            <div class="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-6 mb-2">
              <h3 class="text-lg font-bold font-serif text-stone-900 leading-snug">
                {{ exp.title }}
                <span class="text-orange-500"> @ {{ exp.company }}</span>
              </h3>
              <span class="text-xs text-stone-400 font-medium tracking-wide md:ml-auto shrink-0">
                {{ exp.period }}
              </span>
            </div>
            <p class="text-sm text-stone-500 mb-4 leading-relaxed max-w-2xl">
              {{ exp.description }}
            </p>
            <ul class="space-y-2">
              <li
                v-for="(ach, j) in exp.achievements.slice(0, 2)"
                :key="j"
                class="flex gap-3 items-start text-sm text-stone-400"
              >
                <span class="text-orange-400 shrink-0 leading-5">—</span>
                <span class="leading-relaxed">{{ ach }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';

const { $gsap } = useNuxtApp();

const expSection = ref(null);
const labelEl = ref(null);
const timelineLine = ref(null);
const itemEls = ref([]);

const experiences = [
  {
    period: 'June 2024 – Present',
    title: 'SEO Developer',
    company: 'Mad Genius',
    description:
      'Full-stack web development using Nuxt, React, React Native, Laravel, WordPress, and more. Leading SEO initiatives and comprehensive digital marketing strategies for enterprise clients including Yates Construction, Regional Homes, and the Mississippi State Department of Health.',
    achievements: [
      'Develop and execute SEO and digital marketing strategies with in-depth audits covering web presence, AI integration, and social media optimization.',
      'Build and maintain WordPress sites, headless WordPress implementations with Nuxt, React Native mobile applications, and full-stack Laravel web applications.',
    ],
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
    ],
  },
  {
    period: 'September 2022 – December 2023',
    title: 'Marketing Project Manager',
    company: 'Finders Guide',
    description:
      'Led web development and digital marketing initiatives for multiple clients while managing remote teams and implementing comprehensive branding strategies.',
    achievements: [
      'Developed modern web solutions using React, Next.js, and Svelte.js while creating high-converting landing pages and implementing SEO strategies.',
      'Established complete branding strategies for diverse clients including construction, VFX, and manufacturing companies.',
    ],
  },
  {
    period: 'March 2022 – January 2023',
    title: 'Customer Support Specialist',
    company: 'Core Logic',
    description:
      'Provided expert software support and customer service while collaborating with development teams to enhance product features and user experience.',
    achievements: [
      'Maintained an exceptional 95% customer satisfaction score while providing specialized support for industry-specific software.',
      'Facilitated effective communication between customers and development teams using Jira and Salesforce in an agile SCRUM environment.',
    ],
  },
  {
    period: 'January 2018 – December 2020',
    title: 'Media Coordinator',
    company: 'LMC',
    description:
      'Managed end-to-end video production projects while coordinating content strategy and advertising campaigns for diverse clients.',
    achievements: [
      'Produced and edited over 100 media projects including music videos and commercials while ensuring consistent quality and client satisfaction.',
      'Orchestrated social media content management using Hootsuite to enhance consumer engagement while maintaining strict project schedules.',
    ],
  },
];

onMounted(() => {
  nextTick(() => {
    if (!expSection.value) return;

    // Draw timeline line on scroll
    $gsap.set(timelineLine.value, { scaleY: 0, transformOrigin: 'top center' });
    $gsap.to(timelineLine.value, {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: expSection.value,
        start: 'top center',
        end: 'bottom center',
        scrub: 0.5,
      },
    });

    // Animate section label
    $gsap.set(labelEl.value, { opacity: 0, y: 20 });
    $gsap.to(labelEl.value, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: expSection.value,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });

    // Animate each item individually as it enters view
    itemEls.value.filter(Boolean).forEach((el) => {
      $gsap.set(el, { opacity: 0, x: 20 });
      $gsap.to(el, {
        opacity: 1,
        x: 0,
        duration: 0.6,
        ease: 'power3.out',
        clearProps: 'all',
        scrollTrigger: {
          trigger: el,
          start: 'top 87%',
          toggleActions: 'play none none none',
        },
      });
    });
  });
});
</script>
