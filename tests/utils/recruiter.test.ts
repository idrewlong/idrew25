import { describe, it, expect } from 'vitest';
import { quickFacts } from '../../shared/siteData/recruiter';
import { certifications, experiences } from '../../shared/siteData/resume';

describe('recruiter quick facts', () => {
	const byLabel = Object.fromEntries(quickFacts.map((f) => [f.label, f.value]));

	it('has the approved facts', () => {
		expect(byLabel['Work authorization']).toBe('U.S. citizen');
		expect(byLabel['Open to']).toMatch(/DevOps/);
		expect(byLabel['Work style']).toMatch(/Austin, Nashville or Huntsville/);
	});

	it('takes the current role and certifications from the resume data', () => {
		expect(byLabel['Now']).toBe(`${experiences[0]!.title} at ${experiences[0]!.company}`);
		for (const c of certifications.filter((x) => x.status === 'earned')) expect(byLabel['Certified']).toContain(c.name);
	});
});
