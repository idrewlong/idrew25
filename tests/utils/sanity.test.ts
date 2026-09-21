import { describe, it, expect } from 'vitest';
import { createSanityClient } from '../../server/utils/sanity';

const config = {
	projectId: 'abc123',
	dataset: 'production',
	apiVersion: '2026-09-20',
};

describe('createSanityClient', () => {
	it('uses the CDN and published content by default', () => {
		const client = createSanityClient(config);
		expect(client.config().useCdn).toBe(true);
		expect(client.config().perspective).toBe('published');
		expect(client.config().token).toBeUndefined();
	});

	it('bypasses the CDN and reads drafts in preview mode', () => {
		const client = createSanityClient(
			{ ...config, readToken: 'test-token' },
			{ preview: true }
		);
		expect(client.config().useCdn).toBe(false);
		expect(client.config().perspective).toBe('drafts');
		expect(client.config().token).toBe('test-token');
	});

	it('refuses preview mode without a read token', () => {
		expect(() => createSanityClient(config, { preview: true })).toThrow(
			/SANITY_READ_TOKEN/
		);
	});
});
