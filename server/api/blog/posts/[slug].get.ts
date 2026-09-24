import type { Post } from '../../../utils/types';
import type { SanityConfig } from '../../../utils/sanity';

export default defineEventHandler(async (event): Promise<Post> => {
	const slug = getRouterParam(event, 'slug');
	if (!slug) {
		throw createError({ statusCode: 400, statusMessage: 'Missing slug' });
	}

	const runtime = useRuntimeConfig();
	const preview = hasPreviewCookie(
		getRequestHeader(event, 'cookie'),
		runtime.previewSecret
	);
	const client = createSanityClient(runtime.sanity as SanityConfig, {
		preview,
	});

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
