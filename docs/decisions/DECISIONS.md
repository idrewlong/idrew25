# Decisions

Newest at the bottom. Written by `/my-skills:save`; each entry records the decision, why, what was rejected, and when to revisit.

## 2026-10-10 — Mad Genius role features stay hardcoded, not in Sanity
- **Decision:** the features listed under the Mad Genius role are hardcoded in the component, not managed in the CMS.
- **Why:** they change rarely, and adding them to Sanity made editing harder than changing the component.
- **Rejected:** a Sanity document type for role features.
- **Revisit:** if roles or features start changing often.
- **Source:** recorded at init from an earlier session.

## 2026-10-10 — Contact form posts to Web3Forms from the browser
- **Decision:** the contact form submits client-side to Web3Forms; the access key is public.
- **Why:** Web3Forms' free plan only accepts browser submissions.
- **Rejected:** a server route proxying the submission (blocked on the free plan).
- **Revisit:** if spam becomes a problem or the plan changes.
- **Source:** recorded at init from `nuxt.config.ts` and the README.
