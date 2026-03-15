<template>
	<section ref="skillsSection" class="max-w-6xl mx-auto px-4 sm:px-6">
		<!-- Section label — identical pattern to every other section -->
		<div ref="labelEl" class="flex items-center gap-3 mb-10">
			<span
				class="text-[10px] font-bold tracking-[0.25em] uppercase text-stone-400"
				>Skills</span
			>
			<div class="flex-1 h-px bg-stone-200"></div>
		</div>

		<!-- Rows directly on page background, no card container -->
		<div class="">
			<div
				v-for="(category, i) in skillCategories"
				:key="category.title"
				:ref="
					(el) => {
						if (el) rowEls[i] = el;
					}
				"
				class="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-16 py-4 md:py-5 border-b border-stone-100 group"
			>
				<!-- Index + category label -->
				<div class="flex items-center gap-3 md:w-44 shrink-0">
					<span
						class="text-[9px] font-mono text-stone-300 tabular-nums select-none"
						aria-hidden="true"
						>{{ String(i + 1).padStart(2, '0') }}</span
					>
					<div class="flex items-center gap-1.5">
						<span
							class="w-1 h-1 rounded-full bg-orange-400 shrink-0"
							aria-hidden="true"
						></span>
						<span
							class="text-xs font-mono tracking-[0.15em] uppercase text-orange-400"
						>
							{{ category.title }}
						</span>
					</div>
				</div>

				<!-- Skills — dot-separated, same mono text as rest of site -->
				<p class="text-sm text-stone-600 leading-relaxed">
					<template v-for="(skill, j) in category.skills" :key="skill"
						>{{ skill
						}}<span
							v-if="j < category.skills.length - 1"
							class="text-stone-300 mx-1.5"
							>·</span
						></template
					>
				</p>
			</div>
		</div>
	</section>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';

const { $gsap } = useNuxtApp();

const skillsSection = ref(null);
const labelEl = ref(null);
const rowEls = ref([]);

const skillCategories = [
	{
		title: 'Languages',
		skills: ['JavaScript', 'TypeScript', 'Golang', 'Python', 'PHP', 'SQL'],
	},
	{
		title: 'Frontend',
		skills: [
			'React / Next.js',
			'Vue / Nuxt.js',
			'Svelte / SvelteKit',
			'Tailwind CSS',
			'GSAP',
			'WordPress',
			'Headless CMS',
		],
	},
	{
		title: 'Backend',
		skills: ['Laravel', 'Node.js', 'GraphQL', 'PostgreSQL', 'Redis'],
	},
	{
		title: 'Dev-Ops',
		skills: ['Docker', 'AWS', 'Digital Ocean', 'Cloudflare', 'Git', 'CI/CD'],
	},
	{
		title: 'Tools',
		skills: ['VSCode', 'Cursor', 'Claude Code', 'Postman', 'JIRA', 'Power Apps', 'Power BI', 'Salesforce', 'Twilio'],
	},
	{
		title: 'Design & SEO',
		skills: [
			'Figma',
			'Adobe Creative Suite',
			'SEMRush',
			'Google Analytics',
			'Google Search Console',
			'Google Tag Manager',
		],
	},
];

onMounted(() => {
	nextTick(() => {
		if (!skillsSection.value) return;

		$gsap.set(labelEl.value, { opacity: 0, y: 20 });
		$gsap.set(rowEls.value.filter(Boolean), { opacity: 0, x: -12 });

		const tl = $gsap.timeline({
			scrollTrigger: {
				trigger: skillsSection.value,
				start: 'top 80%',
				toggleActions: 'play none none none',
			},
		});

		tl.to(labelEl.value, {
			opacity: 1,
			y: 0,
			duration: 0.5,
			ease: 'power2.out',
		}).to(
			rowEls.value.filter(Boolean),
			{
				opacity: 1,
				x: 0,
				duration: 0.45,
				ease: 'power2.out',
				stagger: 0.07,
				clearProps: 'all',
			},
			'-=0.2'
		);
	});
});
</script>
