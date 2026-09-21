import type { StructureResolver } from 'sanity/structure';

// Drafts first: the question you actually have when you open the Studio is
// "what am I in the middle of", not "list everything".
export const structure: StructureResolver = (S) =>
	S.list()
		.title('Content')
		.items([
			S.listItem()
				.title('Drafts')
				.id('drafts')
				.child(
					S.documentList()
						.title('Drafts')
						.apiVersion('2024-09-26')
						.filter(
							'_id in path("drafts.**") && _type in ["post"]'
						)
						.defaultOrdering([
							{ field: '_updatedAt', direction: 'desc' },
						])
				),
			S.divider(),
			S.listItem()
				.title('Posts')
				.id('posts')
				.child(
					S.documentTypeList('post')
						.title('Posts')
						.defaultOrdering([
							{ field: 'publishedAt', direction: 'desc' },
						])
				),
			S.divider(),
			S.listItem()
				.title('Tags')
				.id('tags')
				.child(
					S.documentTypeList('tag')
						.title('Tags')
						.defaultOrdering([{ field: 'title', direction: 'asc' }])
				),
		]);
