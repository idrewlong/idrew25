<template>
	<section id="experience" ref="expSection" class="max-w-6xl mx-auto px-4 sm:px-6">
		<!-- Notion-style section label -->
		<div ref="labelEl" class="flex items-center gap-3 mb-12">
			<span
				class="text-[10px] font-bold tracking-[0.25em] uppercase text-stone-400"
				>Experience</span
			>
			<div class="flex-1 h-px bg-stone-200"></div>
		</div>

		<!-- Timeline -->
		<div class="relative">
			<!-- Vertical line (draws on scroll) -->
			<div class="absolute left-2 top-5 bottom-5 w-px bg-stone-100">
				<div
					ref="timelineLine"
					class="w-full h-full bg-stone-300 origin-top"
				></div>
			</div>

			<!-- Experience items -->
			<div class="space-y-12 md:space-y-14">
				<div
					v-for="(exp, i) in experiences"
					:key="exp.title"
					:ref="
						(el) => {
							if (el) itemEls[i] = el;
						}
					"
					class="flex gap-4 sm:gap-8 items-start"
				>
					<!-- Dot column -->
					<div class="w-4 shrink-0 pt-1 relative z-10">
						<div
							class="w-4 h-4 rounded-full bg-white border-2 border-stone-300 flex items-center justify-center"
						>
							<div class="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
						</div>
					</div>

					<!-- Content -->
					<div class="flex-1 min-w-0 pb-2">
						<div
							class="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-6 mb-2"
						>
							<h3
								class="text-lg font-bold font-serif text-stone-900 leading-snug"
							>
								{{ exp.title }}
								<span class="text-orange-500"> @ {{ exp.company }}</span>
							</h3>
							<span
								class="text-xs text-stone-400 font-medium tracking-wide md:ml-auto shrink-0"
							>
								{{ exp.period }}
							</span>
						</div>
						<p class="text-sm text-stone-700 mb-4 leading-relaxed max-w-2xl">
							{{ exp.description }}
						</p>
						<ul class="space-y-2">
							<li
								v-for="(ach, j) in exp.achievements"
								:key="j"
								class="flex gap-3 items-start text-sm text-stone-600"
							>
								<span class="w-1 h-1 rounded-full bg-orange-400 shrink-0 mt-2" aria-hidden="true"></span>
								<span class="leading-relaxed">{{ ach }}</span>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';

const { $gsap } = useNuxtApp();

const expSection = ref(null);
const labelEl = ref(null);
const timelineLine = ref(null);
const itemEls = ref([]);

const experiences = [
	{
		period: 'May 2026 – Present',
		title: 'Senior Full Stack Developer',
		company: 'Mad Genius',
		description:
			'Lead full-stack architecture and development across a diverse client portfolio, owning end-to-end technical decisions on web and mobile projects.',
		achievements: [
			'Build and remediate AWS infrastructure (EC2, S3, scheduled jobs) for multiple Mississippi state agencies, closing security and compliance gaps.',
			'Own architecture for web and mobile products end to end: user stories, database schema, backend, and production.',
			'Mentor junior developers and lead quarterly internal training on web standards, SEO, and security.',
		],
	},
	{
		period: 'June 2024 – May 2026',
		title: 'SEO Developer',
		company: 'Mad Genius',
		description:
			'Built and maintained full-stack applications while leading technical SEO for enterprise clients across construction, real estate, and public health.',
		achievements: [
			'Key contributor to a React Native app that grossed $1M+ in its first month with 10,000+ active users.',
			'Drove a 74% year-over-year increase in organic traffic for a key client through technical SEO, content strategy, and LLM search integration.',
			'Built full-stack applications with Laravel, React, Nuxt, and headless WordPress, deploying across AWS, Digital Ocean, and WP Engine.',
			'Built automation tools, including web crawlers and reporting scripts, that cut SEO audit turnaround time by 10% across the team.',
		],
	},
	{
		period: 'December 2023 – June 2024',
		title: 'Marketing Project Manager',
		company: 'Thompson Machinery',
		description:
			'Built campaign landing pages and internal tools while managing marketing initiatives across the sales and SITECH divisions.',
		achievements: [
			'Designed and developed campaign landing pages with Next.js, Tailwind CSS, and Makeswift, and maintained WordPress sites in PHP and JavaScript.',
			'Built internal marketing forms and planners in Microsoft Power Apps to improve workflow and project coordination.',
			'Analyzed sales data in Power BI to find market share gaps and target Caterpillar equipment campaigns.',
			'Managed SEO, SEM, and email campaigns across the sales and SITECH divisions.',
		],
	},
	{
		period: 'September 2022 – May 2024',
		title: 'Web Developer',
		company: "Finder's Guide",
		description:
			'Founded a consultancy delivering custom web development and digital growth strategy for local and enterprise clients.',
		achievements: [
			'Increased organic search traffic by an average of 40% across 15+ client engagements.',
			'Built web applications with Next.js and Svelte on headless WordPress, deployed on Digital Ocean droplets.',
			'Led remote cross-functional design teams and managed the full project lifecycle, from client acquisition through ongoing support.',
		],
	},
	{
		period: 'March 2022 – January 2023',
		title: 'Associate Customer Support Specialist',
		company: 'Core Logic',
		description:
			'Supported customers on industry-specific insurance and property software, including Xactimate and XactAnalysis.',
		achievements: [
			'Maintained a 95% CSAT score across 50–70 daily customer interactions, consistently above team average.',
			'Worked in a Scrum team using Salesforce and Jira, escalating complex issues to development and contributing to product improvements.',
		],
	},
	{
		period: 'January 2018 – December 2020',
		title: 'Owner',
		company: 'LMC',
		description:
			'Ran a video production company, managing every phase from pre-production and planning through cinematography and editing.',
		achievements: [
			'Directed and edited 100+ music videos in two years for a music production company.',
			'Worked with a team of videographers and editors on music videos, executive training, live sports, and weddings.',
		],
	},
];

onMounted(() => {
	nextTick(() => {
		if (!expSection.value) return;

		// Draw timeline line on scroll
		$gsap.set(timelineLine.value, { scaleY: 0, transformOrigin: 'top center' });
		$gsap.to(timelineLine.value, {
			scaleY: 1,
			ease: 'none',
			scrollTrigger: {
				trigger: expSection.value,
				start: 'top center',
				end: 'bottom center',
				scrub: 0.5,
			},
		});

		// Animate section label
		$gsap.set(labelEl.value, { opacity: 0, y: 20 });
		$gsap.to(labelEl.value, {
			opacity: 1,
			y: 0,
			duration: 0.6,
			ease: 'power2.out',
			scrollTrigger: {
				trigger: expSection.value,
				start: 'top 85%',
				toggleActions: 'play none none none',
			},
		});

		// Animate each item individually as it enters view
		itemEls.value.filter(Boolean).forEach((el) => {
			$gsap.set(el, { opacity: 0, x: 20 });
			$gsap.to(el, {
				opacity: 1,
				x: 0,
				duration: 0.6,
				ease: 'power3.out',
				clearProps: 'all',
				scrollTrigger: {
					trigger: el,
					start: 'top 87%',
					toggleActions: 'play none none none',
				},
			});
		});
	});
});
</script>
