import { defineArrayMember, defineType } from 'sanity';

// Mirrors the host + id checks in videoEmbedSrc, server/utils/renderBody.ts.
// The Studio cannot import from the Nuxt app, so this is a hand-kept
// duplicate — an unembeddable URL here saves fine and renders nothing live,
// so this exists to catch it at authoring time instead. Keep both in sync
// when adding or changing a supported host or id shape.
const VIDEO_ID = /^[A-Za-z0-9_-]{6,20}$/;
const VIMEO_ID = /^[0-9]{6,12}$/;
const YOUTUBE_HOSTS = new Set([
	'youtube.com',
	'm.youtube.com',
	'music.youtube.com',
]);
const YOUTUBE_NOCOOKIE_HOST = 'youtube-nocookie.com';

function isEmbeddableVideoUrl(raw: string): boolean {
	let url: URL;
	try {
		url = new URL(raw);
	} catch {
		return false;
	}

	if (url.protocol !== 'https:' && url.protocol !== 'http:') return false;

	const host = url.hostname.replace(/^www\./, '');
	const segments = url.pathname.split('/').filter(Boolean);

	if (YOUTUBE_HOSTS.has(host)) {
		const vParam = url.searchParams.get('v');
		if (vParam) return VIDEO_ID.test(vParam);
		return (
			segments.length >= 2 &&
			(segments[0] === 'shorts' ||
				segments[0] === 'embed' ||
				segments[0] === 'live') &&
			VIDEO_ID.test(segments[1])
		);
	}

	if (host === YOUTUBE_NOCOOKIE_HOST) {
		return (
			segments.length >= 2 &&
			segments[0] === 'embed' &&
			VIDEO_ID.test(segments[1])
		);
	}

	if (host === 'youtu.be') {
		return VIDEO_ID.test(segments[0] ?? '');
	}

	if (host === 'vimeo.com' || host === 'player.vimeo.com') {
		return segments.some((segment) => VIMEO_ID.test(segment));
	}

	return false;
}

export const blockContent = defineType({
	name: 'blockContent',
	title: 'Body',
	type: 'array',
	of: [
		defineArrayMember({
			type: 'block',
			styles: [
				{ title: 'Normal', value: 'normal' },
				{ title: 'Heading 2', value: 'h2' },
				{ title: 'Heading 3', value: 'h3' },
				{ title: 'Heading 4', value: 'h4' },
				{ title: 'Quote', value: 'blockquote' },
			],
			lists: [
				{ title: 'Bullet', value: 'bullet' },
				{ title: 'Numbered', value: 'number' },
			],
			marks: {
				decorators: [
					{ title: 'Strong', value: 'strong' },
					{ title: 'Emphasis', value: 'em' },
					{ title: 'Code', value: 'code' },
					{ title: 'Underline', value: 'underline' },
					{ title: 'Strike', value: 'strike-through' },
				],
				annotations: [
					{
						name: 'link',
						type: 'object',
						title: 'Link',
						fields: [
							{
								name: 'href',
								type: 'url',
								validation: (rule) => rule.required(),
							},
						],
					},
				],
			},
		}),
		defineArrayMember({
			type: 'image',
			options: { hotspot: true },
			fields: [
				{
					name: 'alt',
					type: 'string',
					title: 'Alt text',
					validation: (rule) => rule.required(),
				},
				{ name: 'caption', type: 'string', title: 'Caption' },
			],
		}),
		defineArrayMember({
			name: 'callout',
			type: 'object',
			title: 'Callout',
			fields: [
				{
					name: 'tone',
					type: 'string',
					title: 'Tone',
					initialValue: 'note',
					options: {
						list: [
							{ title: 'Note', value: 'note' },
							{ title: 'Warning', value: 'warning' },
							{ title: 'Tip', value: 'tip' },
						],
						layout: 'radio',
					},
					validation: (rule) => rule.required(),
				},
				{ name: 'title', type: 'string', title: 'Title' },
				{
					name: 'text',
					type: 'text',
					rows: 3,
					title: 'Text',
					validation: (rule) => rule.required(),
				},
			],
			preview: {
				select: { title: 'title', subtitle: 'text' },
				prepare: ({ title, subtitle }) => ({
					title: title || 'Callout',
					subtitle,
				}),
			},
		}),
		defineArrayMember({
			name: 'videoEmbed',
			type: 'object',
			title: 'Video',
			fields: [
				{
					name: 'url',
					type: 'url',
					title: 'YouTube or Vimeo URL',
					description:
						'Only YouTube and Vimeo are embedded. Other hosts render nothing.',
					validation: (rule) =>
						rule.required().custom((value) => {
							if (!value) return true;
							return isEmbeddableVideoUrl(value)
								? true
								: 'This URL will not embed. Use a YouTube watch, shorts, embed, live or youtu.be link (youtube.com, m.youtube.com, music.youtube.com, youtube-nocookie.com or youtu.be), or a Vimeo link (vimeo.com or player.vimeo.com).';
						}),
				},
				{ name: 'caption', type: 'string', title: 'Caption' },
			],
			preview: {
				select: { subtitle: 'url' },
				prepare: ({ subtitle }) => ({ title: 'Video', subtitle }),
			},
		}),
		defineArrayMember({
			name: 'divider',
			type: 'object',
			title: 'Divider',
			fields: [
				{
					name: 'note',
					type: 'string',
					hidden: true,
					description: 'Dividers carry no content.',
				},
			],
			preview: { prepare: () => ({ title: '— Divider —' }) },
		}),
		defineArrayMember({
			type: 'code',
			options: {
				languageAlternatives: [
					{ title: 'TypeScript', value: 'typescript' },
					{ title: 'JavaScript', value: 'javascript' },
					{ title: 'Vue', value: 'vue' },
					{ title: 'HTML', value: 'html' },
					{ title: 'CSS', value: 'css' },
					{ title: 'Bash', value: 'bash' },
					{ title: 'JSON', value: 'json' },
					{ title: 'Python', value: 'python' },
					{ title: 'Plain text', value: 'text' },
				],
				withFilename: true,
			},
		}),
	],
});
