// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: false },
	css: ['~/assets/css/main.css'],
	runtimeConfig: {
		ACCESS_KEY: process.env.ACCESS_KEY,
	},
	site: {
		url: 'https://www.idrewlong.com',
		name: 'Andrew Long',
		defaultLocale: 'en',
		trailingSlash: true,
	},
	gtag: {
		id: 'G-J7YM70XLHW',
	},

	app: {
		pageTransition: { name: 'page', mode: 'out-in' },
	},

	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {},
		},
	},

	image: {
		format: ['webp'],
		domains: ['www.idrewlong.com'],
	},

	modules: [
		'@nuxt/fonts',
		'@nuxt/icon',
		'@nuxt/image',
		'nuxt-gtag',
		'@nuxtjs/seo',
	],
	compatibilityDate: '2025-01-08',
});
