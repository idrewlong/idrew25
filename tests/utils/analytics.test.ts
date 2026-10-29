import { describe, it, expect } from 'vitest';
import { classifyLink } from '../../app/utils/analytics';

const SITE = 'https://www.idrewlong.com';
const at = (location: string, project?: string) => ({ origin: SITE, location, project });

describe('classifyLink', () => {
	it('tracks resume downloads with where they were clicked', () => {
		expect(classifyLink('/Andrew%20Long%20Resume.pdf', at('about'))).toEqual({
			name: 'resume_download',
			params: { link_location: 'about' },
		});
		expect(classifyLink(`${SITE}/Andrew%20Long%20Resume.pdf`, at('contact'))?.name).toBe('resume_download');
	});

	it('tracks GitHub profile and LinkedIn as social clicks', () => {
		expect(classifyLink('https://github.com/idrewlong', at('header'))).toEqual({
			name: 'social_click',
			params: { network: 'github', link_location: 'header' },
		});
		expect(classifyLink('https://www.linkedin.com/in/idrewlong/', at('footer'))).toEqual({
			name: 'social_click',
			params: { network: 'linkedin', link_location: 'footer' },
		});
	});

	it('tracks repo links as project source clicks, named by the project or the repo', () => {
		expect(classifyLink('https://github.com/idrewlong/skinamp', at('projects', 'Skinamp'))).toEqual({
			name: 'project_click',
			params: { project: 'Skinamp', link_type: 'source', link_location: 'projects' },
		});
		expect(classifyLink('https://github.com/idrewlong/crawlmark-mcp/commit/06afe8c', at('shipping'))).toEqual({
			name: 'project_click',
			params: { project: 'crawlmark-mcp', link_type: 'source', link_location: 'shipping' },
		});
	});

	it('tracks a project live site only when the link belongs to a project', () => {
		expect(classifyLink('https://skinamp.example.com', at('projects', 'Skinamp'))).toEqual({
			name: 'project_click',
			params: { project: 'Skinamp', link_type: 'live', link_location: 'projects' },
		});
		expect(classifyLink('https://www.credly.com/badges/x', at('certifications'))).toBeNull();
	});

	it('tracks email links', () => {
		expect(classifyLink('mailto:idrewlong@gmail.com', at('footer'))).toEqual({
			name: 'email_click',
			params: { link_location: 'footer' },
		});
	});

	it('ignores internal pages, anchors and junk', () => {
		expect(classifyLink('/blog/', at('header'))).toBeNull();
		expect(classifyLink('#projects', at('hero'))).toBeNull();
		expect(classifyLink(`${SITE}/contact`, at('cta'))).toBeNull();
		expect(classifyLink('javascript:void(0)', at('x'))).toBeNull();
		expect(classifyLink('', at('x'))).toBeNull();
	});
});
