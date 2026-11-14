import { describe, it, expect } from 'vitest';
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { ASSISTANT_KNOWLEDGE, ASSISTANT_SYSTEM, SITE_PAGES } from '../../server/utils/assistantKnowledge';
import { certifications, educationList, experiences, focusAreas, skillCategories } from '../../shared/siteData/resume';
import { allProjects } from '../../shared/siteData/projects';

describe('assistant knowledge is built from the site data', () => {
	it('lists every experience role with its company and period', () => {
		for (const e of experiences) {
			expect(ASSISTANT_KNOWLEDGE).toContain(`${e.title}, ${e.company} (${e.period})`);
			for (const a of e.achievements) expect(ASSISTANT_KNOWLEDGE).toContain(a);
		}
	});
	it('lists every project title and description, tools before websites', () => {
		const tools = ASSISTANT_KNOWLEDGE.indexOf('\nTools:\n');
		const websites = ASSISTANT_KNOWLEDGE.indexOf('\nWebsites:\n');
		expect(tools).toBeGreaterThan(-1);
		expect(websites).toBeGreaterThan(tools);
		for (const p of allProjects) {
			const at = ASSISTANT_KNOWLEDGE.indexOf(`- ${p.title} [`);
			expect(at, p.title).toBeGreaterThan(-1);
			expect(ASSISTANT_KNOWLEDGE).toContain(p.description);
			if (p.category === 'tool') expect(at, p.title).toBeLessThan(websites);
			else expect(at, p.title).toBeGreaterThan(websites);
		}
	});
	it('lists every education entry', () => {
		for (const e of educationList) {
			expect(ASSISTANT_KNOWLEDGE).toContain(`${e.degree} ${e.major}, ${e.school}, ${e.year}`);
			for (const a of e.achievements) expect(ASSISTANT_KNOWLEDGE).toContain(a);
		}
	});
	it('lists every certification', () => {
		expect(certifications.length).toBeGreaterThan(0);
		for (const c of certifications) {
			expect(ASSISTANT_KNOWLEDGE).toContain(`${c.name} (${c.code})`);
			expect(ASSISTANT_KNOWLEDGE).toContain(c.date);
		}
	});
	it('lists every skill category and focus area', () => {
		for (const c of skillCategories) expect(ASSISTANT_KNOWLEDGE).toContain(`- ${c.title}: ${c.skills.join(', ')}.`);
		for (const f of focusAreas) expect(ASSISTANT_KNOWLEDGE).toContain(`${f.title}: ${f.body}`);
	});
});

describe('assistant knowledge pages list', () => {
	const pagesDir = join(__dirname, '../../app/pages');
	const routes = readdirSync(pagesDir)
		.filter((n) => statSync(join(pagesDir, n)).isDirectory() || n.endsWith('.vue'))
		.map((n) => (n === 'index.vue' ? '/' : '/' + n.replace(/\.vue$/, '')));
	it('finds the routes it checks', () => {
		expect(routes).toContain('/');
		expect(routes).toContain('/resume');
	});
	it('names every top-level route under app/pages', () => {
		const line = ASSISTANT_KNOWLEDGE.split('\n').find((l) => l.includes('Pages: '));
		expect(line).toBeDefined();
		expect(SITE_PAGES.map((p) => p.path).sort()).toEqual([...routes].sort());
		for (const r of routes) {
			if (r === '/') expect(line).toContain('Pages: home');
			else expect(line).toMatch(new RegExp(`[ (]${r}\\b`));
		}
	});
});

describe('hand-written lines', () => {
	it('keeps the approved personal details and contact line exactly', () => {
		// Approved by Andrew, docs/decisions/DECISIONS.md (2026-11-13)
		expect(ASSISTANT_KNOWLEDGE).toContain('Senior full stack developer at Mad Genius, based in Long Beach, Mississippi. U.S. citizen. Open to opportunities. Contact: idrewlong@gmail.com, or the contact form at /contact.');
		expect(ASSISTANT_KNOWLEDGE).toContain('Personal: a dad.');
		expect(ASSISTANT_KNOWLEDGE).toContain('Tagline: "Go by choice. TypeScript by trade. AWS by necessity."');
		expect(ASSISTANT_KNOWLEDGE).toContain('## This site (idrewlong.com)');
	});
	it('embeds the knowledge in the system prompt', () => {
		expect(ASSISTANT_SYSTEM).toContain(`<knowledge>\n${ASSISTANT_KNOWLEDGE}\n</knowledge>`);
		expect(ASSISTANT_SYSTEM).toContain('I can only answer questions about Andrew and this site.');
	});
	it('has no unfilled template values', () => {
		expect(ASSISTANT_KNOWLEDGE).not.toMatch(/undefined|\[object Object\]|\$\{/);
	});
});
