// Resume data shared by the home page sections, /resume and the site assistant
// (server/utils/assistantKnowledge.ts), so none of them drift from the others.

// Highlights and focus tags restate facts from each role's own bullets.
export const experiences = [
	{
		period: 'May 2026 – Present',
		title: 'Senior Full Stack Developer',
		company: 'Mad Genius',
		focus: ['AWS (EC2, S3)', 'CI/CD', 'Containers', 'Mentoring', 'Architecture'],
		achievements: [
			'Lead architecture and development for a diverse client portfolio, owning web and mobile products from user stories and database schema through backend and production.',
			'Build and remediate AWS infrastructure (EC2, S3, scheduled jobs) for multiple Mississippi state agencies, closing security and compliance gaps.',
			'Mentor junior developers and lead quarterly internal training on web standards, SEO, and security.',
			'Stand up CI/CD pipelines and containerized deployments so client projects ship on a repeatable, reviewable release process.',
			'Partner with designers, strategists, and account teams to scope work and translate client goals into technical requirements.',
		],
	},
	{
		period: 'June 2024 – May 2026',
		title: 'SEO Developer',
		company: 'Mad Genius',
		highlights: [
			{ value: '$1M+', label: 'App revenue, first month' },
			{ value: '74%', label: 'YoY organic traffic' },
			{ value: '10,000+', label: 'Active app users' },
		],
		achievements: [
			'Built and maintained full-stack applications while leading technical SEO for enterprise clients across construction, real estate, and public health.',
			'Key contributor to a React Native app that grossed $1M+ in its first month with 10,000+ active users.',
			'Drove a 74% year-over-year increase in organic traffic for a key client through technical SEO, content strategy, and LLM search integration.',
			'Built full-stack applications with Laravel, React, Nuxt, and headless WordPress, deploying across AWS, Digital Ocean, and WP Engine.',
			'Built automation tools, including web crawlers and reporting scripts, that cut SEO audit turnaround time by 10% across the team.',
		],
	},
	{
		period: 'December 2023 – June 2024',
		title: 'Marketing Project Manager',
		company: 'Thompson Machinery',
		focus: ['Next.js', 'Tailwind CSS', 'Power Apps', 'Power BI', 'SEO / SEM'],
		achievements: [
			'Built campaign landing pages and internal tools while managing marketing initiatives across the sales and SITECH divisions.',
			'Designed and developed campaign landing pages with Next.js, Tailwind CSS, and Makeswift, and maintained WordPress sites in PHP and JavaScript.',
			'Built internal marketing forms and planners in Microsoft Power Apps to improve workflow and project coordination.',
			'Analyzed sales data in Power BI to find market share gaps and target Caterpillar equipment campaigns.',
			'Managed SEO, SEM, and email campaigns across the sales and SITECH divisions.',
		],
	},
	{
		period: 'September 2022 – May 2024',
		title: 'Web Developer',
		company: "Finder's Guide",
		highlights: [
			{ value: '40%', label: 'Avg. organic traffic lift' },
			{ value: '15+', label: 'Client engagements' },
		],
		achievements: [
			'Founded a consultancy delivering custom web development and digital growth strategy for local and enterprise clients.',
			'Increased organic search traffic by an average of 40% across 15+ client engagements.',
			'Built web applications with Next.js and Svelte on headless WordPress, deployed on Digital Ocean droplets.',
			'Led remote cross-functional design teams and managed the full project lifecycle, from client acquisition through ongoing support.',
		],
	},
	{
		period: 'March 2022 – January 2023',
		title: 'Associate Customer Support Specialist',
		company: 'Core Logic',
		highlights: [
			{ value: '95%', label: 'CSAT score' },
			{ value: '50–70', label: 'Daily customer interactions' },
		],
		achievements: [
			'Supported customers on industry-specific insurance and property software, including Xactimate and XactAnalysis.',
			'Maintained a 95% CSAT score across 50–70 daily customer interactions, consistently above team average.',
			'Worked in a Scrum team using Salesforce and Jira, escalating complex issues to development and contributing to product improvements.',
		],
	},
	{
		period: 'January 2018 – December 2020',
		title: 'Owner',
		company: 'LMC',
		highlights: [{ value: '100+', label: 'Music videos in two years' }],
		achievements: [
			'Ran a video production company, managing every phase from pre-production and planning through cinematography and editing.',
			'Directed and edited 100+ music videos in two years for a music production company.',
			'Worked with a team of videographers and editors on music videos, executive training, live sports, and weddings.',
		],
	},
];

export const educationList = [
	{
		degree: 'B.A',
		major: 'General Studies',
		achievements: [
			'Lyceum Scholar',
			'Lens Collective Program',
			"Chancellor's Leadership Class",
		],
		school: 'University of Mississippi',
		year: '2022',
		logo: '/images/olemiss.webp',
	},
	{
		degree: 'A.A',
		major: 'Pre-Engineering',
		achievements: ['Phi Theta Kappa President', 'Hall of Fame', 'NASA Scholar'],
		school: 'Mississippi Delta Community College',
		year: '2016',
		logo: '/images/mdcc.webp',
	},
];

// Every entry is backed by a role, a project on this site, or the resume PDF.
// AI comes first because it's where the work is heading.
export const skillCategories = [
	{
		title: 'AI & agents',
		skills: [
			'Claude API',
			'MCP servers',
			'LLM integration',
			'AI guardrails & rate limiting',
			'LLM search optimization',
			'Claude Code',
			'Cursor',
		],
	},
	{
		title: 'Languages',
		skills: ['TypeScript', 'JavaScript', 'Go', 'Python', 'PHP', 'Rust', 'SQL'],
	},
	{
		title: 'Frontend',
		skills: [
			'React / Next.js',
			'Vue / Nuxt',
			'Svelte / SvelteKit',
			'React Native',
			'Tailwind CSS',
			'GSAP',
			'Three.js',
			'WordPress',
		],
	},
	{
		title: 'Backend & data',
		skills: ['Laravel', 'Node.js', 'GraphQL', 'REST APIs', 'PostgreSQL', 'Redis', 'SQLite', 'Headless CMS'],
	},
	{
		title: 'Cloud & security',
		skills: [
			'AWS (EC2, S3)',
			'Docker',
			'CI/CD',
			'Cron job orchestration',
			'Vercel',
			'Digital Ocean',
			'WP Engine',
			'Cloudflare',
			'Linux',
			'Security+',
		],
	},
	{
		title: 'SEO & business tools',
		skills: [
			'Technical SEO',
			'GA4 / Search Console',
			'Power Apps',
			'Power BI',
			'Salesforce',
			'Jira',
			'Figma',
		],
	},
];

// Big-type summary under the skills grid
export const expertiseAreas = [
	'AI tooling & MCP servers',
	'Full stack web & mobile apps',
	'Headless CMS platforms',
	'AWS infrastructure & security',
	'Technical SEO & AI search',
	'Developer tools & CLIs',
];

// "What I do" rows on the home page, AI first. Each line restates facts
// from a role or a project on this site.
export const focusAreas = [
	{
		tag: 'AI',
		visual: 'ai',
		title: 'Applied AI & agent tooling',
		body: "I own AI tooling at Mad Genius. On my own time I built crawlmark, an MCP server that hands Claude live Search Console, GA4 and Lighthouse data, and the assistant on this site, which only answers about my work and can't run up my API bill.",
	},
	{
		tag: 'BUILD',
		visual: 'build',
		title: 'Full stack apps',
		body: 'Web and mobile apps from the database schema to production in Nuxt, React, React Native and Laravel, for clients in construction, real estate and public health.',
	},
	{
		tag: 'CLOUD',
		visual: 'cloud',
		title: 'Cloud & security',
		body: 'AWS infrastructure (EC2, S3, scheduled jobs) for Mississippi state agencies, rebuilt to close security and compliance gaps. CompTIA Security+ certified.',
	},
];

export const certifications = [
	{
		name: 'CompTIA Security+',
		issuer: 'CompTIA',
		code: 'SY0-701',
		status: 'earned',
		date: 'Oct 2026',
		badge: '/images/comptia-security-ce-certification.png',
		verifyUrl: 'https://www.credly.com/badges/22a82737-95da-458f-856a-02be00e5a352/public_url',
	},
];
