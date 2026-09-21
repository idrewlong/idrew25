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

	it('rejects protocol-relative hrefs instead of treating them as internal', async () => {
		const html = await renderBody([linkBlock('//evil.com/x')]);
		expect(html).not.toContain('href="//evil.com/x"');
		expect(html).not.toContain('href="');
		expect(html).toContain('link');
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
