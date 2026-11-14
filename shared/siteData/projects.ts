// Project cards for the Work section (app/components/Projects2.vue), shared
// with the site assistant (server/utils/assistantKnowledge.ts) so the two
// never drift.

export interface Project {
	title: string;
	description: string;
	category: 'tool' | 'website';
	/** Shown as tags on the card. */
	workTypes: string[];
	/** true = client work, false = side project (the dot on the card). */
	isRealWork: boolean;
	/** Iconify names for the tech row. */
	technologies: string[];
	link?: string;
	repo?: string;
	image?: string;
	video?: string;
	/** Generated card art key, used when there's no image. */
	art?: string;
	install?: string;
	command?: string;
}

// Newest first, tools and sites mixed, so the first cards (five show before
// "show more") are recent work of both kinds. Add new projects at the top.
export const allProjects: Project[] = [
	{
		title: 'Mississippi State Department of Health',
		description:
			'Built much of the custom Laravel CMS behind the state health department\'s new site, parts of the Inertia and React front end, the AWS hosting, and internal tooling that migrated pages over from the old site.',
		image: '/images/msdh.webp',
		link: 'https://msdh.ms.gov/',
		workTypes: ['Web Development', 'Cloud'],
		isRealWork: true,
		category: 'website',
		technologies: [
			'logos:laravel',
			'logos:react',
			'logos:tailwindcss-icon',
			'logos:aws',
		],
	},
	{
		title: 'crawlmark',
		description:
			'MCP server in TypeScript that gives Claude, or any MCP client, the data behind monthly SEO client work. It pulls from Search Console, GA4, Tag Manager, Lighthouse and axe-core, plus DataForSEO, Ahrefs or Semrush for keywords and backlinks, and turns it into report-shaped tools for audits, quick wins and monthly reports. Responses are cached in SQLite, and paid calls stop at per-client monthly caps.',
		art: 'crawlmark',
		repo: 'https://github.com/idrewlong/crawlmark-mcp',
		install: 'npx crawlmark-mcp@latest init',
		command: 'npx crawlmark-mcp setup status',
		workTypes: ['MCP Server', 'Open Source'],
		isRealWork: false,
		category: 'tool',
		technologies: ['logos:typescript-icon', 'logos:nodejs-icon'],
	},
	{
		title: 'Southern AgCredit',
		description:
			'Custom WordPress theme for a farm and rural land lender serving Mississippi and Northwest Louisiana, with a loan calculator and Gravity Forms lead forms, hosted on WP Engine.',
		image: '/images/southernagcredit.webp',
		link: 'https://southernagcredit.com/',
		workTypes: ['Web Development'],
		isRealWork: true,
		category: 'website',
		technologies: [
			'logos:wordpress-icon',
			'logos:tailwindcss-icon',
			'logos:wpengine',
		],
	},
	{
		title: 'Skinamp',
		description:
			'Customizable Spotify player for Omarchy, written in Rust on librespot. A background daemon puts a mini player in the status bar, and a full player window swaps between skins like Winamp, iTunes, click-wheel iPod, Zune and WMP, with synced lyrics, terminal and GPU visualizers, and MPRIS media keys.',
		// Screen recording as video (an 850KB MP4 instead of a 3.2MB GIF);
		// the still is the hover peek and the poster
		image: '/images/skinamp-tour.jpg',
		video: '/images/skinamp-tour.mp4',
		link: 'https://plugins.omarchy.org/plugin.html?id=io.github.idrewlong.skinamp',
		repo: 'https://github.com/idrewlong/skinamp',
		workTypes: ['Desktop App', 'Open Source'],
		isRealWork: false,
		category: 'tool',
		technologies: ['logos:rust', 'logos:spotify-icon'],
	},
	{
		title: 'djilog',
		description:
			'Go library and CLI for parsing DJI drone flight logs across all 14 format versions, including encrypted v13+ logs. Exports flight tracks to CSV, GeoJSON, KML or JSON, recovers embedded photos with their EXIF, and salvages what it can from corrupt files. Standard library only.',
		art: 'djilog',
		repo: 'https://github.com/idrewlong/djilog',
		install: 'go install github.com/idrewlong/djilog/cmd/djilog@latest',
		command: 'djilog export flight.txt --geojson -o track.geojson',
		workTypes: ['Developer Tool', 'Open Source'],
		isRealWork: false,
		category: 'tool',
		technologies: ['logos:go'],
	},
	{
		title: 'Lessley Aviation',
		description:
			'Designed and built the site end to end: a headless WordPress CMS serving a Nuxt frontend over GraphQL, so the school edits content without touching code.',
		image: '/images/lessleyaviation.webp',
		link: 'https://lessleyaviation.com/',
		workTypes: ['Web Development', 'Web Design'],
		isRealWork: false,
		category: 'website',
		technologies: [
			'logos:nuxt-icon',
			'logos:tailwindcss-icon',
			'logos:wordpress-icon',
			'logos:graphql',
		],
	},
	{
		title: 'Snapr',
		description:
			'Chrome extension that captures clean screenshots of any webpage in one click. Viewport, full page with scroll-and-stitch, or a dragged selection, exported as PNG, JPG, WebP or PDF. No account, no cloud.',
		image: '/images/snapr.webp',
		link: 'https://chromewebstore.google.com/detail/snapr/obbmbckbeeegfhfjmhhlhadgoiabiigg',
		repo: 'https://github.com/idrewlong/snapr',
		workTypes: ['Browser Extension', 'Developer Tool'],
		isRealWork: false,
		category: 'tool',
		technologies: ['logos:chrome'],
	},
	{
		title: 'Morphr',
		description:
			'Command-line RAW converter written in Go. Handles CR2, NEF, ARW, DNG and 25+ camera formats, converting a single file or a whole folder to JPEG, PNG, TIFF, WebP or AVIF. Run it with no arguments and it walks you through an interactive wizard.',
		art: 'morphr',
		repo: 'https://github.com/idrewlong/morphr',
		install: 'brew install idrewlong/tap/morphr',
		command: 'morphr',
		workTypes: ['Developer Tool', 'Open Source'],
		isRealWork: false,
		category: 'tool',
		technologies: ['logos:go'],
	},
	{
		title: 'Shrinkr',
		description:
			'Open-source CLI tool written in Go that batch-compresses entire image folders in seconds. It hits a target file size using binary search across WebP, AVIF, JPEG, and PNG. Zero config, one command.',
		image: '/images/shrinkr.webp',
		link: 'https://cli.shrinkr.app/',
		repo: 'https://github.com/idrewlong/shrinkr_cli',
		workTypes: ['Developer Tool', 'Open Source'],
		isRealWork: false,
		category: 'tool',
		technologies: ['logos:go'],
	},
	{
		title: 'Mad Genius - 5.0',
		description:
			'Helped rebuild the agency site: headless WordPress feeding a TypeScript Nuxt frontend over GraphQL, with GSAP page transitions and technical SEO fixes.',
		image: '/images/madgcover.webp',
		link: 'https://madg.com/',
		workTypes: ['Web Development', 'SEO'],
		isRealWork: true,
		category: 'website',
		technologies: [
			'logos:nuxt-icon',
			'logos:typescript-icon',
			'logos:tailwindcss-icon',
			'logos:wordpress-icon',
			'logos:graphql',
		],
	},
	{
		title: 'Yates Construction',
		description:
			'Built a modular template system on headless WordPress and Nuxt (GraphQL, WP Engine) and improved page performance and technical SEO for a national construction firm.',
		image: '/images/Yates.webp',
		link: 'https://wgyates.com/',
		workTypes: ['Web Development', 'SEO'],
		isRealWork: true,
		category: 'website',
		technologies: [
			'logos:nuxt-icon',
			'logos:tailwindcss-icon',
			'logos:wordpress-icon',
			'logos:graphql',
			'logos:wpengine',
		],
	},
	{
		title: 'Regional Homes',
		description:
			'Built a reusable component library and lead-gen page templates on headless WordPress and Nuxt, rolled out across 50+ sites for a regional home builder.',
		image: '/images/Regional.webp',
		link: 'https://regionalhomes.net/',
		workTypes: ['Web Development', 'SEO'],
		isRealWork: true,
		category: 'website',
		technologies: [
			'logos:nuxt-icon',
			'logos:tailwindcss-icon',
			'logos:wordpress-icon',
			'logos:graphql',
			'logos:wpengine',
		],
	},
	{
		title: 'Eley Guild Hardy',
		description:
			'Optimized image delivery and built page transitions for an architecture firm\'s portfolio on WordPress, hosted on WP Engine.',
		image: '/images/EGH.webp',
		link: 'https://eleyguildhardy.com/',
		workTypes: ['Web Development'],
		isRealWork: true,
		category: 'website',
		technologies: [
			'logos:wordpress-icon',
			'logos:tailwindcss-icon',
			'logos:wpengine',
		],
	},
	{
		title: 'El Fornino Pizzeria',
		description:
			'Designed and built the site in Nuxt and Tailwind for a Biloxi, MS restaurant.',
		image: '/images/elfornino.webp',
		link: 'https://elfornino.com/',
		workTypes: ['Web Development', 'Web Design'],
		isRealWork: false,
		category: 'website',
		technologies: ['logos:nuxt-icon', 'logos:tailwindcss-icon'],
	},
	{
		title: 'idrewfilm',
		description:
			'Designed, built and self-host my photography portfolio: headless WordPress and Nuxt on a Digital Ocean droplet behind Cloudflare, with optimized image delivery.',
		image: '/images/idrewfilm.webp',
		link: 'https://idrewfilm.com/',
		workTypes: ['Web Development', 'Web Design', 'Branding', 'SEO'],
		isRealWork: false,
		category: 'website',
		technologies: [
			'logos:nuxt-icon',
			'logos:tailwindcss-icon',
			'logos:wordpress-icon',
			'logos:graphql',
		],
	},
	{
		title: 'The Summit Room',
		description:
			'Designed and built the site, including a studio tour, gear list and session booking flow, in Nuxt deployed on Vercel.',
		image: '/images/summitroomstudio-com-index.webp',
		link: 'https://www.summitroomstudio.com/',
		workTypes: ['Web Development', 'Web Design', 'SEO'],
		isRealWork: false,
		category: 'website',
		technologies: [
			'logos:nuxt-icon',
			'logos:tailwindcss-icon',
			'logos:vercel-icon',
		],
	},
];
