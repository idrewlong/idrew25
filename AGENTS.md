# idrewlong.com

Andrew Long's portfolio site: home, selected work (tools listed before websites), a process page, a Sanity-backed blog, and a contact form. It's read by recruiters and hiring managers, so accurate copy, mobile layout, and fast first load matter most. Copy written as Andrew follows the `my-skills:writing-voice` skill: nothing goes on the site that isn't true.

## Stack
- Nuxt 4.5 (Vue 3) · Tailwind 4 via `@tailwindcss/vite` · GSAP 3.15 + Lenis · `@nuxtjs/seo` (meta, sitemap, robots) · `@nuxt/image`, `@nuxt/fonts`, `@nuxt/icon` · Google tag
- Blog content in Sanity; Studio lives in `studio/` with its own `package.json`
- Contact form posts to Web3Forms from the browser
- Hosted on Vercel
- Package manager: npm. Always use it; never mix lockfiles.

## Commands
| Task | Command |
|---|---|
| Dev server | `npm run dev` (http://localhost:3000) |
| Unit tests | `npm test` (Vitest) |
| Typecheck | `npm run typecheck` (vue-tsc via `nuxt typecheck`) |
| Build | `npm run build` |
| Preview build | `npm run preview` |
| Studio | `cd studio && npm run dev` |

No lint script yet.

## Layout
```
app/components/   page sections (Hero, About, Experience, Skills, Projects2, Process, Cta, …) and blog/ components
app/pages/        index, resume, process, contact, blog, teardown
app/plugins/      gsap.ts (plugin registration), lenis.client.ts
shared/siteData/  resume and project data read by the pages and the assistant (import via #shared/siteData/…)
server/api/       blog API (Sanity queries) and __sitemap__ source
server/utils/     assistantKnowledge.ts builds the assistant's knowledge from shared/siteData
studio/           Sanity Studio (schemas: post, tag, blockContent)
tests/            Vitest smoke tests
public/           static images, OG image
```

## Conventions
- Every animated component follows `my-skills:gsap`: one scoped `gsap.matchMedia()` per component, reverted on unmount, with a reduced-motion branch. Below-the-fold sections must not animate in before the hero finishes.
- The preloader runs only on the first load of the home page, never on client-side navigation.
- Mobile first: check every layout change at 375px. Navigation (blog, process, contact) must be reachable on mobile.
- Form fields have linked `<label for>`/`id` pairs.
- Server-only secrets (`SANITY_READ_TOKEN`, `NUXT_ANTHROPIC_API_KEY`) live in `runtimeConfig`, never `runtimeConfig.public`.

## Environments
- Local: `.env` from `.env.example`.
- Production: Vercel, deploys from `main`. Env vars are set in the Vercel project (names in `.env.example`).
- `NUXT_PUBLIC_WEB3FORMS_ACCESS_KEY` is public by design (Web3Forms' free plan only accepts browser submissions).

## Project memory
- **Decisions:** `docs/decisions/DECISIONS.md`. Read recent entries before changing architecture or content structure, and don't contradict them silently.
- **Plans/specs:** `specs/` (active) and `specs/archive/` (done or superseded). Only follow plans with status draft, approved, or in-progress.
- **Research:** `docs/research/`. **Audits:** `specs/audits/`.
- Older superpowers design notes live in `docs/superpowers/`.

## Workflow
my-skills commands and agents own plan → build → review. Superpowers skills, if enabled, are used inside those steps (debugging, TDD, verification), not as a second planning pipeline.

## Never
- Commit or write secrets or real `.env` files.
- Push to `main`, merge PRs, or deploy to production without Andrew.
- Move the Mad Genius role features into Sanity (see decisions).
- Add claims, numbers, or personal details (location, clearance, availability) to the site that Andrew hasn't approved.
- Add AI co-author lines to commits.
