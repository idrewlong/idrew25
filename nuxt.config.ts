// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
	devtools: { enabled: false },
	css: ['lenis/dist/lenis.css', '~/assets/css/main.css'],
	runtimeConfig: {
		sanity: {
			projectId: process.env.SANITY_PROJECT_ID,
			dataset: process.env.SANITY_DATASET,
			apiVersion: process.env.SANITY_API_VERSION,
			readToken: process.env.SANITY_READ_TOKEN,
		},
		previewSecret: process.env.BLOG_PREVIEW_SECRET,
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
		'/blog/**': { isr: 60 },
		'/preview/**': {
			headers: { 'X-Robots-Tag': 'noindex, nofollow' },
		},
	},
	sitemap: {
		sources: ['/api/__sitemap__/urls'],
		exclude: ['/preview/**'],
	},
	compatibilityDate: '2025-01-08',
});
