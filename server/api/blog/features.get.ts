import type { Feature } from '../../utils/types';
import type { SanityConfig } from '../../utils/sanity';

export default defineEventHandler(async (event): Promise<Feature[]> => {
	const runtime = useRuntimeConfig();
	const preview = hasPreviewCookie(
		getRequestHeader(event, 'cookie'),
		runtime.previewSecret
	);
	const client = createSanityClient(runtime.sanity as SanityConfig, {
		preview,
	});

	const features = await client.fetch(FEATURES_QUERY);
	return features ?? [];
});
