<template>
  <!-- Decorative: the same stack is listed in Skills, so screen readers skip it -->
  <div class="marquee overflow-hidden py-4 border-y border-(--border) bg-(--bg)" aria-hidden="true">
    <div
      class="marquee-track flex items-center whitespace-nowrap"
      :class="reverse ? 'marquee-reverse' : 'marquee-forward'"
    >
      <div v-for="n in 2" :key="n" class="flex items-center gap-8 pr-8 shrink-0">
        <template v-for="item in items" :key="item">
          <span class="font-mono text-[11px] tracking-[0.22em] uppercase text-(--text-muted)">{{ item }}</span>
          <span class="w-1 h-1 bg-(--accent) shrink-0 inline-block"></span>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  reverse: { type: Boolean, default: false },
});

const items = [
  'Nuxt', 'Vue', 'React', 'Next.js', 'TypeScript', 'Tailwind', 'GSAP',
  'WordPress', 'GraphQL', 'PHP', 'Laravel', 'Node.js', 'Figma', 'SEO', 'Python',
];
</script>

<style scoped>
.marquee-track {
  width: max-content;
}

.marquee-forward {
  animation: scroll-ltr 35s linear infinite;
}

.marquee-reverse {
  animation: scroll-rtl 35s linear infinite;
}

@keyframes scroll-ltr {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

@keyframes scroll-rtl {
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0); }
}

/* Hover pauses it */
.marquee:hover .marquee-track {
  animation-play-state: paused;
}

@media (prefers-reduced-motion: reduce) {
  .marquee-forward,
  .marquee-reverse {
    animation: none;
  }
}
</style>
