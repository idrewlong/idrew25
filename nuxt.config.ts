// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },
	css: ['~/assets/css/main.css'],
	// site: {
	// 	url: 'https://www.codeoxford.com',
	// 	name: 'Code Oxford',
	// 	defaultLocale: 'en',
	// 	trailingSlash: true,
	// },
	gtag: {
		id: '',
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
		domains: [''],
	},

	modules: ['@nuxt/fonts', '@nuxt/icon', '@nuxt/image', 'nuxt-gtag'],
});
