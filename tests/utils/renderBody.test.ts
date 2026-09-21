import { describe, it, expect } from 'vitest';
import { renderBody, slugifyHeading } from '../../server/utils/renderBody';

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

	it('embeds a Vimeo URL', async () => {
		const html = await renderBody([
			{ _type: 'videoEmbed', _key: 'v1', url: 'https://vimeo.com/123456789' },
		]);
		expect(html).toContain('src="https://player.vimeo.com/video/123456789"');
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
