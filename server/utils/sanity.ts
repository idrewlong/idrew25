import { createClient, type SanityClient } from '@sanity/client';

export interface SanityConfig {
	projectId: string;
	dataset: string;
	apiVersion: string;
	readToken?: string;
}

export function createSanityClient(
	config: SanityConfig,
	opts: { preview?: boolean } = {}
): SanityClient {
	const preview = opts.preview === true;

	if (preview && !config.readToken) {
		throw new Error(
			'Preview mode requires SANITY_READ_TOKEN to be set. Without it, drafts cannot be read.'
		);
	}

	return createClient({
		projectId: config.projectId,
		dataset: config.dataset,
		apiVersion: config.apiVersion,
		// The CDN serves cached published content and cannot see drafts.
		useCdn: !preview,
		token: preview ? config.readToken : undefined,
		perspective: preview ? 'drafts' : 'published',
	});
}
