// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
	devtools: { enabled: false },
	css: ['lenis/dist/lenis.css', '~/assets/css/main.css'],
	runtimeConfig: {
		public: {
			// Public by design: Web3Forms' free plan only accepts submissions
			// from the browser, so this key ships in the client bundle.
			web3formsAccessKey: process.env.NUXT_PUBLIC_WEB3FORMS_ACCESS_KEY,
		},
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

	// Pages set a static ogImage (/images/OG.webp), so the runtime OG image
	// renderer is dead weight -- it only pulls in a native renderer dependency.
	ogImage: { enabled: false },

	app: {
		pageTransition: { name: 'page', mode: 'out-in' },
	},

	vite: {
		plugins: [tailwindcss()],
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
		'/Andrew%20Long%20Resume.pdf': {
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
