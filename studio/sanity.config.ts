import { codeInput } from '@sanity/code-input';
import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './schemas';

export default defineConfig({
	name: 'idrewlong',
	title: 'idrewlong.com',
	projectId: 'q2wxb7pr',
	dataset: 'production',
	plugins: [structureTool(), visionTool(), codeInput()],
	schema: { types: schemaTypes },
});
