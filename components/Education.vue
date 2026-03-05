<template>
	<section ref="educationSection" class="max-w-6xl mx-auto px-6 w-full">
		<!-- Notion-style section label -->
		<div ref="labelEl" class="flex items-center gap-3 mb-10">
			<span
				class="text-[10px] font-bold tracking-[0.25em] uppercase text-stone-400"
				>Education</span
			>
			<div class="flex-1 h-px bg-stone-200"></div>
		</div>

		<!-- Notion database table card -->
		<div
			ref="educationContainer"
			class="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm w-full"
		>
			<!-- Column header row -->
			<div class="hidden md:flex border-b border-stone-100 bg-stone-50/80">
				<div class="edu-col-institution px-5 py-3">
					<span
						class="text-[10px] font-bold tracking-[0.2em] uppercase text-stone-400"
						>Institution</span
					>
				</div>
				<div class="edu-col-degree px-4 py-3 border-l border-stone-100">
					<span
						class="text-[10px] font-bold tracking-[0.2em] uppercase text-stone-400"
						>Degree</span
					>
				</div>
				<div class="edu-col-field px-4 py-3 border-l border-stone-100">
					<span
						class="text-[10px] font-bold tracking-[0.2em] uppercase text-stone-400"
						>Field of Study</span
					>
				</div>
				<div
					class="edu-col-highlights px-5 py-3 border-l border-stone-100 flex-1"
				>
					<span
						class="text-[10px] font-bold tracking-[0.2em] uppercase text-stone-400"
						>Highlights</span
					>
				</div>
			</div>

			<!-- Data rows -->
			<div
				v-for="education in educationList"
				:key="education.year"
				class="education-item border-b border-stone-100 last:border-b-0 group"
			>
				<!-- Desktop row -->
				<div
					class="hidden md:flex items-stretch hover:bg-stone-50/40 transition-colors"
				>
					<!-- Institution -->
					<div class="edu-col-institution px-5 py-5 flex items-start gap-3">
						<img
							v-if="education.logo"
							:src="education.logo"
							:alt="`${education.school} logo`"
							class="w-6 h-6 object-contain opacity-50 shrink-0 mt-0.5"
						/>
						<span class="text-sm text-stone-600 leading-snug">{{
							education.school
						}}</span>
					</div>
					<!-- Degree -->
					<div
						class="edu-col-degree px-4 py-5 border-l border-stone-100 flex items-start"
					>
						<span class="text-xl font-bold font-serif text-stone-900">{{
							education.degree
						}}</span>
					</div>
					<!-- Field -->
					<div
						class="edu-col-field px-4 py-5 border-l border-stone-100 flex items-start"
					>
						<span
							class="text-sm text-orange-500 font-serif italic leading-snug"
							>{{ education.major }}</span
						>
					</div>
					<!-- Highlights -->
					<div
						class="edu-col-highlights flex-1 px-5 py-5 border-l border-stone-100 flex flex-col gap-2"
					>
						<div
							v-for="(ach, j) in education.achievements"
							:key="j"
							class="flex gap-2.5 items-start text-sm text-stone-500"
						>
							<span class="text-orange-400 shrink-0 leading-5">—</span>
							<span class="leading-relaxed">{{ ach }}</span>
						</div>
					</div>
				</div>

				<!-- Mobile card -->
				<div class="md:hidden px-5 py-5">
					<div class="flex items-start justify-between gap-4 mb-4">
						<div class="flex items-start gap-3">
							<img
								v-if="education.logo"
								:src="education.logo"
								:alt="`${education.school} logo`"
								class="w-7 h-7 object-contain opacity-60 mt-0.5 shrink-0"
							/>
							<div>
								<p class="text-xs text-stone-400 mb-0.5">
									{{ education.school }}
								</p>
								<h2 class="text-xl font-bold font-serif text-stone-900">
									{{ education.degree }}
								</h2>
								<p class="text-sm text-orange-500 font-serif italic">
									{{ education.major }}
								</p>
							</div>
						</div>
					</div>
					<div class="flex flex-col gap-2">
						<div
							v-for="(ach, j) in education.achievements"
							:key="j"
							class="flex gap-2.5 items-start text-sm text-stone-500"
						>
							<span class="text-orange-400 shrink-0 leading-5">—</span>
							<span class="leading-relaxed">{{ ach }}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';

const { $gsap } = useNuxtApp();

const educationSection = ref(null);
const labelEl = ref(null);
const educationContainer = ref(null);

const educationList = [
	{
		degree: 'B.A',
		major: 'General Studies',
		achievements: [
			'Lyceum Scholar',
			'Lens Collective Program',
			"Chancellor's Leadership Class",
		],
		school: 'University of Mississippi',
		year: '2022',
		logo: '/images/olemiss.png',
	},
	{
		degree: 'A.A',
		major: 'Pre-Engineering',
		achievements: ['Phi Theta Kappa President', 'Hall of Fame', 'NASA Scholar'],
		school: 'Mississippi Delta Community College',
		year: '2016',
		logo: '/images/mdcc.webp',
	},
];

onMounted(() => {
	nextTick(() => {
		if (!educationSection.value) return;

		$gsap.set(labelEl.value, { opacity: 0, y: 20 });

		const items = educationContainer.value?.querySelectorAll('.education-item');
		if (items?.length) $gsap.set(items, { opacity: 0, x: -16 });

		const tl = $gsap.timeline({
			scrollTrigger: {
				trigger: educationSection.value,
				start: 'top 85%',
				toggleActions: 'play none none none',
			},
		});

		tl.to(labelEl.value, {
			opacity: 1,
			y: 0,
			duration: 0.5,
			ease: 'power2.out',
		});
		if (items?.length) {
			tl.to(
				items,
				{
					opacity: 1,
					x: 0,
					duration: 0.6,
					ease: 'power3.out',
					stagger: 0.12,
					clearProps: 'all',
				},
				'-=0.2'
			);
		}
	});
});
</script>

<style scoped>
.edu-col-institution {
	width: 26%;
}
.edu-col-degree {
	width: 8%;
}
.edu-col-field {
	width: 18%;
}
.edu-col-highlights {
	/* flex-1 from template */
}
</style>
