<template>
  <p ref="aboutText" class="text-sm leading-relaxed text-gray-600">
    I've always been drawn to solving problems and building things that
    (sometimes) work. After high school, I attended Mississippi Delta Community
    College and then to Ole Miss for broadcast journalism, I found my groove
    shooting music videos for artists across Atlanta, Memphis, Nashville, and
    New Orleans. Turns out, pointing cameras at rappers was great training for
    my career.
    <br /><br />In 2022, a friend introduced me to programming, and I was
    hooked. No more "we'll fix it in post" – just clean code that either works
    or doesn't. I launched Finder's Guide to help businesses build websites and
    marketing funnels that don't suck, then landed at Mad Genius where I juggle
    everything from SEO to full stack development. I love building sites,
    full-stack applications, internal automations that save people's sanity, and
    SEO strategies that actually move the needle. My skill set covers a variety
    of areas, but I get particularly fired up about creating solutions that
    solve real business problems...not just pretty interfaces that look good in
    screenshots. <br /><br />Currently living in Long Beach, MS with my wife and
    our dog Bo, who's honestly the best coworker I've ever had. When I'm not
    coding, you'll find me shooting my Mamiya 645, getting lost in nature, or
    diving deep into family history because apparently I'm 30 going on 70. I'm
    an old soul.
  </p>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const { $gsap, $ScrollTrigger } = useNuxtApp();

const aboutText = ref(null);

onMounted(() => {
  nextTick(() => {
    $gsap.fromTo(
      aboutText.value,
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: aboutText.value,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );
  });
});
</script>
