import { defineField, defineType } from 'sanity';

export const post = defineType({
	name: 'post',
	title: 'Post',
	type: 'document',
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
			name: 'slug',
			group: 'meta',
			type: 'slug',
			options: { source: 'title', maxLength: 96 },
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'publishedAt',
			group: 'meta',
			title: 'Published at',
			type: 'datetime',
			initialValue: () => new Date().toISOString(),
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'description',
			group: 'meta',
			type: 'text',
			rows: 3,
			description: 'Used as the meta description and card summary.',
			validation: (rule) => rule.required().max(200),
		}),
		defineField({
			name: 'coverImage',
			group: 'media',
			title: 'Cover image',
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
			name: 'tags',
			group: 'meta',
			type: 'array',
			of: [{ type: 'reference', to: [{ type: 'tag' }] }],
		}),
		defineField({
			name: 'body',
			group: 'content',
			type: 'blockContent',
		}),
	],
	orderings: [
		{
			title: 'Published, newest first',
			name: 'publishedAtDesc',
			by: [{ field: 'publishedAt', direction: 'desc' }],
		},
	],
	preview: {
		select: {
			title: 'title',
			publishedAt: 'publishedAt',
			media: 'coverImage',
		},
		prepare({ title, publishedAt, media }) {
			return {
				title,
				subtitle: publishedAt
					? new Date(publishedAt).toLocaleDateString('en-US', {
							year: 'numeric',
							month: 'short',
							day: 'numeric',
						})
					: 'No date',
				media,
			};
		},
	},
});
