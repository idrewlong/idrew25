/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./components/**/*.{js,vue,ts}',
		'./layouts/**/*.vue',
		'./pages/**/*.vue',
		'./plugins/**/*.{js,ts}',
		'./app.vue',
		'./error.vue',
	],
	theme: {
		screens: {
			sm: '480px',
			md: '768px',
			lg: '976px',
			xl: '1440px',
		},
		extend: {
			// colors: {
			// 	background: {
			// 		light: '#deded0',
			// 		DEFAULT: '#E4E3D8',
			// 		dark: '#d0d0ad',
			// 	},
			// 	accent: {
			// 		DEFAULT: '#486242',
			// 		light: '#8BA484',
			// 	},
			// 	white: '#F5F5F5',
			// 	black: {
			// 		light: '#494848',
			// 		DEFAULT: '#1A1A1A',
			// 	},
			// 	'subtle-copy': '#505047',
			// },
			maxWidth: {
				content: '50rem',
				'wide-content': '62rem',
			},
		},
	},
	container: {
		center: true,
	},
	plugins: [],
};
