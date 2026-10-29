import type { Post } from '../../../utils/types';
import type { SanityConfig } from '../../../utils/sanity';

export default defineEventHandler(async (event): Promise<Post> => {
	const slug = getRouterParam(event, 'slug');
	if (!slug) {
		throw createError({ statusCode: 400, statusMessage: 'Missing slug' });
	}

	const runtime = useRuntimeConfig();
	// Published content only. A drafts preview must never go through these
	// endpoints: /blog/** is ISR-cached, so a draft would be served to everyone.
	const client = createSanityClient(runtime.sanity as SanityConfig);

	const post = await client.fetch(POST_BY_SLUG_QUERY, { slug });
	if (!post) {
		throw createError({ statusCode: 404, statusMessage: 'Post not found' });
	}

	const { body, ...rest } = post;
	return {
		...rest,
		bodyHtml: await renderBody(body),
		headings: extractHeadings(body),
	};
});
