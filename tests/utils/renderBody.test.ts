import { describe, it, expect } from 'vitest';
import {
	renderBody,
	slugifyHeading,
	extractHeadings,
} from '../../server/utils/renderBody';

const block = (text: string, style = 'normal') => ({
	_type: 'block',
	_key: 'k1',
	style,
	markDefs: [],
	children: [{ _type: 'span', _key: 's1', text, marks: [] }],
});

const linkBlock = (href: string, text = 'link') => ({
	_type: 'block',
	_key: 'k1',
	style: 'normal',
	markDefs: [{ _key: 'l1', _type: 'link', href }],
	children: [{ _type: 'span', _key: 's1', text, marks: ['l1'] }],
});

describe('slugifyHeading', () => {
	it('lowercases and hyphenates', () => {
		expect(slugifyHeading('My Great Heading')).toBe('my-great-heading');
	});

	it('strips punctuation', () => {
		expect(slugifyHeading("What's New?")).toBe('whats-new');
	});
});

describe('renderBody', () => {
	it('returns an empty string for missing or empty content', async () => {
		expect(await renderBody(undefined)).toBe('');
		expect(await renderBody([])).toBe('');
		expect(await renderBody(null)).toBe('');
	});

	it('renders paragraphs', async () => {
		expect(await renderBody([block('Hello')])).toContain('<p>Hello</p>');
	});

	it('gives headings an id so they can be linked to', async () => {
		const html = await renderBody([block('My Heading', 'h2')]);
		expect(html).toContain('<h2 id="my-heading">My Heading</h2>');
	});

	it('opens external links safely', async () => {
		const html = await renderBody([
			{
				_type: 'block',
				_key: 'k1',
				style: 'normal',
				markDefs: [
					{ _key: 'l1', _type: 'link', href: 'https://example.com' },
				],
				children: [
					{ _type: 'span', _key: 's1', text: 'link', marks: ['l1'] },
				],
			},
		]);
		expect(html).toContain('rel="noopener noreferrer"');
		expect(html).toContain('target="_blank"');
	});

	it('refuses to emit an unsafe href scheme', async () => {
		const html = await renderBody([linkBlock('javascript:alert(1)')]);
		expect(html).not.toContain('href="javascript:');
		expect(html).toContain('link');
	});

	it('opens absolute https links in a new tab', async () => {
		const html = await renderBody([linkBlock('https://example.com')]);
		expect(html).toContain('target="_blank"');
		expect(html).toContain('rel="noopener noreferrer"');
	});

	it('keeps relative links in the same tab', async () => {
		const html = await renderBody([linkBlock('/blog/other/')]);
		expect(html).toContain('href="/blog/other/"');
		expect(html).not.toContain('target="_blank"');
	});

	it('resolves a protocol-relative href to its absolute external URL', async () => {
		const html = await renderBody([linkBlock('//evil.com/x')]);
		expect(html).not.toContain('href="//evil.com/x"');
		expect(html).toContain('href="https://evil.com/x"');
		expect(html).toContain('target="_blank"');
		expect(html).toContain('rel="noopener noreferrer"');
	});

	it('resolves a slash-backslash href to its absolute external URL', async () => {
		// '/' + '\' + 'evil.com' — the WHATWG URL parser normalises the
		// backslash to a slash for http(s), so this resolves off-site even
		// though it reads like a same-site path.
		const slashBackslash = '/\\evil.com';
		const html = await renderBody([linkBlock(slashBackslash)]);
		expect(html).not.toContain(`href="${slashBackslash}"`);
		expect(html).toContain('href="https://evil.com/"');
		expect(html).toContain('target="_blank"');
		expect(html).toContain('rel="noopener noreferrer"');
	});

	it('resolves a double-backslash href to its absolute external URL', async () => {
		// '\' + '\' + 'evil.com' — no leading slash at all, but two leading
		// backslashes behave like '//' for http(s).
		const doubleBackslash = '\\\\evil.com';
		const html = await renderBody([linkBlock(doubleBackslash)]);
		expect(html).not.toContain(`href="${doubleBackslash}"`);
		expect(html).toContain('href="https://evil.com/"');
		expect(html).toContain('target="_blank"');
		expect(html).toContain('rel="noopener noreferrer"');
	});

	it('rejects data: URIs', async () => {
		const html = await renderBody([linkBlock('data:text/html,x')]);
		expect(html).not.toContain('href="data:');
		expect(html).toContain('link');
	});

	it('keeps anchor links internal', async () => {
		const html = await renderBody([linkBlock('#anchor')]);
		expect(html).toContain('href="#anchor"');
		expect(html).not.toContain('target="_blank"');
	});

	it('treats the www hostname as internal, not external', async () => {
		const html = await renderBody([
			linkBlock('https://www.idrewlong.com/contact/'),
		]);
		expect(html).toContain('href="https://www.idrewlong.com/contact/"');
		expect(html).not.toContain('target="_blank"');
	});

	it('keeps a mailto href', async () => {
		const html = await renderBody([linkBlock('mailto:hello@idrewlong.com')]);
		expect(html).toContain('href="mailto:hello@idrewlong.com"');
		expect(html).not.toContain('target="_blank"');
	});

	it('treats a lookalike hostname as external, not a substring match', async () => {
		const html = await renderBody([
			linkBlock('https://idrewlong.com.evil.com/x'),
		]);
		expect(html).toContain('target="_blank"');
		expect(html).toContain('rel="noopener noreferrer"');
	});

	it('highlights code and keeps the filename', async () => {
		const html = await renderBody([
			{
				_type: 'code',
				_key: 'c1',
				language: 'typescript',
				filename: 'app.ts',
				code: 'const x = 1;',
			},
		]);
		expect(html).toContain('app.ts');
		expect(html).toContain('<pre');
		expect(html).toContain('shiki');
	});

	it('falls back to plain text for an unknown language', async () => {
		const html = await renderBody([
			{ _type: 'code', _key: 'c1', language: 'brainfuck', code: '+++' },
		]);
		expect(html).toContain('<pre');
		expect(html).toContain('+++');
	});

	it('escapes HTML inside code blocks', async () => {
		const html = await renderBody([
			{
				_type: 'code',
				_key: 'c1',
				language: 'text',
				code: '<script>alert(1)</script>',
			},
		]);
		expect(html).not.toContain('<script>alert(1)</script>');
		expect(html).toContain('&lt;script&gt;');
	});

	it('renders h4 with a slugified id', async () => {
		const html = await renderBody([block('Smaller Heading', 'h4')]);
		expect(html).toContain('<h4 id="smaller-heading">Smaller Heading</h4>');
	});

	it('renders the underline decorator', async () => {
		const html = await renderBody([
			{
				_type: 'block',
				_key: 'k1',
				style: 'normal',
				markDefs: [],
				children: [
					{ _type: 'span', _key: 's1', text: 'under', marks: ['underline'] },
				],
			},
		]);
		expect(html).toContain('<u>under</u>');
	});

	it('renders the strikethrough decorator', async () => {
		const html = await renderBody([
			{
				_type: 'block',
				_key: 'k1',
				style: 'normal',
				markDefs: [],
				children: [
					{ _type: 'span', _key: 's1', text: 'gone', marks: ['strike-through'] },
				],
			},
		]);
		expect(html).toContain('<s>gone</s>');
	});

	it('renders a divider block', async () => {
		const html = await renderBody([{ _type: 'divider', _key: 'd1' }]);
		expect(html).toContain('<hr class="body-divider" />');
	});

	it('renders a callout with its tone, title and text', async () => {
		const html = await renderBody([
			{
				_type: 'callout',
				_key: 'c1',
				tone: 'warning',
				title: 'Careful',
				text: 'This deletes things.',
			},
		]);
		expect(html).toContain('callout--warning');
		expect(html).toContain('Careful');
		expect(html).toContain('This deletes things.');
	});

	it('escapes HTML inside a callout', async () => {
		const html = await renderBody([
			{
				_type: 'callout',
				_key: 'c1',
				tone: 'note',
				title: '<script>a</script>',
				text: '<img onerror=alert(1)>',
			},
		]);
		expect(html).not.toContain('<script>a</script>');
		expect(html).not.toContain('<img onerror');
		expect(html).toContain('&lt;script&gt;');
	});

	it('falls back to the note tone for an unknown tone', async () => {
		const html = await renderBody([
			{ _type: 'callout', _key: 'c1', tone: 'explode', text: 'hi' },
		]);
		expect(html).toContain('callout--note');
		expect(html).not.toContain('callout--explode');
	});

	it('splits callout text on blank lines into separate paragraphs', async () => {
		const html = await renderBody([
			{
				_type: 'callout',
				_key: 'c1',
				tone: 'note',
				text: 'First paragraph.\n\nSecond paragraph.',
			},
		]);
		expect(html).toContain(
			'<p>First paragraph.</p><p>Second paragraph.</p>'
		);
	});

	it('escapes each paragraph when splitting callout text', async () => {
		const html = await renderBody([
			{
				_type: 'callout',
				_key: 'c1',
				tone: 'note',
				text: '<b>one</b>\n\n<b>two</b>',
			},
		]);
		expect(html).not.toContain('<b>one</b>');
		expect(html).toContain('<p>&lt;b&gt;one&lt;/b&gt;</p>');
		expect(html).toContain('<p>&lt;b&gt;two&lt;/b&gt;</p>');
	});

	it('embeds a YouTube watch URL by constructing the embed src', async () => {
		const html = await renderBody([
			{
				_type: 'videoEmbed',
				_key: 'v1',
				url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
			},
		]);
		expect(html).toContain(
			'src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"'
		);
		// The author's original URL must never reach the iframe src.
		expect(html).not.toContain('watch?v=');
	});

	it('embeds a youtu.be short URL', async () => {
		const html = await renderBody([
			{ _type: 'videoEmbed', _key: 'v1', url: 'https://youtu.be/dQw4w9WgXcQ' },
		]);
		expect(html).toContain(
			'src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"'
		);
	});

	it('uses the caption as the video iframe title when present', async () => {
		const html = await renderBody([
			{
				_type: 'videoEmbed',
				_key: 'v1',
				url: 'https://youtu.be/dQw4w9WgXcQ',
				caption: 'A demo clip',
			},
		]);
		expect(html).toContain('title="A demo clip"');
		expect(html).not.toContain('title="Embedded video"');
	});

	it('falls back to a generic iframe title when there is no caption', async () => {
		const html = await renderBody([
			{
				_type: 'videoEmbed',
				_key: 'v1',
				url: 'https://youtu.be/dQw4w9WgXcQ',
			},
		]);
		expect(html).toContain('title="Embedded video"');
	});

	it('escapes the caption used as the video iframe title', async () => {
		const html = await renderBody([
			{
				_type: 'videoEmbed',
				_key: 'v1',
				url: 'https://youtu.be/dQw4w9WgXcQ',
				caption: '"><script>alert(1)</script>',
			},
		]);
		expect(html).not.toContain('<script>alert(1)</script>');
		expect(html).not.toContain('title="">');
	});

	it('embeds a Vimeo URL', async () => {
		const html = await renderBody([
			{ _type: 'videoEmbed', _key: 'v1', url: 'https://vimeo.com/123456789' },
		]);
		expect(html).toContain('src="https://player.vimeo.com/video/123456789"');
	});

	it('embeds an unlisted Vimeo URL and carries the privacy hash through as ?h=', async () => {
		const html = await renderBody([
			{
				_type: 'videoEmbed',
				_key: 'v1',
				url: 'https://vimeo.com/123456789/abc123def4',
			},
		]);
		expect(html).toContain(
			'src="https://player.vimeo.com/video/123456789?h=abc123def4"'
		);
	});

	it('embeds a YouTube Shorts URL', async () => {
		const html = await renderBody([
			{
				_type: 'videoEmbed',
				_key: 'v1',
				url: 'https://www.youtube.com/shorts/dQw4w9WgXcQ',
			},
		]);
		expect(html).toContain(
			'src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"'
		);
	});

	it('embeds a YouTube /embed/ URL', async () => {
		const html = await renderBody([
			{
				_type: 'videoEmbed',
				_key: 'v1',
				url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
			},
		]);
		expect(html).toContain(
			'src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"'
		);
	});

	it('embeds a YouTube /live/ URL', async () => {
		const html = await renderBody([
			{
				_type: 'videoEmbed',
				_key: 'v1',
				url: 'https://www.youtube.com/live/dQw4w9WgXcQ',
			},
		]);
		expect(html).toContain(
			'src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"'
		);
	});

	it('embeds a music.youtube.com watch URL', async () => {
		const html = await renderBody([
			{
				_type: 'videoEmbed',
				_key: 'v1',
				url: 'https://music.youtube.com/watch?v=dQw4w9WgXcQ',
			},
		]);
		expect(html).toContain(
			'src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"'
		);
	});

	it('embeds a youtube-nocookie.com embed URL', async () => {
		const html = await renderBody([
			{
				_type: 'videoEmbed',
				_key: 'v1',
				url: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
			},
		]);
		expect(html).toContain(
			'src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"'
		);
	});

	it('embeds a youtu.be URL with a trailing slash', async () => {
		const html = await renderBody([
			{
				_type: 'videoEmbed',
				_key: 'v1',
				url: 'https://youtu.be/dQw4w9WgXcQ/',
			},
		]);
		expect(html).toContain(
			'src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"'
		);
	});

	it('embeds a youtu.be URL with an extra path segment', async () => {
		const html = await renderBody([
			{
				_type: 'videoEmbed',
				_key: 'v1',
				url: 'https://youtu.be/dQw4w9WgXcQ/extra',
			},
		]);
		expect(html).toContain(
			'src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"'
		);
	});

	it('renders nothing for a video on an unknown host', async () => {
		for (const url of [
			'https://evil.com/watch?v=abc',
			'https://youtube.com.evil.com/watch?v=abc',
			'javascript:alert(1)',
			'not a url at all',
			'',
		]) {
			const html = await renderBody([
				{ _type: 'videoEmbed', _key: 'v1', url },
			]);
			expect(html).not.toContain('<iframe');
		}
	});

	it('resists host-spoofing, scheme and homograph tricks for video embeds', async () => {
		for (const url of [
			// userinfo trick: hostname actually resolves to evil.com
			'https://youtube.com@evil.com/watch?v=dQw4w9WgXcQ',
			// no dot after "www" — not the stripped prefix
			'https://wwwyoutube.com/watch?v=dQw4w9WgXcQ',
			// IDN homograph of youtube.com (Cyrillic characters)
			'https://xn--ytube-4ve.com/watch?v=dQw4w9WgXcQ',
			// trailing dot on an otherwise-allowlisted host
			'https://youtube.com./watch?v=dQw4w9WgXcQ',
			'https://vimeo.com./123456789',
			'blob:https://youtube.com/dQw4w9WgXcQ',
			'data:text/html,<iframe src=https://youtube.com>',
			// protocol-relative — no scheme for `new URL` to parse
			'//youtube.com/watch?v=dQw4w9WgXcQ',
			// vimeo lookalike host
			'https://vimeo.com.evil.com/123456789',
			// youtube-nocookie lookalike host
			'https://evil-youtube-nocookie.com/embed/dQw4w9WgXcQ',
		]) {
			const html = await renderBody([
				{ _type: 'videoEmbed', _key: 'v1', url },
			]);
			expect(html).not.toContain('<iframe');
		}
	});

	it('rejects a video id containing unexpected characters', async () => {
		const html = await renderBody([
			{
				_type: 'videoEmbed',
				_key: 'v1',
				url: 'https://www.youtube.com/watch?v=abc"onload="alert(1)',
			},
		]);
		expect(html).not.toContain('<iframe');
	});

	it('renders body images with dimensions and lazy loading', async () => {
		const html = await renderBody([
			{
				_type: 'image',
				_key: 'i1',
				url: 'https://cdn.sanity.io/x.png',
				alt: 'A diagram',
				width: 1200,
				height: 800,
			},
		]);
		expect(html).toContain('alt="A diagram"');
		expect(html).toContain('width="1200"');
		expect(html).toContain('loading="lazy"');
	});
});

describe('heading ids', () => {
	it('gives repeated headings unique ids', async () => {
		const html = await renderBody([
			block('Setup', 'h2'),
			block('Setup', 'h3'),
			block('Setup', 'h2'),
		]);
		expect(html).toContain('<h2 id="setup">');
		expect(html).toContain('<h3 id="setup-2">');
		expect(html).toContain('<h2 id="setup-3">');
	});

	it('falls back to a usable id when the heading has no slug-safe text', async () => {
		const html = await renderBody([block('???', 'h2')]);
		expect(html).toContain('<h2 id="section">');
	});
});

describe('extractHeadings', () => {
	it('returns an empty list for missing content', () => {
		expect(extractHeadings(undefined)).toEqual([]);
		expect(extractHeadings([])).toEqual([]);
	});

	it('lists h2 and h3 in order with the ids renderBody gives them', async () => {
		const blocks = [
			block('Intro'),
			block('Why Go', 'h2'),
			block('The Format', 'h3'),
			block('Fine Print', 'h4'),
			block('Why Go', 'h2'),
		];
		const headings = extractHeadings(blocks);
		expect(headings).toEqual([
			{ id: 'why-go', text: 'Why Go', level: 2 },
			{ id: 'the-format', text: 'The Format', level: 3 },
			{ id: 'why-go-2', text: 'Why Go', level: 2 },
		]);

		const html = await renderBody(blocks);
		for (const h of headings) expect(html).toContain(`id="${h.id}"`);
	});
});
