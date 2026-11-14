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

## 2026-11-13 — Personal details approved for the site and assistant
- **Decision:** Andrew approved "U.S. citizen" and "Open to opportunities" in the assistant's knowledge (`server/utils/assistantKnowledge.ts`), and "Open to opportunities anywhere, especially Austin, Nashville and Huntsville" on the contact page (`app/pages/contact/index.vue` meta). The target cities are a deliberate focus of the contact page.
- **Why:** they're true and help recruiters in those markets find and qualify him.
- **Rejected:** removing them under the AGENTS.md rule on unapproved personal details (this entry is the approval).
- **Revisit:** if the job search, location targets or availability change.
- **Source:** Andrew, in the 2026-11-13 audit follow-up.

## 2026-11-14 — Recruiter quick facts approved
- **Decision:** Andrew approved "quick facts" for recruiters, shown in a modal when a visitor answers yes to "Are you a recruiter?" (asked once, a few seconds into a visit, and only on the page the visit lands on: moving to another page cancels it), reopened any time from a "For recruiters" link in the footer, and also given to the assistant and the terminal (`facts`), all from `shared/siteData/recruiter.ts`. New approved lines: open to "DevOps, cloud, AI engineering and senior full stack roles", and "Remote, hybrid or on-site; open to relocating, especially to Austin, Nashville or Huntsville". It also repeats already-approved facts (U.S. citizen, Long Beach, MS) and derives the current role and certifications from the resume data.
- **Why:** it answers what recruiters ask first, without hunting through the site.
- **Rejected:** leaving roles out ("open to opportunities" only), a no-remote wording, and an always-visible facts panel on the home and resume pages (Andrew wants it only in the recruiter modal).
- **Revisit:** when the job search, target roles or location preferences change.
- **Source:** Andrew, 2026-11-14.
