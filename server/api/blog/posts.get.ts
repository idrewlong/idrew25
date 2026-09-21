import type { PostSummary } from '../../utils/types';
import type { SanityConfig } from '../../utils/sanity';

export default defineEventHandler(async (event): Promise<PostSummary[]> => {
	const query = getQuery(event);
	const tag =
		typeof query.tag === 'string' && query.tag.length > 0
			? query.tag
			: undefined;

	const runtime = useRuntimeConfig();
	const preview = hasPreviewCookie(getRequestHeader(event, 'cookie'));
	const client = createSanityClient(runtime.sanity as SanityConfig, {
		preview,
	});

	const posts = await client.fetch(postsQuery(tag), tag ? { tag } : {});
	return posts ?? [];
});
