// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite';

const upstashUrl =
	process.env.NUXT_UPSTASH_REDIS_REST_URL || process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const upstashToken =
	process.env.NUXT_UPSTASH_REDIS_REST_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

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
		// Optional: raises GitHub's rate limit for the "Now shipping" feed
		githubToken: '',
		// AI assistant (server-only). No key = assistant hidden and offline.
		anthropicApiKey: '',
		assistantModel: 'claude-haiku-5-5',
		assistantDailyCap: 300,
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
	// Who the site is about, for search engines and AI answers. Every page's
	// schema graph links to this Person.
	schemaOrg: {
		identity: {
			type: 'Person',
			name: 'Andrew Long',
			jobTitle: 'Senior Full Stack Developer',
			worksFor: { '@type': 'Organization', name: 'Mad Genius', url: 'https://madg.com' },
			url: 'https://www.idrewlong.com',
			image: 'https://www.idrewlong.com/images/me_1.webp',
			sameAs: ['https://github.com/idrewlong', 'https://www.linkedin.com/in/idrewlong/'],
		},
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
		// satellite.js 7 re-exports an optional WASM worker that uses top-level
		// await, which the default 'iife' worker format can't build. The site
		// never calls the WASM API, so the worker is emitted but never loaded.
		worker: { format: 'es' },
	},

	image: {
		format: ['webp'],
		domains: ['www.idrewlong.com'],
	},

	fonts: {
		families: [
			{ name: 'Archivo', weights: ['400 900'] },
			{ name: 'Big Shoulders Display', weights: ['400 900'] },
		],
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
		'/**': {
			headers: {
				'Strict-Transport-Security': 'max-age=63072000',
				'X-Content-Type-Options': 'nosniff',
				'X-Frame-Options': 'DENY',
				'Referrer-Policy': 'strict-origin-when-cross-origin',
				'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
				// Report-only while it's trialled: violations show in the browser
				// console without blocking anything. Switch the header name to
				// Content-Security-Policy once a week of browsing logs none.
				// 'unsafe-inline' scripts: Nuxt inlines its payload and config.
				'Content-Security-Policy-Report-Only': [
					"default-src 'self'",
					"script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
					"style-src 'self' 'unsafe-inline'",
					"img-src 'self' data: blob: https://cdn.sanity.io https://www.googletagmanager.com https://*.google-analytics.com",
					"font-src 'self' data:",
					"connect-src 'self' https://api.web3forms.com https://api.iconify.design https://api.simplesvg.com https://api.unisvg.com https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com",
					"worker-src 'self' blob:",
					"frame-ancestors 'none'",
					"form-action 'self' https://api.web3forms.com",
					"base-uri 'self'",
					"object-src 'none'",
				].join('; '),
			},
		},
		'/Andrew%20Long%20Resume.pdf': {
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Disposition': 'attachment; filename="andrew-long-resume.pdf"',
				'X-Content-Type-Options': 'nosniff',
				'Cache-Control': 'no-store',
			},
		},
		'/blog/**': { isr: 60 },
		// CDN-cached API routes. Use `isr` with seconds, not `swr`: on Vercel
		// `swr` compiles to an ISR entry with no expiration, so the response
		// never refreshes until the next deploy.
		// Orbital elements change every 2 hours
		'/api/satellites': { isr: 60 * 60 * 2 },
		'/api/github-activity': { isr: 60 * 30 },
		'/api/github-pulse': { isr: 60 * 60 * 3 },
		'/api/assistant/**': { headers: { 'Cache-Control': 'no-store' } },
	},
	// Assistant rate-limit counters. With Upstash configured they're shared
	// across serverless instances; without it each instance counts alone.
	// Accepts our own names or the ones Vercel's Upstash integration creates.
	nitro: {
		storage: upstashUrl
			? { assistant: { driver: 'upstash', url: upstashUrl, token: upstashToken } }
			: {},
	},
	sitemap: {
		sources: ['/api/__sitemap__/urls'],
	},
	compatibilityDate: '2025-01-08',
});
