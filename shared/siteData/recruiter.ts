// Quick facts for recruiters, shown in the "Are you a recruiter?" modal
// (RecruiterPrompt.vue) and given to the site assistant and terminal, so every
// place says the same thing.
// Each line here was approved by Andrew (docs/decisions/DECISIONS.md,
// 2026-11-13 and 2026-11-14); don't add to it without his OK.
import { certifications, experiences } from './resume';

export const RESUME_PDF = '/Andrew%20Long%20Resume.pdf';

export interface QuickFact {
	label: string;
	value: string;
}

const current = experiences[0]!;
const earned = certifications.filter((c) => c.status === 'earned');

export const quickFacts: QuickFact[] = [
	{ label: 'Open to', value: 'DevOps, cloud, AI engineering and senior full stack roles' },
	{ label: 'Work style', value: 'Remote, hybrid or on-site; open to relocating, especially to Austin, Nashville or Huntsville' },
	{ label: 'Based in', value: 'Long Beach, Mississippi' },
	{ label: 'Work authorization', value: 'U.S. citizen' },
	{ label: 'Now', value: `${current.title} at ${current.company}` },
	...(earned.length ? [{ label: 'Certified', value: earned.map((c) => `${c.name} (${c.date})`).join(', ') }] : []),
];
