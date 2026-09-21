import type { SanityConfig } from '../../utils/sanity';

interface PostSlugRow {
	slug: string;
	lastmod: string;
}

// defineSitemapEventHandler is provided by @nuxtjs/sitemap, which ships as
// part of @nuxtjs/seo.
export default defineSitemapEventHandler(async () => {
	const runtime = useRuntimeConfig();
	const client = createSanityClient(runtime.sanity as SanityConfig);

	const rows: PostSlugRow[] = (await client.fetch(POST_SLUGS_QUERY)) ?? [];

	// Trailing slashes to match site.trailingSlash: true.
	return rows.map((row) => ({
		loc: `/blog/${row.slug}/`,
		lastmod: row.lastmod,
	}));
});
