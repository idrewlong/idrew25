import type { PostSummary } from '../../utils/types';
import type { SanityConfig } from '../../utils/sanity';

export default defineEventHandler(async (event): Promise<PostSummary[]> => {
	const query = getQuery(event);
	const tag =
		typeof query.tag === 'string' && query.tag.length > 0
			? query.tag
			: undefined;

	const runtime = useRuntimeConfig();
	// Published content only. A drafts preview must never go through these
	// endpoints: /blog/** is ISR-cached, so a draft would be served to everyone.
	const client = createSanityClient(runtime.sanity as SanityConfig);

	const params: Record<string, string> = tag ? { tag } : {};
	const posts = await client.fetch(postsQuery(tag), params);
	return posts ?? [];
});
