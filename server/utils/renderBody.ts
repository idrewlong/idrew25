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

const SITE_HOSTNAMES = new Set(['idrewlong.com', 'www.idrewlong.com']);

// Only these link shapes are safe to emit an href for: absolute http(s),
// mailto, and same-site relative/anchor links. Anything else (javascript:,
// data:, vbscript:, etc.) is rendered as plain text with no href.
function isSafeHref(href: string): boolean {
	if (href.startsWith('/') || href.startsWith('#')) return true;
	if (/^mailto:/i.test(href)) return true;
	try {
		const url = new URL(href);
		return url.protocol === 'http:' || url.protocol === 'https:';
	} catch {
		return false;
	}
}

// Substring matching on the href (e.g. `.includes('idrewlong.com')`) is
// spoofable by `idrewlong.com.evil.com`, so the hostname is parsed and
// compared exactly instead.
function isExternalHref(href: string): boolean {
	try {
		const url = new URL(href);
		if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;
		return !SITE_HOSTNAMES.has(url.hostname);
	} catch {
		return false;
	}
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

const components: PortableTextComponents = {
	block: {
		normal: ({ children }) => `<p>${children}</p>`,
		h2: ({ children, value }) =>
			`<h2 id="${slugifyHeading(headingText(value))}">${children}</h2>`,
		h3: ({ children, value }) =>
			`<h3 id="${slugifyHeading(headingText(value))}">${children}</h3>`,
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
		link: ({ children, value }) => {
			const href = String(value?.href ?? '');
			if (!isSafeHref(href)) return `<a>${children}</a>`;
			const attrs = isExternalHref(href)
				? ' target="_blank" rel="noopener noreferrer"'
				: '';
			return `<a href="${escapeHtml(href)}"${attrs}>${children}</a>`;
		},
	},
	types: {
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
