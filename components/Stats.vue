<template>
  <section ref="statsSection" class="max-w-6xl mx-auto px-6">
    <div
      class="grid grid-cols-3 divide-x divide-stone-200 border border-stone-200 rounded-2xl bg-white overflow-hidden shadow-sm"
    >
      <div
        v-for="(stat, i) in stats"
        :key="stat.label"
        class="stat-item flex flex-col items-center justify-center text-center py-10 px-4 md:py-14"
      >
        <span
          class="text-[10px] font-bold tracking-[0.25em] uppercase text-stone-400 mb-4"
        >
          {{ stat.label }}
        </span>
        <div class="flex items-baseline gap-0.5">
          <span
            :ref="(el) => { if (el) counterEls[i] = el }"
            class="text-5xl md:text-6xl font-bold font-serif text-stone-900 tabular-nums"
          >0</span>
          <span class="text-3xl md:text-4xl font-bold font-serif text-orange-500">{{ stat.suffix }}</span>
        </div>
        <span class="text-xs text-stone-400 mt-3">{{ stat.sub }}</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';

const { $gsap } = useNuxtApp();

const statsSection = ref(null);
const counterEls = ref([]);

const stats = [
  { label: 'Years Building', target: 3, suffix: '+', sub: 'web & marketing' },
  { label: 'Sites Shipped', target: 50, suffix: '+', sub: 'across all clients' },
  { label: 'Happy Clients', target: 10, suffix: '+', sub: 'and counting' },
];

onMounted(() => {
  nextTick(() => {
    if (!statsSection.value) return;

    const items = statsSection.value.querySelectorAll('.stat-item');
    $gsap.set(items, { opacity: 0, y: 24 });

    $gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power3.out',
      clearProps: 'all',
      scrollTrigger: {
        trigger: statsSection.value,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });

    stats.forEach((stat, i) => {
      const counter = { val: 0 };
      $gsap.to(counter, {
        val: stat.target,
        duration: 1.8,
        ease: 'power2.out',
        delay: i * 0.12,
        onUpdate() {
          const el = counterEls.value[i];
          if (el) el.textContent = Math.round(counter.val);
        },
        scrollTrigger: {
          trigger: statsSection.value,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      });
    });
  });
});
</script>
