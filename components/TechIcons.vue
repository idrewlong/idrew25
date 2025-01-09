# components/TechIcons.vue
<template>
	<div class="absolute inset-0">
		<Icon
			v-for="(icon, index) in techIcons"
			:key="index"
			:name="icon.name"
			class="absolute w-20 h-20 translate-x-[-50%] translate-y-[-50%] text-background opacity-30"
			:style="getIconStyle(index)"
		/>
	</div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
	scroll: {
		type: Number,
		default: 0,
	},
});

// Adjusted base coordinates and radius for larger orbit
const baseX = 355.0341389255983;
const baseY = 298.6701355135605;
const radius = 280; // Increased radius for larger orbit
const baseAngle = 4.15;
const rotationFactor = 0.75;

const techIcons = [
	{ name: 'logos:html-5', angle: 4.15 },
	{ name: 'logos:python', angle: 3.78125 },
	{ name: 'logos:nodejs-icon', angle: 3.4125 },
	{ name: 'logos:tailwindcss-icon', angle: 3.04375 },
	{ name: 'logos:react', angle: 2.675 },
	{ name: 'logos:vue', angle: 2.30625 },
	{ name: 'logos:nuxt-icon', angle: 1.9375 },
	{ name: 'logos:laravel', angle: 1.56875 },
	{ name: 'logos:typescript-icon', angle: 1.2 },
	{ name: 'logos:css-3', angle: 0.83125 },
	{ name: 'logos:javascript', angle: 0.4625 },
];

const getIconStyle = (index) => {
	const angle = techIcons[index].angle - props.scroll * rotationFactor;
	return {
		left: `calc(${baseX}px + ${radius}px * cos(${angle}rad))`,
		top: `calc(${baseY}px - ${radius}px * sin(${angle}rad))`,
		width: '40px', // Explicit width
		height: '40px', // Explicit height
	};
};
</script>
