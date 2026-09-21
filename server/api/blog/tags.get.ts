import type { Tag } from '../../utils/types';
import type { SanityConfig } from '../../utils/sanity';

export default defineEventHandler(async (): Promise<Tag[]> => {
	const runtime = useRuntimeConfig();
	const client = createSanityClient(runtime.sanity as SanityConfig);
	const tags = await client.fetch(TAGS_QUERY);
	return tags ?? [];
});
