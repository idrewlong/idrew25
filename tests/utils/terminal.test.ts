import { describe, it, expect } from 'vitest';
import { completeTerminal, runTerminal, TERMINAL_PAGES } from '../../app/utils/terminal';
import { allProjects } from '../../shared/siteData/projects';
import { experiences } from '../../shared/siteData/resume';

const text = (input: string) => runTerminal(input).lines.map((l) => l.text).join('\n');

describe('site terminal', () => {
	it('lists every page and navigates to one', () => {
		expect(text('ls')).toContain('teardown');
		expect(runTerminal('cd blog').action).toEqual({ type: 'navigate', to: '/blog' });
		expect(runTerminal('cd /status/').action).toEqual({ type: 'navigate', to: '/status' });
		expect(runTerminal('cd').action).toEqual({ type: 'navigate', to: '/' });
		expect(runTerminal('cd nowhere').action).toBeUndefined();
		expect(Object.keys(TERMINAL_PAGES)).toContain('status');
	});

	it('prints the current role from the shared resume data', () => {
		expect(text('whoami')).toContain(`${experiences[0]!.title} at ${experiences[0]!.company}`);
		expect(text('cat resume')).toContain(experiences.at(-1)!.title);
		expect(text('cat secrets')).toMatch(/no such file/);
	});

	it('shows a project by name or prefix', () => {
		expect(text('projects')).toContain('crawlmark');
		const crawlmark = allProjects.find((p) => p.title === 'crawlmark')!;
		expect(text('projects crawl')).toContain(crawlmark.description);
		expect(text('projects nope')).toMatch(/nothing called/);
	});

	it('hands off fetches and questions as actions', () => {
		expect(runTerminal('curl /api/ops').action).toEqual({ type: 'fetch', what: 'ops' });
		expect(runTerminal('status').action).toEqual({ type: 'fetch', what: 'status' });
		expect(runTerminal('ask "do you know Terraform?"').action).toEqual({ type: 'ask', question: 'do you know Terraform?' });
		expect(runTerminal('ask').action).toBeUndefined();
		expect(runTerminal('clear').action).toEqual({ type: 'clear' });
	});

	it('handles unknown commands and history', () => {
		expect(text('rm -rf /')).toBe('command not found: rm. Try help.');
		expect(runTerminal('history', ['ls', 'whoami']).lines).toHaveLength(2);
	});

	it('prints the recruiter quick facts', () => {
		expect(text('facts')).toContain('U.S. citizen');
		expect(runTerminal('facts').lines.at(-1)?.href).toMatch(/\.pdf$/);
	});

	it('completes commands and arguments', () => {
		expect(completeTerminal('wh')).toEqual(['whoami']);
		expect(completeTerminal('cd te')).toEqual(['cd teardown']);
		expect(completeTerminal('projects dji')).toEqual(['projects djilog']);
	});
});
