import { describe, it, expect } from 'vitest';
import { hasPreviewCookie, PREVIEW_COOKIE } from '../../server/utils/preview';

const SECRET = 'a-long-random-preview-secret-value';

describe('hasPreviewCookie', () => {
	it('is false when there is no cookie header', () => {
		expect(hasPreviewCookie(undefined, SECRET)).toBe(false);
		expect(hasPreviewCookie(null, SECRET)).toBe(false);
		expect(hasPreviewCookie('', SECRET)).toBe(false);
	});

	// The bypass this function exists to prevent: preview must be impossible
	// to enable when no secret is configured, no matter what the client sends.
	it('is false when no secret is configured, even with a well-formed cookie', () => {
		expect(hasPreviewCookie(`${PREVIEW_COOKIE}=${SECRET}`, undefined)).toBe(
			false
		);
		expect(hasPreviewCookie(`${PREVIEW_COOKIE}=${SECRET}`, null)).toBe(false);
		expect(hasPreviewCookie(`${PREVIEW_COOKIE}=${SECRET}`, '')).toBe(false);
	});

	// The exact exploit: before this fix, the cookie value was the constant "1",
	// so `curl -H 'Cookie: blog_preview=1'` was accepted as an authenticated
	// preview request by anyone.
	it('rejects the old constant cookie value', () => {
		expect(hasPreviewCookie(`${PREVIEW_COOKIE}=1`, SECRET)).toBe(false);
	});

	it('is true only when the cookie carries the configured secret', () => {
		expect(hasPreviewCookie(`${PREVIEW_COOKIE}=${SECRET}`, SECRET)).toBe(true);
	});

	it('is false for a wrong secret', () => {
		expect(hasPreviewCookie(`${PREVIEW_COOKIE}=wrong`, SECRET)).toBe(false);
	});

	// timingSafeEqual throws on length mismatch, so the guard must come first.
	it('is false for values shorter or longer than the secret, without throwing', () => {
		expect(hasPreviewCookie(`${PREVIEW_COOKIE}=${SECRET.slice(0, 10)}`, SECRET)).toBe(false);
		expect(hasPreviewCookie(`${PREVIEW_COOKIE}=${SECRET}extra`, SECRET)).toBe(false);
	});

	it('finds the cookie among others, with or without spaces', () => {
		expect(hasPreviewCookie(`a=1; ${PREVIEW_COOKIE}=${SECRET}; b=2`, SECRET)).toBe(true);
		expect(hasPreviewCookie(`a=1;${PREVIEW_COOKIE}=${SECRET};b=2`, SECRET)).toBe(true);
	});

	it('is not fooled by the secret appearing inside another cookie', () => {
		expect(hasPreviewCookie(`other=${PREVIEW_COOKIE}=${SECRET}`, SECRET)).toBe(false);
	});

	it('is not fooled by a cookie whose name merely ends with the real name', () => {
		expect(hasPreviewCookie(`x${PREVIEW_COOKIE}=${SECRET}`, SECRET)).toBe(false);
	});
});
