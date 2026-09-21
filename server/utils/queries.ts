const IMAGE_PROJECTION = `{
	"url": asset->url,
	"alt": coalesce(alt, ""),
	"width": asset->metadata.dimensions.width,
	"height": asset->metadata.dimensions.height
}`;

const TAGS_PROJECTION = `"tags": coalesce(tags[]->{ title, "slug": slug.current }, [])`;

const POST_SUMMARY_PROJECTION = `{
	title,
	"slug": slug.current,
	publishedAt,
	description,
	"coverImage": coverImage${IMAGE_PROJECTION},
	${TAGS_PROJECTION}
}`;

export function postsQuery(tag?: string): string {
	const base = '_type == "post" && defined(slug.current)';
	const filter = tag ? `${base} && $tag in tags[]->slug.current` : base;
	return `*[${filter}] | order(publishedAt desc) ${POST_SUMMARY_PROJECTION}`;
}

// Image assets are expanded inline here so renderBody stays a pure function
// with no Sanity client dependency.
export const POST_BY_SLUG_QUERY = `*[_type == "post" && slug.current == $slug][0]{
	title,
	"slug": slug.current,
	publishedAt,
	description,
	"coverImage": coverImage${IMAGE_PROJECTION},
	${TAGS_PROJECTION},
	body[]{
		...,
		_type == "image" => {
			...,
			"url": asset->url,
			"width": asset->metadata.dimensions.width,
			"height": asset->metadata.dimensions.height
		}
	}
}`;

export const FEATURES_QUERY = `*[_type == "feature"] | order(publishedAt desc){
	title,
	publisher,
	externalUrl,
	publishedAt,
	description,
	"image": image${IMAGE_PROJECTION},
	"accentColor": coalesce(accentColor, "#f5f5f4"),
	${TAGS_PROJECTION}
}`;

export const POST_SLUGS_QUERY = `*[_type == "post" && defined(slug.current)]{
	"slug": slug.current,
	"lastmod": coalesce(_updatedAt, publishedAt)
}`;

export const TAGS_QUERY = `*[
	_type == "tag" && count(*[_type == "post" && references(^._id)]) > 0
]{ title, "slug": slug.current } | order(title asc)`;
