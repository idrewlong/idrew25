// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite';

const upstashUrl =
	process.env.NUXT_UPSTASH_REDIS_REST_URL || process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const upstashToken =
	process.env.NUXT_UPSTASH_REDIS_REST_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

// The deploy the teardown ops panel reports, captured at build time from
// Vercel's git system variables. Locally these are empty and the panel says so.
const deploy = {
	sha: process.env.VERCEL_GIT_COMMIT_SHA || '',
	ref: process.env.VERCEL_GIT_COMMIT_REF || '',
	message: (process.env.VERCEL_GIT_COMMIT_MESSAGE || '').split('\n')[0]!.slice(0, 120),
	repo: process.env.VERCEL_GIT_REPO_OWNER && process.env.VERCEL_GIT_REPO_SLUG
		? `${process.env.VERCEL_GIT_REPO_OWNER}/${process.env.VERCEL_GIT_REPO_SLUG}`
		: '',
	builtAt: new Date().toISOString(),
	env: process.env.VERCEL_ENV || 'local',
};

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
		// Optional: raises GitHub's rate limit for the "Now shipping" feed and
		// the teardown ops panel (CI status, DORA metrics)
		githubToken: '',
		// AI assistant (server-only). No key = assistant hidden and offline.
		anthropicApiKey: '',
		assistantModel: 'claude-haiku-5-5',
		assistantDailyCap: 300,
		// Teardown ops panel: the deploy above, plus the shared secret the
		// ops-monitor GitHub Action uses to report uptime and Lighthouse runs
		// (NUXT_OPS_INGEST_SECRET). Empty = ingest switched off.
		deploy,
		opsIngestSecret: '',
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
		// Only Vercel production builds report to GA4, so local dev and preview
		// deploys don't pollute real data. Elsewhere the composables are no-ops.
		enabled: process.env.VERCEL_ENV === 'production',
		id: 'G-J7YM70XLHW',
	},

	// Pages use a static OG image (/og/andrew-long.jpg, set in app.vue), so the
	// runtime OG image renderer is dead weight -- it only pulls in a native
	// renderer dependency.
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
		// Static images in public/ aren't content-hashed, so cache for a week
		// (and let the CDN revalidate after) rather than forever
		'/images/**': { headers: { 'Cache-Control': 'public, max-age=604800, stale-while-revalidate=86400' } },
		'/og/**': { headers: { 'Cache-Control': 'public, max-age=604800, stale-while-revalidate=86400' } },
		// CDN-cached API routes. Use `isr` with seconds, not `swr`: on Vercel
		// `swr` compiles to an ISR entry with no expiration, so the response
		// never refreshes until the next deploy.
		// Orbital elements change every 2 hours
		'/api/satellites': { isr: 60 * 60 * 2 },
		'/api/github-activity': { isr: 60 * 30 },
		'/api/github-pulse': { isr: 60 * 60 * 3 },
		// Cached at the edge for a minute so the ops panel can show a real
		// HIT/MISS for the visitor's own request. DORA reads GitHub, hourly.
		'/api/ops': { isr: 60 },
		'/api/ops/dora': { isr: 60 * 60 },
		// Status page data: checks arrive every 15 minutes
		'/api/status': { isr: 60 * 5 },
		'/api/status/now': { isr: 60 },
		'/api/ops/ingest/**': { headers: { 'Cache-Control': 'no-store' } },
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
