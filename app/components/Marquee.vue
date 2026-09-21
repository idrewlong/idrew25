<template>
  <div class="overflow-hidden py-4 border-y border-stone-200 bg-stone-50/60">
    <div
      class="marquee-track flex items-center whitespace-nowrap"
      :class="reverse ? 'marquee-reverse' : 'marquee-forward'"
    >
      <div v-for="n in 2" :key="n" class="flex items-center gap-8 pr-8 shrink-0">
        <template v-for="item in items" :key="item">
          <span class="text-[11px] font-bold tracking-[0.22em] uppercase text-stone-400">{{ item }}</span>
          <span class="w-1 h-1 rounded-full bg-orange-300 shrink-0 inline-block"></span>
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
</style>
