import { describe, it, expect } from 'vitest';
import { hasPreviewCookie, PREVIEW_COOKIE } from '../../server/utils/preview';

describe('hasPreviewCookie', () => {
	it('is false when there is no cookie header', () => {
		expect(hasPreviewCookie(undefined)).toBe(false);
		expect(hasPreviewCookie(null)).toBe(false);
		expect(hasPreviewCookie('')).toBe(false);
	});

	it('is true when the preview cookie is set', () => {
		expect(hasPreviewCookie(`${PREVIEW_COOKIE}=1`)).toBe(true);
	});

	it('finds the cookie among others', () => {
		expect(hasPreviewCookie(`a=1; ${PREVIEW_COOKIE}=1; b=2`)).toBe(true);
	});

	it('is false for any other value', () => {
		expect(hasPreviewCookie(`${PREVIEW_COOKIE}=yes`)).toBe(false);
		expect(hasPreviewCookie('other=1')).toBe(false);
	});
});
