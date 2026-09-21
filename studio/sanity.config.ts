import { codeInput } from '@sanity/code-input';
import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { Logo } from './components/Logo';
import { schemaTypes } from './schemas';
import { structure } from './structure';
import { theme } from './theme';

export default defineConfig({
	name: 'idrewlong',
	title: 'idrewlong.com',
	projectId: 'q2wxb7pr',
	dataset: 'production',
	plugins: [structureTool({ structure }), visionTool(), codeInput()],
	schema: { types: schemaTypes },
	theme,
	studio: {
		components: {
			logo: Logo,
		},
	},
});
