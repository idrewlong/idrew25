import { defineArrayMember, defineType } from 'sanity';

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
