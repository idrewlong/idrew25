<template>
	<div class="min-h-screen flex flex-col">
		<Preloader v-if="showPreloader" @done="showPreloader = false" />
		<Header />
		<main class="flex-grow">
			<NuxtPage />
		</main>
		<Footer />
		<ScrollToTop />
	</div>
</template>

<script setup>
const showPreloader = ref(true);
</script>

<style>
.page-enter-active,
.page-leave-active {
	transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
	opacity: 0;
	filter: blur(1rem);
}
</style>
