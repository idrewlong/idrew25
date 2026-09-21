# Blog — Design

**Date:** 2026-09-20
**Status:** Approved, not yet implemented
**Site:** idrewlong.com (Nuxt 4, Vue 3, Tailwind v4, Vercel)

## Purpose

Add a blog to idrewlong.com, authored through a web editor rather than by
committing markdown. Keep the existing externally-published articles as
credentials, clearly distinct from posts written here.

## Decisions

| Decision | Choice | Why |
|---|---|---|
| Content source | Sanity | Web editor was a requirement; generous free tier; Nuxt 4-compatible tooling |
| Studio location | Separate `studio/` folder, deployed to `idrewlong.sanity.studio` | The `sanity` package peers on React 19 + styled-components; embedding it would pull React into a Vue app |
| Rendering | ISR, 60s | Posts live within a minute with no webhook, no deploy hook, no token to rotate |
| Body rendering | Portable Text → HTML on the server | Keeps Shiki and the Portable Text renderer out of the client bundle entirely |
| Data access | Nitro server routes | One data path that serves published and draft content, and the only way to guarantee Shiki stays server-side |
| v1 scope | Code highlighting, tags + filtering, draft preview | Chosen explicitly; RSS deferred |

## Content model

Three Sanity document types.

```
post                            feature                      tag
  title        string             title       string           title  string
  slug         slug (from title)  publisher   string           slug   slug
  publishedAt  datetime           externalUrl url
  description  text (~160)        publishedAt datetime
  coverImage   image + alt        description text
  tags         ref[] -> tag       image       image + alt
  body         portableText       accentColor string (hex)
                                  tags        ref[] -> tag
```

`feature` has no `slug` and no `body`. It cannot be opened on this site, only
linked out to. Keeping it a separate type rather than a `kind` flag on `post`
means the Studio cannot produce a half-valid document — a feature with a body,
or a post with no slug — and the GROQ queries stay trivial.

`accentColor` stores a hex value, replacing today's
`bgColor: 'from-[#de6daa] to-[#de6daa]'`. Tailwind class strings cannot live in
a CMS: Tailwind v4 generates utilities by scanning source files at build time,
and classes that exist only in CMS data are never generated. A hex applied
inline is what the current card design actually uses the value for anyway.

`body` supports: headings (h2, h3), bold/italic, links, bullet and numbered
lists, blockquotes, images with alt text and optional caption, and a `code`
block (`@sanity/code-input`) storing `{ code, language, filename }`.

## Architecture

```
Sanity (content)
   |
   |  GROQ, server-side only
   v
Nitro server routes  ---- Shiki + @portabletext/to-html ---->  HTML string
   |
   |  useFetch
   v
Vue pages/components  ---- v-html ---->  rendered post
```

Pages never talk to Sanity directly. Every read goes through a Nitro route,
which fetches, renders Portable Text to HTML, highlights code, and returns
plain serialisable data. Three consequences: Shiki (large) and the Portable
Text renderer never reach the browser; the draft-preview path is the same code
path as the published one with one flag changed; and client-side navigation to
a post costs one small JSON request rather than a CMS round trip plus render.

The trade-off is that post bodies render via `v-html`, so interactive Vue
components cannot be embedded inside body content. For a writing-focused blog
that is an acceptable exchange for the bundle savings. Images in body content
are emitted as `<img>` with explicit width/height and a Sanity CDN `srcset`
rather than `<NuxtImg>`; Sanity's CDN handles the transforms.

## Files

**New — Studio**
```
studio/
  package.json          sanity, @sanity/vision, @sanity/code-input, react, react-dom, styled-components
  sanity.config.ts
  sanity.cli.ts
  schemas/{post,feature,tag,blockContent}.ts
```
Its own package.json, so the root Vercel build ignores it. Schema lives in git;
content lives in Sanity.

**New — root dependencies**
```
@sanity/client          GROQ queries, server-side only
@portabletext/to-html   Portable Text -> HTML
@sanity/image-url       CDN URLs and srcsets for body images
shiki                   code highlighting, server-side only
```
Deliberately *not* `@nuxtjs/sanity`. That module exists to provide client-side
query composables and the Presentation overlay; this design queries only from
Nitro, so the module would add dependency weight for capabilities the
architecture does not use.

**New — server**
```
server/utils/sanity.ts               client factory: published vs draft
server/utils/queries.ts              GROQ queries
server/utils/renderBody.ts           Portable Text -> HTML, Shiki highlighting
server/api/blog/posts.get.ts         list; optional ?tag=
server/api/blog/posts/[slug].get.ts  single post
server/api/blog/features.get.ts      features list
server/api/__sitemap__/urls.ts       post slugs + lastmod for @nuxtjs/seo
server/routes/preview/enable.get.ts  sets preview cookie
server/routes/preview/disable.get.ts clears it
```
Note `server/` was deleted when the contact form moved client-side; this
recreates it.

**New — app**
```
app/pages/blog/index.vue
app/pages/blog/[slug].vue
app/components/blog/PostCard.vue
app/components/blog/FeatureCard.vue
app/components/blog/TagFilter.vue
app/components/blog/PostBody.vue
app/components/LatestPosts.vue
```

**Modified**
```
app/components/Articles.vue -> FeaturedWriting.vue   Sanity-driven; hardcoded array deleted
app/components/Header.vue:71                         uncomment the /blog nav link
app/pages/index.vue                                  FeaturedWriting + LatestPosts
nuxt.config.ts                                       ISR rule, sitemap source
.env.example, README.md                              new env vars
```

## Routes

`site.trailingSlash: true` is already set, so all blog URLs carry trailing
slashes.

| Route | Contents |
|---|---|
| `/blog/` | Posts newest first, tag filter, then a "Published Elsewhere" section of features |
| `/blog/[slug]/` | The post |
| `/` | FeaturedWriting carousel (features) + Latest Posts strip (3 newest posts) |

Tag filtering on `/blog/` uses a `?tag=` query parameter so a filtered view is
linkable and shareable. Filtering happens server-side in the posts route.

```ts
// nuxt.config.ts
routeRules: {
  '/blog/**': { isr: 60 },
}
```

## Environment

```
SANITY_PROJECT_ID          server-only
SANITY_DATASET             server-only, "production"
SANITY_API_VERSION         server-only, pinned date string
SANITY_READ_TOKEN          server-only, viewer token, drafts only
BLOG_PREVIEW_SECRET        server-only, guards /preview/enable
```

All private — none reach the browser. This contrasts deliberately with
`NUXT_PUBLIC_WEB3FORMS_ACCESS_KEY`, which is public by necessity. Each must be
set in the Vercel dashboard as well as locally.

## Draft preview

`/preview/enable?secret=...&slug=...` validates the secret, sets an httpOnly
cookie, and redirects to `/preview/blog/<slug>/`. The blog server routes check
for that cookie and, when present, use a Sanity client configured with
`SANITY_READ_TOKEN` and the drafts perspective. `/preview/disable` clears it.

Drafts render under their own `/preview/blog/` route namespace, which carries
no ISR rule and is server-rendered on every request. This matters: a cookie
does not vary Vercel's ISR cache key, so reusing `/blog/<slug>/` for preview
would either serve a stale public copy to the author or risk caching a draft
and serving it publicly. A separate uncached namespace removes the question
entirely. `/preview/**` is excluded from the sitemap and gets
`X-Robots-Tag: noindex`.

This gives functional draft preview — unpublished posts rendered by the real
templates on the real site. It does not give Sanity's Presentation overlay with
click-to-edit; that requires client-side Sanity queries, which would defeat the
server-only data layer. If the overlay turns out to be wanted later, it is an
additive change, not a rewrite.

## Styling

Follow the existing visual language rather than inventing one: stone palette,
orange-500 accent, `font-serif italic` headings, and the
`text-[10px] font-bold tracking-[0.25em] uppercase text-stone-400` section
label with a hairline rule that every section on the site already uses.

GSAP scroll animations on the index and cards, matching the existing
`Articles.vue` pattern (fade + rise, staggered, `ScrollTrigger` at `top 90%`).
Post body content is not animated — text that moves while you try to read it is
hostile.

Post typography is hand-written CSS scoped to `PostBody.vue`, not
`@tailwindcss/typography`. The plugin's defaults would have to be overridden
into the site's existing type scale almost entirely, which is more work than
writing the twenty rules that are actually needed.

## Migration

The three madg.com articles hardcoded in `Articles.vue` become `feature`
documents. Their images move from `public/images/` to Sanity's CDN so the card
component has one image source rather than two code paths. The hardcoded array
is deleted in the same change that switches the component to Sanity, so the two
never coexist.

## Implementation phases

Each phase ends with a working site.

0. **Prerequisite** — commit the in-progress Nuxt 4 / Tailwind v4 migration and
   confirm `npm run build` passes and the site renders. Nothing below should be
   built on an unverified migration.
1. Sanity project, `studio/` scaffold, three schemas, deploy the Studio.
2. Server data layer: client factory, queries, Portable Text renderer with
   Shiki, the three API routes.
3. `/blog/` index with post cards and tag filter.
4. `/blog/[slug]/` with body rendering, code blocks, per-post SEO meta and OG.
5. Homepage: `FeaturedWriting` reading from Sanity, `LatestPosts` strip,
   hardcoded array deleted, nav link uncommented.
6. Sitemap source, then verify meta and OG tags on a real post.
7. Draft preview routes and cookie handling.
8. Migrate the three features into Sanity, upload their images.

## Verification

This repo has no test framework, so verification is manual and must be done per
phase rather than at the end:

- `npm run build` passes
- `/blog/` and a post render correctly in `npm run preview`, not just dev
- A post published in the Studio appears within ~60s without a redeploy
- Post `<title>`, meta description and `og:image` are correct in view-source
- `/blog/[slug]/` appears in `/sitemap.xml`; features do not
- Shiki does not appear in `.output/public` — verifies code highlighting stayed
  server-side
- Draft preview shows an unpublished post and `/preview/disable` restores normal
  behaviour

## Known risks

**No automated tests.** Every phase is verified by hand. Adding Vitest is
outside this scope but worth considering before the blog grows.

**Sanity free tier limits.** Generous, but bandwidth and API request quotas
exist. ISR keeps requests low by serving most traffic from cache.

**`v-html` for body content.** Safe here because the content is authored by the
site owner. It would not be safe if the Studio were ever opened to other
authors, and that constraint should be remembered if it ever is.

## Deferred

- RSS feed (`/rss.xml`) — roughly 30 lines as a Nitro route, explicitly cut
- Search across posts — not useful until there are many posts
- Pagination on `/blog/` — not useful until there are many posts
- Sanity Presentation overlay / click-to-edit
- Related posts
