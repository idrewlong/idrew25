export interface FeaturedArticle {
	title: string;
	publisher: string;
	externalUrl: string;
	publishedAt: string;
	description: string;
	image: { url: string; alt: string };
	accentColor: string;
}

export const featuredArticles: FeaturedArticle[] = [
	{
		title: "When Tools Are Smart Enough, All That's Left Is Taste",
		publisher: 'Mad Genius',
		externalUrl:
			'https://madg.com/blog/when-tools-are-smart-enough-all-thats-left-is-taste/',
		publishedAt: '2026-05-12',
		description:
			'As AI levels the playing field on tool proficiency, taste and judgment become the real differentiators for agencies in an AI-enabled landscape.',
		image: {
			url: '/images/taste.webp',
			alt: 'Illustration of a paint palette representing creative taste and judgment',
		},
		accentColor: '#de6daa',
	},
	{
		title: "The Modern Marketer's Guide To AI Implementation",
		publisher: 'Mad Genius',
		externalUrl:
			'https://madg.com/2025/03/19/the-modern-marketers-guide-to-ai-implementation/',
		publishedAt: '2025-03-19',
		description:
			'A comprehensive guide on integrating AI tools and strategies into modern marketing workflows, focusing on practical applications and real-world examples.',
		image: {
			url: '/images/tools.webp',
			alt: 'Illustration of a toolbox representing AI implementation tools for marketers',
		},
		accentColor: '#facc15',
	},
	{
		title: 'SEO in the Age of AI Search Engines',
		publisher: 'Mad Genius',
		externalUrl:
			'https://madg.com/2025/01/07/seo-in-the-age-of-ai-search-engines/',
		publishedAt: '2025-01-07',
		description:
			'Exploring how AI-powered search engines are changing SEO practices and what marketers need to know to stay ahead of the curve.',
		image: {
			url: '/images/computer.webp',
			alt: 'Illustration of a computer screen representing AI-powered search engines',
		},
		accentColor: '#c084fc',
	},
];
