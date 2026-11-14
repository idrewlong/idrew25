// Command logic for the site terminal (SiteTerminal.vue). Pure: it returns
// lines to print and, at most, one action for the component to carry out,
// so it can be unit-tested without a browser. Everything it prints comes from
// the same shared data the pages and the assistant use.
import { allProjects } from '../../shared/siteData/projects';
import { certifications, experiences, skillCategories } from '../../shared/siteData/resume';
import { contactEmail, socialLinks } from './siteLinks';

export interface TerminalLine {
	text: string;
	cmd?: string; // shown as a command beside `text`, for help tables
	href?: string; // printed as a link
	tone?: 'muted' | 'accent' | 'error';
}

export type TerminalAction =
	| { type: 'navigate'; to: string }
	| { type: 'ask'; question: string }
	| { type: 'fetch'; what: 'ops' | 'status' }
	| { type: 'clear' }
	| { type: 'close' };

export interface TerminalResult {
	lines: TerminalLine[];
	action?: TerminalAction;
}

export const TERMINAL_PAGES: Record<string, string> = {
	home: '/',
	work: '/#projects',
	process: '/process',
	blog: '/blog',
	resume: '/resume',
	contact: '/contact',
	teardown: '/teardown',
	status: '/status',
};

const HELP: [string, string][] = [
	['ls', 'list pages'],
	['cd <page>', 'go to a page, e.g. cd blog'],
	['whoami', 'who built this'],
	['cat resume', 'roles, newest first'],
	['projects [name]', 'list projects, or show one'],
	['skills', 'skills by area'],
	['certs', 'certifications'],
	['contact', 'email and profiles'],
	['curl /api/ops', 'live deploy, CI and cache data'],
	['status', 'uptime from the external checks'],
	['ask <question>', 'ask the AI assistant'],
	['history', 'commands you have run'],
	['clear', 'clear the screen'],
	['exit', 'close the terminal (or press Esc)'],
];

export const TERMINAL_COMMANDS = [
	'help', 'ls', 'cd', 'open', 'whoami', 'cat', 'resume', 'projects', 'skills', 'certs', 'contact',
	'curl', 'ops', 'status', 'uptime', 'ask', 'history', 'clear', 'exit', 'pwd', 'date', 'echo', 'sudo',
];

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const out = (...lines: (string | TerminalLine)[]): TerminalResult => ({
	lines: lines.map((l) => (typeof l === 'string' ? { text: l } : l)),
});

const err = (text: string): TerminalResult => out({ text, tone: 'error' });

/** Words a partial command line could complete to. */
export function completeTerminal(input: string): string[] {
	const parts = input.trimStart().split(/\s+/);
	if (parts.length <= 1) return TERMINAL_COMMANDS.filter((c) => c.startsWith(parts[0] ?? ''));
	const [cmd, arg = ''] = parts;
	const pool =
		cmd === 'cd' || cmd === 'open'
			? Object.keys(TERMINAL_PAGES)
			: cmd === 'projects'
				? allProjects.map((p) => slug(p.title))
				: cmd === 'cat'
					? ['resume']
					: cmd === 'curl'
						? ['/api/ops']
						: [];
	return pool.filter((w) => w.startsWith(arg.toLowerCase())).map((w) => `${cmd} ${w}`);
}

export function runTerminal(input: string, history: string[] = [], path = '/'): TerminalResult {
	const line = input.trim();
	if (!line) return out();
	const [cmd = '', ...rest] = line.split(/\s+/);
	const arg = rest.join(' ');

	switch (cmd.toLowerCase()) {
		case 'help':
			return out(
				'Type a command and press Enter. Commands:',
				...HELP.map(([c, d]) => ({ cmd: c, text: d, tone: 'muted' as const })),
				{ text: 'Tab completes, ↑ ↓ walk your history.', tone: 'muted' }
			);

		case 'ls':
			return out(...Object.entries(TERMINAL_PAGES).map(([name, to]) => ({ text: `${name.padEnd(10)}${to}`, href: to })));

		case 'cd':
		case 'open': {
			const name = arg.toLowerCase().replace(/^\/+|\/+$/g, '') || 'home';
			const to = name === '~' || name === '..' ? '/' : TERMINAL_PAGES[name];
			if (!to) return err(`cd: no such page: ${arg}. Try ls.`);
			return { lines: [{ text: `→ ${to}`, tone: 'muted' }], action: { type: 'navigate', to } };
		}

		case 'pwd':
			return out(path);

		case 'whoami': {
			const now = experiences[0]!;
			return out(`Andrew Long, ${now.title} at ${now.company}.`, {
				text: 'Try cat resume, projects or ask "what do you build?"',
				tone: 'muted',
			});
		}

		case 'cat':
			if (arg !== 'resume') return err(arg ? `cat: ${arg}: no such file. Try cat resume.` : 'cat: which file? Try cat resume.');
		// falls through
		case 'resume':
			return out(
				...experiences.flatMap((e) => [
					{ text: `${e.title} · ${e.company}`, tone: 'accent' as const },
					{ text: `  ${e.period}`, tone: 'muted' as const },
				]),
				{ text: 'Full resume: cd resume', href: '/resume', tone: 'muted' }
			);

		case 'projects': {
			if (!arg) {
				return out(
					...allProjects.map((p) => ({
						text: `${slug(p.title).padEnd(36)}${p.category}`,
						tone: p.category === 'tool' ? undefined : ('muted' as const),
					})),
					{ text: 'Show one: projects <name>', tone: 'muted' }
				);
			}
			const want = slug(arg);
			const p = allProjects.find((x) => slug(x.title) === want) ?? allProjects.find((x) => slug(x.title).startsWith(want));
			if (!p) return err(`projects: nothing called ${arg}. Run projects to list them.`);
			const lines: TerminalLine[] = [
				{ text: p.title, tone: 'accent' },
				{ text: p.description },
				{ text: `stack: ${p.technologies.join(', ')}`, tone: 'muted' },
			];
			if (p.install) lines.push({ text: `$ ${p.install}`, tone: 'muted' });
			if (p.repo) lines.push({ text: `repo: ${p.repo}`, href: p.repo });
			if (p.link) lines.push({ text: `live: ${p.link}`, href: p.link });
			return { lines };
		}

		case 'skills':
			return out(
				...skillCategories.flatMap((c) => [
					{ text: c.title, tone: 'accent' as const },
					{ text: `  ${c.skills.join(', ')}`, tone: 'muted' as const },
				])
			);

		case 'certs':
			return out(
				...certifications.map((c) => ({
					text: `${c.name} (${c.code}) · ${c.status} ${c.date}`,
					href: c.verifyUrl,
				}))
			);

		case 'contact':
			return out(
				{ text: `email: ${contactEmail}`, href: `mailto:${contactEmail}` },
				...socialLinks.map((s) => ({ text: `${s.label.toLowerCase()}: ${s.url}`, href: s.url })),
				{ text: 'Or: cd contact', tone: 'muted' }
			);

		case 'curl':
			if (arg !== '/api/ops') return err(arg ? `curl: only /api/ops is open here` : 'curl: try curl /api/ops');
		// falls through
		case 'ops':
			return { lines: [{ text: 'GET /api/ops …', tone: 'muted' }], action: { type: 'fetch', what: 'ops' } };

		case 'status':
		case 'uptime':
			return { lines: [{ text: 'GET /api/status …', tone: 'muted' }], action: { type: 'fetch', what: 'status' } };

		case 'ask': {
			const question = arg.replace(/^["']|["']$/g, '').trim();
			if (!question) return err('ask: ask what? e.g. ask "do you know Terraform?"');
			return { lines: [{ text: 'Opening the assistant…', tone: 'muted' }], action: { type: 'ask', question } };
		}

		case 'history':
			return history.length
				? out(...history.map((h, i) => ({ text: `${String(i + 1).padStart(4)}  ${h}`, tone: 'muted' as const })))
				: out({ text: 'No history yet.', tone: 'muted' });

		case 'date':
			return out(new Date().toString());

		case 'echo':
			return out(arg);

		case 'sudo':
			return err('Nice try. This incident will be reported.');

		case 'clear':
			return { lines: [], action: { type: 'clear' } };

		case 'exit':
			return { lines: [], action: { type: 'close' } };

		default:
			return err(`command not found: ${cmd}. Try help.`);
	}
}
