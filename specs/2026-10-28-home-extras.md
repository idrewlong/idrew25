# Home page extras: cursor, impact, build log, footer, feed, stars, assistant

Status: in-progress · Branch: `newdesign` · Owner: Andrew (approved 2026-10-28: "let's do it all")

## Goal

Add the eight pieces proposed after reviewing christendijoux.com, in the site's existing dark spec-sheet direction (`docs/design/direction.md`), without adding claims that aren't already on the site.

## Scope

1. **Custom cursor**: reticle (dot + lagging ring). Grows/turns orange over links and buttons, reads `DRAG` over the hero globe, hands off to the existing "See the work" cursor inside `#projects`. Off on touch (`pointer: coarse`) and reduced motion.
2. ~~**Impact & Results**~~: dropped 2026-10-28 at Andrew's request; the per-role stat tiles in Experience already carry these numbers.
3. **The site, taken apart**: its own page at `/teardown`, linked from the footer (moved off the home page at Andrew's request). Build log of this site (ASCII shader, live satellites, CelesTrak caching, Natural Earth mask, stack, fonts). Every line checkable in this repo.
4. **Signature footer**: animated ridgeline contours (name removed, since Contact above already shows it); columns for Projects, Social, Long Beach; credits line; star counter.
5. **Dithered project screenshots**: Work drawer images render as halftone dots, full colour on hover. Reduced motion and no-WebGL keep the plain image.
6. **Now shipping**: latest public GitHub push events for `idrewlong`, server-cached.
7. **Hidden stars**: two stars on the home page and one on `/teardown`; counter in the footer; progress kept in `localStorage`. *Removed 2026-10-28: Andrew asked to cut it (the stars were too hard to spot).*
8. **AI assistant**: chat that answers only about Andrew and this site.

## Assistant guardrails (protecting API credits)

The endpoint is `POST /api/assistant`. Layers, cheapest first, so most abuse never reaches the model:

| Layer | Rule |
|---|---|
| Kill switch | No `NUXT_ANTHROPIC_API_KEY` → endpoint returns 503 and the widget hides itself (`GET /api/assistant/status`). |
| Origin check | Requests must come from the site's own origin (`Origin` / `Sec-Fetch-Site`). Blocks other sites and casual scripts. |
| Input limits | Question ≤ 500 chars; history ≤ 6 prior turns, each ≤ 1,500 chars; anything else is a 400. |
| Per-visitor limit | 8 questions per 10 minutes and 25 per day, keyed by a hash of the client IP. |
| Global budget | 300 model calls per day across all visitors (`NUXT_ASSISTANT_DAILY_CAP`); after that the widget says it's resting until tomorrow. |
| Topic scope | System prompt restricts answers to Andrew's work and this site and gives a fixed reply for anything else. Knowledge is only what the site publishes. |
| Output cap | `max_tokens` 1,024, effort `low`, answers asked to stay under ~120 words. |
| Storage | Counters use atomic Upstash `INCR` (`NUXT_UPSTASH_REDIS_REST_URL` / `_TOKEN`), shared across serverless instances. **Production fails closed without it**: no Upstash, no assistant. Local dev uses memory. The URL is read at build time, so redeploy after adding it. |
| History | Assistant replies are HMAC-signed; history turns without a valid signature are rejected, so visitors can't fake earlier replies. |
| IPv6 | Per-visitor limits group IPv6 by /64. |
| Previews | Scope `NUXT_ANTHROPIC_API_KEY` to Production in Vercel (or keep preview protection on) so preview URLs aren't extra endpoints. |
| Account cap | Set a monthly spend limit on the Anthropic key in the Console. A hard ceiling no code bug can exceed. |

Model: `NUXT_ASSISTANT_MODEL`, default `claude-haiku-5-5` (effort `low`; refusals get the fixed reply, since Haiku has no server-side fallback). Set it to `claude-opus-5-5` or `claude-sonnet-5-5` for a bigger model; those also send the server-side refusal fallback.

## Definition of done

- [x] Each section renders at 375px and 1440px with no horizontal scroll (QA 2026-11-13: /, /process, /contact, /resume, /blog, /teardown, checked per page)
- [x] Reduced motion: no cursor, no ridge animation, no dither animation; content still shown (QA 2026-11-13; Work drawer dither not opened)
- [ ] Impact and build-log copy only restates facts already on the site or in this repo
- [x] Assistant: unit tests for input validation, origin check, rate limiter, daily cap (tests/utils/assistantGuard*.test.ts, tests/server/assistantRoute.test.ts)
- [ ] Assistant: off cleanly with no key; refuses off-topic questions; never exposes the key client-side (off cleanly and key-not-in-responses are tested; off-topic refusal and a client-bundle scan are not)
- [x] Security review of the assistant route (2026-10-28): SEC-1 atomic counter, SEC-2 fail closed without Upstash, SEC-3 signed history, SEC-4 IPv6 /64 all fixed
- [x] `npm test` and `npm run build` pass (137 tests, plus `npm run typecheck`)
