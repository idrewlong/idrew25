<template>
  <div class="min-h-screen flex flex-col w-full">
    <Hero />
    <main class="w-full py-12 flex flex-col justify-center gap-y-16">
      <Resume />
      <Experience />
      <div class="w-full">
        <Projects />
      </div>
      <Articles />
      <Cta />
    </main>
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'Full Stack Developer',
  description:
    'Andrew Long is a full stack developer with a passion for building web applications and marketing strategies.',
  ogTitle: 'Full Stack Developer',
  ogDescription:
    'Andrew Long is a full stack developer with a passion for building web applications and marketing strategies.',
});
</script>
