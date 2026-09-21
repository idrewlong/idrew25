export interface SanityImage {
	url: string;
	alt: string;
	width: number | null;
	height: number | null;
}

export interface Tag {
	title: string;
	slug: string;
}

export interface PostSummary {
	title: string;
	slug: string;
	publishedAt: string;
	description: string;
	coverImage: SanityImage | null;
	tags: Tag[];
}

export interface Post extends PostSummary {
	bodyHtml: string;
}
