import { defineField, defineType } from 'sanity';

export const post = defineType({
	name: 'post',
	title: 'Post',
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'slug',
			type: 'slug',
			options: { source: 'title', maxLength: 96 },
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'publishedAt',
			title: 'Published at',
			type: 'datetime',
			initialValue: () => new Date().toISOString(),
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'description',
			type: 'text',
			rows: 3,
			description: 'Used as the meta description and card summary.',
			validation: (rule) => rule.required().max(200),
		}),
		defineField({
			name: 'coverImage',
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
			type: 'array',
			of: [{ type: 'reference', to: [{ type: 'tag' }] }],
		}),
		defineField({ name: 'body', type: 'blockContent' }),
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
