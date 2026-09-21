import { buildLegacyTheme } from 'sanity';

// Mirrors app/assets/css/main.css so the editor and the site read as one thing.
const tokens = {
	'--brand-primary': '#f97316',
	'--brand-primary--inverted': '#FFFFFF',

	'--default-button-color': '#1C1917',
	'--default-button-primary-color': '#f97316',
	'--default-button-success-color': '#16a34a',
	'--default-button-warning-color': '#d97706',
	'--default-button-danger-color': '#dc2626',

	'--focus-color': '#f97316',

	'--state-info-color': '#0ea5e9',
	'--state-success-color': '#16a34a',
	'--state-warning-color': '#d97706',
	'--state-danger-color': '#dc2626',

	'--main-navigation-color': '#1C1917',
	'--main-navigation-color--inverted': '#F7F6F3',

	'--component-bg': '#FFFFFF',
	'--component-text-color': '#1C1917',

	'--gray-base': '#78716C',

	'--black': '#1C1917',
	'--white': '#FFFFFF',
};

export const theme = buildLegacyTheme(tokens);
