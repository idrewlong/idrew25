import { defineField, defineType } from 'sanity';
import { ColorInput } from '../components/ColorInput';

export const feature = defineType({
	name: 'feature',
	title: 'Feature (published elsewhere)',
	type: 'document',
	description: 'Articles written for another publication. These link out.',
	groups: [
		{ name: 'content', title: 'Content', default: true },
		{ name: 'media', title: 'Media' },
		{ name: 'meta', title: 'Meta' },
	],
	fields: [
		defineField({
			name: 'title',
			group: 'content',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'publisher',
			group: 'content',
			type: 'string',
			initialValue: 'Mad Genius',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'externalUrl',
			group: 'content',
			title: 'External URL',
			type: 'url',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'publishedAt',
			group: 'meta',
			title: 'Published at',
			type: 'datetime',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'description',
			group: 'content',
			type: 'text',
			rows: 3,
			validation: (rule) => rule.required().max(200),
		}),
		defineField({
			name: 'image',
			group: 'media',
			type: 'image',
			options: { hotspot: true },
			fields: [
				{
					name: 'alt',
					type: 'string',
					title: 'Alt text',
					validation: (rule) => rule.required(),
				},
			],
		}),
		defineField({
			name: 'accentColor',
			group: 'media',
			title: 'Accent colour',
			type: 'string',
			description: 'Hex value for the card background, e.g. #de6daa',
			validation: (rule) =>
				rule.regex(/^#[0-9a-fA-F]{6}$/, { name: 'hex colour' }),
			components: { input: ColorInput },
		}),
		defineField({
			name: 'tags',
			group: 'meta',
			type: 'array',
			of: [{ type: 'reference', to: [{ type: 'tag' }] }],
		}),
	],
	preview: {
		select: {
			title: 'title',
			publisher: 'publisher',
			publishedAt: 'publishedAt',
			media: 'image',
		},
		prepare({ title, publisher, publishedAt, media }) {
			const date = publishedAt
				? new Date(publishedAt).toLocaleDateString('en-US', {
						year: 'numeric',
						month: 'short',
					})
				: '';
			return {
				title,
				subtitle: [publisher, date].filter(Boolean).join(' · '),
				media,
			};
		},
	},
});
