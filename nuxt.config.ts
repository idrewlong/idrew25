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

	fonts: {
		defaults: {
			fallbacks: {
				'serif': [],
				'sans-serif': [],
				'monospace': [],
			},
		},
	},

	modules: [
		'@nuxt/fonts',
		'@nuxt/icon',
		'@nuxt/image',
		'nuxt-gtag',
		'@nuxtjs/seo',
	],
	routeRules: {
		'/resume.pdf': {
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Disposition': 'attachment; filename="andrew-long-resume.pdf"',
				'X-Content-Type-Options': 'nosniff',
				'Cache-Control': 'no-store',
			},
		},
	},
	compatibilityDate: '2025-01-08',
});
