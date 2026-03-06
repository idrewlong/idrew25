<template>
	<div class="min-h-screen flex flex-col w-full">
		<Hero />
		<main
			class="w-full py-8 sm:py-12 flex flex-col justify-center gap-y-14 sm:gap-y-20"
		>
			<!-- <Stats /> -->
			<About />
			<Marquee />
			<Experience />

			<Skills />
			<!-- <Experience /> -->
			<Education />
			<div class="w-full">
				<Projects2 />
			</div>
			<Marquee :reverse="true" />
			<Articles />
			<Cta />
		</main>
	</div>
</template>

<script setup>
useSeoMeta({
	title: 'Full Stack Developer',
	description:
		'Andrew Long is a full stack developer with a passion for building tools, websites, apps, strategies and business solutions.',
	ogTitle: 'Full Stack Developer',
	ogDescription:
		'Andrew Long is a full stack developer with a passion for building tools, websites, apps, strategies and business solutions',
	ogImage: '/images/OG.webp',
	twitterCard: 'summary_large_image',
});
</script>
