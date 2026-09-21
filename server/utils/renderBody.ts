import { toHTML, type PortableTextComponents } from '@portabletext/to-html';
import { createHighlighter, type Highlighter } from 'shiki';

const THEME = 'github-light';

// Every language the Studio offers. Anything else falls back to plain text.
const LANGS = [
	'typescript',
	'javascript',
	'vue',
	'html',
	'css',
	'bash',
	'json',
	'python',
];

// Shiki's initialisation is expensive, so the instance is created once per
// server process and reused across requests.
let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter(): Promise<Highlighter> {
	if (!highlighterPromise) {
		highlighterPromise = createHighlighter({
			themes: [THEME],
			langs: LANGS,
		});
	}
	return highlighterPromise;
}

const SITE_ORIGIN = 'https://www.idrewlong.com';
const SITE_HOSTNAMES = new Set(['idrewlong.com', 'www.idrewlong.com']);

interface HrefClassification {
	safe: boolean;
	external: boolean;
	href: string;
}

// A browser resolves every href against the PAGE's URL, so testing the raw
// string (prefix checks, `new URL(href)` with no base) checks something the
// browser never does — WHATWG's URL parser normalises backslashes to
// forward slashes for special schemes, so spellings like `/\evil.com` or
// `\\evil.com` resolve off-site even though they don't look like it as a
// string. Resolving against the site's own origin, the way a browser
// would, is the only classification that agrees with what actually
// renders. `SITE_ORIGIN` doubles as the base for that resolution.
function classifyHref(href: string): HrefClassification {
	let resolved: URL;
	try {
		resolved = new URL(href, SITE_ORIGIN);
	} catch {
		return { safe: false, external: false, href };
	}
	if (resolved.protocol === 'mailto:') {
		return { safe: true, external: false, href };
	}
	if (resolved.protocol !== 'http:' && resolved.protocol !== 'https:') {
		// javascript:, data:, vbscript:, etc. — still rejected, since they
		// parse to their own scheme even with a base supplied.
		return { safe: false, external: false, href };
	}
	const external = !SITE_HOSTNAMES.has(resolved.hostname);
	// Internal links keep the author's original (possibly relative) href.
	// External links emit the resolved absolute URL, so a link that
	// actually leaves the site says so in the markup rather than reading
	// like a same-site path.
	return { safe: true, external, href: external ? resolved.href : href };
}

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

export function slugifyHeading(text: string): string {
	return text
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-');
}

function headingText(value: { children?: Array<{ text?: string }> }): string {
	return (value?.children ?? []).map((child) => child?.text ?? '').join('');
}

function plainCodeBlock(code: string): string {
	return `<pre class="shiki plain"><code>${escapeHtml(code)}</code></pre>`;
}


const CALLOUT_TONES = ['note', 'warning', 'tip'];

// YouTube ids are 11 chars; the range is deliberately tight so anything
// carrying quotes, spaces or markup fails before it reaches an attribute.
const VIDEO_ID = /^[A-Za-z0-9_-]{6,20}$/;
const VIMEO_ID = /^[0-9]{6,12}$/;
// Vimeo's unlisted-video privacy hash, as appended to Share-button URLs
// (e.g. vimeo.com/123456789/abc123def4). Alphanumeric only, so it is safe
// to interpolate into the constructed query string unescaped.
const VIMEO_HASH = /^[A-Za-z0-9]{6,20}$/;

// Exact-match allowlists (after stripping a leading "www."). Kept as
// literal Sets/strings rather than any kind of prefix/suffix/substring
// check, so lookalikes like "youtube.com.evil.com", "wwwyoutube.com" or a
// trailing-dot host never pass.
const YOUTUBE_HOSTS = new Set([
	'youtube.com',
	'm.youtube.com',
	'music.youtube.com',
]);
const YOUTUBE_NOCOOKIE_HOST = 'youtube-nocookie.com';

function buildYouTubeSrc(id: string): string | null {
	return VIDEO_ID.test(id)
		? `https://www.youtube-nocookie.com/embed/${id}`
		: null;
}

// The author's URL is NEVER passed through to the iframe. It is parsed, the
// host is checked against an allowlist, the id is extracted and validated, and
// the embed URL is CONSTRUCTED from that id. Passing the raw URL through would
// let any URL stored in the CMS become an arbitrary embedded frame.
function videoEmbedSrc(rawUrl: string): string | null {
	let url: URL;
	try {
		url = new URL(rawUrl);
	} catch {
		return null;
	}

	if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;

	const host = url.hostname.replace(/^www\./, '');
	const segments = url.pathname.split('/').filter(Boolean);

	if (YOUTUBE_HOSTS.has(host)) {
		const vParam = url.searchParams.get('v');
		if (vParam) return buildYouTubeSrc(vParam);

		// /shorts/<id>, /embed/<id>, /live/<id>
		if (
			segments.length >= 2 &&
			(segments[0] === 'shorts' ||
				segments[0] === 'embed' ||
				segments[0] === 'live')
		) {
			return buildYouTubeSrc(segments[1]);
		}
		return null;
	}

	if (host === YOUTUBE_NOCOOKIE_HOST) {
		if (segments.length >= 2 && segments[0] === 'embed') {
			return buildYouTubeSrc(segments[1]);
		}
		return null;
	}

	if (host === 'youtu.be') {
		// A trailing slash or an extra path segment after the id (as some
		// share flows append) is tolerated — only the first segment is the id.
		return buildYouTubeSrc(segments[0] ?? '');
	}

	if (host === 'vimeo.com' || host === 'player.vimeo.com') {
		// Scan for the first path segment that looks like a video id, rather
		// than blindly popping the last one — an unlisted-video Share URL
		// (vimeo.com/<id>/<privacy-hash>) puts the hash AFTER the id.
		const idIndex = segments.findIndex((segment) => VIMEO_ID.test(segment));
		if (idIndex === -1) return null;
		const id = segments[idIndex];
		const hashSegment = segments[idIndex + 1];
		const hash =
			hashSegment && VIMEO_HASH.test(hashSegment) ? hashSegment : null;
		return `https://player.vimeo.com/video/${id}${hash ? `?h=${hash}` : ''}`;
	}

	return null;
}

const components: PortableTextComponents = {
	block: {
		normal: ({ children }) => `<p>${children}</p>`,
		h2: ({ children, value }) =>
			`<h2 id="${slugifyHeading(headingText(value))}">${children}</h2>`,
		h3: ({ children, value }) =>
			`<h3 id="${slugifyHeading(headingText(value))}">${children}</h3>`,
		h4: ({ children, value }) =>
			`<h4 id="${slugifyHeading(headingText(value))}">${children}</h4>`,
		blockquote: ({ children }) => `<blockquote>${children}</blockquote>`,
	},
	list: {
		bullet: ({ children }) => `<ul>${children}</ul>`,
		number: ({ children }) => `<ol>${children}</ol>`,
	},
	listItem: {
		bullet: ({ children }) => `<li>${children}</li>`,
		number: ({ children }) => `<li>${children}</li>`,
	},
	marks: {
		code: ({ children }) => `<code class="inline-code">${children}</code>`,
		underline: ({ children }) => `<u>${children}</u>`,
		'strike-through': ({ children }) => `<s>${children}</s>`,
		link: ({ children, value }) => {
			const classification = classifyHref(String(value?.href ?? ''));
			if (!classification.safe) return `<a>${children}</a>`;
			const attrs = classification.external
				? ' target="_blank" rel="noopener noreferrer"'
				: '';
			return `<a href="${escapeHtml(classification.href)}"${attrs}>${children}</a>`;
		},
	},
	types: {
		callout: ({ value }) => {
			const text = String(value?.text ?? '');
			if (!text) return '';
			const tone = CALLOUT_TONES.includes(String(value?.tone))
				? String(value.tone)
				: 'note';
			const title = value?.title
				? `<p class="callout-title">${escapeHtml(String(value.title))}</p>`
				: '';
			return `<aside class="callout callout--${tone}">${title}<p>${escapeHtml(text)}</p></aside>`;
		},
		videoEmbed: ({ value }) => {
			const src = videoEmbedSrc(String(value?.url ?? ''));
			if (!src) return '';
			const caption = value?.caption
				? `<figcaption>${escapeHtml(String(value.caption))}</figcaption>`
				: '';
			return `<figure class="video-embed"><iframe src="${escapeHtml(src)}" title="Embedded video" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>${caption}</figure>`;
		},
		// Dividers carry no content; the block's presence is the content.
		divider: () => '<hr class="body-divider" />',
		code: ({ value }) => {
			const filename = value?.filename
				? `<figcaption class="code-filename">${escapeHtml(String(value.filename))}</figcaption>`
				: '';
			const body =
				value?.html ?? plainCodeBlock(String(value?.code ?? ''));
			return `<figure class="code-block">${filename}${body}</figure>`;
		},
		image: ({ value }) => {
			if (!value?.url) return '';
			const alt = escapeHtml(String(value.alt ?? ''));
			const caption = value.caption
				? `<figcaption>${escapeHtml(String(value.caption))}</figcaption>`
				: '';
			const dims =
				value.width && value.height
					? ` width="${value.width}" height="${value.height}"`
					: '';
			const src = `${value.url}?w=1400&fm=webp&q=80`;
			return `<figure class="body-image"><img src="${escapeHtml(src)}" alt="${alt}"${dims} loading="lazy" decoding="async" />${caption}</figure>`;
		},
	},
};

// toHTML is synchronous but Shiki's setup is not, so code blocks are
// highlighted into a `html` field first and the component reads that.
async function withHighlightedCode(
	blocks: Array<Record<string, unknown>>
): Promise<Array<Record<string, unknown>>> {
	if (!blocks.some((b) => b?._type === 'code')) return blocks;

	const highlighter = await getHighlighter();

	return blocks.map((b) => {
		if (b?._type !== 'code') return b;
		const code = typeof b.code === 'string' ? b.code : '';
		const lang = LANGS.includes(String(b.language)) ? String(b.language) : null;
		const html = lang
			? highlighter.codeToHtml(code, { lang, theme: THEME })
			: plainCodeBlock(code);
		return { ...b, html };
	});
}

export async function renderBody(blocks: unknown): Promise<string> {
	if (!Array.isArray(blocks) || blocks.length === 0) return '';
	const prepared = await withHighlightedCode(
		blocks as Array<Record<string, unknown>>
	);
	return toHTML(prepared as never, { components });
}
