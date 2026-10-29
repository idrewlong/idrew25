<template>
	<div class="min-h-screen flex flex-col w-full">
		<Hero />
		<WordTicker />
		<div
			class="w-full pt-24 sm:pt-32 pb-16 sm:pb-24 flex flex-col justify-center gap-y-24 sm:gap-y-32"
		>
			<About />
			<Focus />
			<LaunchSequence />
			<Experience />
			<Certs />
			<Skills />
			<div class="w-full">
				<Projects2 />
			</div>
			<Education />
			<NowShipping />
			<Marquee :reverse="true" />
			<Cta />
		</div>
	</div>
</template>

<script setup>
const description =
	'Andrew Long is a senior full stack developer at Mad Genius, building web apps, APIs, AI tooling and headless sites with TypeScript, Go and AWS.';

useSeoMeta({
	title: 'Full Stack Developer',
	description,
	ogTitle: 'Andrew Long | Senior Full Stack Developer',
	ogDescription: description,
	ogType: 'website',
	// A 10s loop of the hero. iMessage, Discord, Slack and Telegram play it
	// in the link preview; everywhere else shows the og:image from app.vue.
	ogVideo: 'https://www.idrewlong.com/og/andrew-long.mp4',
	ogVideoSecureUrl: 'https://www.idrewlong.com/og/andrew-long.mp4',
	ogVideoType: 'video/mp4',
	ogVideoWidth: 1200,
	ogVideoHeight: 630,
});
</script>
