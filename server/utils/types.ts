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

// A heading in a post body, as listed in its table of contents.
export interface Heading {
	id: string;
	text: string;
	level: number;
}

export interface Post extends PostSummary {
	bodyHtml: string;
	headings: Heading[];
}
