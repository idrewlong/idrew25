export const PREVIEW_COOKIE = 'blog_preview';

// Takes the raw header rather than an H3Event so it stays a pure function,
// testable without booting Nitro.
export function hasPreviewCookie(
	cookieHeader: string | undefined | null
): boolean {
	if (!cookieHeader) return false;
	return cookieHeader
		.split(';')
		.map((part) => part.trim())
		.includes(`${PREVIEW_COOKIE}=1`);
}
