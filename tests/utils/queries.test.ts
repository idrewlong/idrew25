import { describe, it, expect } from 'vitest';
import {
	postsQuery,
	POST_BY_SLUG_QUERY,
	FEATURES_QUERY,
	POST_SLUGS_QUERY,
} from '../../server/utils/queries';

describe('postsQuery', () => {
	it('returns newest first', () => {
		expect(postsQuery()).toContain('order(publishedAt desc)');
	});

	it('omits the tag filter when no tag is given', () => {
		expect(postsQuery()).not.toContain('$tag');
	});

	it('filters on the tag slug when a tag is given', () => {
		expect(postsQuery('seo')).toContain('$tag in tags[]->slug.current');
	});

	it('flattens slug to a plain string', () => {
		expect(postsQuery()).toContain('"slug": slug.current');
	});

	it('excludes posts without a slug, which cannot be routed to', () => {
		expect(postsQuery()).toContain('defined(slug.current)');
	});
});

describe('POST_BY_SLUG_QUERY', () => {
	it('selects a single document', () => {
		expect(POST_BY_SLUG_QUERY).toContain('[0]');
	});

	it('expands image assets inside body so the renderer needs no URL builder', () => {
		expect(POST_BY_SLUG_QUERY).toContain('_type == "image" =>');
	});
});

describe('FEATURES_QUERY', () => {
	it('defaults the accent colour so cards never render with undefined', () => {
		expect(FEATURES_QUERY).toContain('coalesce(accentColor');
	});
});

describe('POST_SLUGS_QUERY', () => {
	it('returns a lastmod for sitemap entries', () => {
		expect(POST_SLUGS_QUERY).toContain('lastmod');
	});
});
