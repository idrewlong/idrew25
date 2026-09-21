import { timingSafeEqual } from 'node:crypto';

export const PREVIEW_COOKIE = 'blog_preview';

// Constant-time compare. timingSafeEqual throws when the buffers differ in
// length, so the length check has to come first -- and returning false there
// is correct, since a different length is already a mismatch.
function secretsMatch(candidate: string, expected: string): boolean {
	const a = Buffer.from(candidate, 'utf8');
	const b = Buffer.from(expected, 'utf8');
	if (a.length !== b.length) return false;
	return timingSafeEqual(a, b);
}

// Takes the raw header and the expected secret rather than an H3Event, so it
// stays a pure function testable without booting Nitro.
//
// The cookie carries the preview secret itself, not a constant. An earlier
// version set `blog_preview=1` and checked only for that literal, which meant
// the secret was validated once at /preview/enable and then discarded --
// anyone could send `Cookie: blog_preview=1` by hand and be treated as an
// authenticated previewer. httpOnly stops page scripts from reading a cookie;
// it does not stop a client from sending whichever cookies it likes.
export function hasPreviewCookie(
	cookieHeader: string | undefined | null,
	expectedSecret: string | undefined | null
): boolean {
	// Preview must be impossible to enable when it is not configured.
	if (!expectedSecret) return false;
	if (!cookieHeader) return false;

	const prefix = `${PREVIEW_COOKIE}=`;
	const cookie = cookieHeader
		.split(';')
		.map((part) => part.trim())
		.find((part) => part.startsWith(prefix));

	if (!cookie) return false;

	return secretsMatch(cookie.slice(prefix.length), expectedSecret);
}
