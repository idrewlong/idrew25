<template>
  <section ref="aboutSection" class="max-w-6xl mx-auto px-6">
    <!-- Notion-style section label -->
    <div ref="labelEl" class="flex items-center gap-3 mb-10">
      <span class="text-[10px] font-bold tracking-[0.25em] uppercase text-stone-400">About</span>
      <div class="flex-1 h-px bg-stone-200"></div>
    </div>

    <!-- Pull quote -->
    <blockquote
      ref="quoteEl"
      class="text-3xl md:text-4xl lg:text-5xl font-serif italic text-stone-900 leading-tight mb-12 max-w-4xl"
    >
      "I've always been drawn to solving problems and building things that
      <span class="text-orange-500 not-italic">actually work.</span>"
    </blockquote>

    <!-- Bio -->
    <p ref="bioEl" class="text-sm md:text-base leading-relaxed text-stone-500 max-w-3xl">
      After high school, I attended Mississippi Delta Community College and then
      Ole Miss for broadcast journalism, finding my groove shooting music videos
      for artists across Atlanta, Memphis, Nashville, and New Orleans. Turns out,
      pointing cameras at rappers was great training for my actual career.
      <br /><br />
      In 2022, a friend introduced me to programming and I was hooked. No more
      "we'll fix it in post" — just clean code that either works or doesn't. I
      launched Finder's Guide to help businesses build websites and marketing
      funnels that don't suck, then landed at Mad Genius where I juggle
      everything from SEO to full-stack development.
      <br /><br />
      Currently living in Long Beach, MS with my wife and our dog Bo. When I'm
      not coding, you'll find me shooting my Mamiya 645, getting lost in nature,
      or diving deep into family history. I'm an old soul.
    </p>
  </section>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';

const { $gsap } = useNuxtApp();

const aboutSection = ref(null);
const labelEl = ref(null);
const quoteEl = ref(null);
const bioEl = ref(null);

onMounted(() => {
  nextTick(() => {
    if (!aboutSection.value) return;

    $gsap.set([labelEl.value, quoteEl.value, bioEl.value], { opacity: 0, y: 30 });

    const tl = $gsap.timeline({
      scrollTrigger: {
        trigger: aboutSection.value,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    tl.to(labelEl.value, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
      .to(quoteEl.value, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }, '-=0.4')
      .to(bioEl.value, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', clearProps: 'all' }, '-=0.5');
  });
});
</script>
