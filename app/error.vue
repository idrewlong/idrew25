<template>
	<div class="min-h-screen flex flex-col">
		<a href="#main" class="skip-link">Skip to content</a>
		<Header />
		<main id="main" tabindex="-1" class="grow">
			<PageHeader
				:index="`[ ${error.statusCode || 500} ]`"
				:kicker="notFound ? 'Page not found' : 'Error'"
				:title="notFound ? ['Lost', 'signal'] : ['Something', 'broke']"
				:lede="lede"
				:back="false"
			>
				<div class="err-actions">
					<button type="button" class="btn btn-solid" @click="goTo('/')">Back to home</button>
					<button type="button" class="btn btn-ghost" @click="goTo('/contact')">Contact me</button>
				</div>
			</PageHeader>
		</main>
		<Footer />
		<!-- The header's Ask AI button opens this panel -->
		<ClientOnly>
			<AssistantChat />
		</ClientOnly>
	</div>
</template>

<script setup>
import { computed } from 'vue';

// Replaces app.vue whenever a route 404s or a page throws, so it carries its
// own header and footer
const props = defineProps({
	error: { type: Object, required: true },
});

const notFound = computed(() => props.error.statusCode === 404);
const lede = computed(() =>
	notFound.value
		? "This page doesn't exist, or it moved. Head back home, or send me a note if a link here sent you to it."
		: 'Something went wrong loading this page. Try again from the home page, or let me know if it keeps happening.'
);

useHead({
	title: computed(() => (notFound.value ? 'Page not found' : 'Error') + ' | Andrew Long'),
	meta: [{ name: 'robots', content: 'noindex' }],
});

// clearError resets Nuxt's error state before navigating
const goTo = (path) => clearError({ redirect: path });
</script>

<style scoped>
.err-actions {
	display: flex;
	flex-wrap: wrap;
	gap: 0.75rem;
	margin-top: 2rem;
}
</style>
