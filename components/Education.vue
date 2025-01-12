<template>
	<section class="max-w-6xl mx-auto p-6">
		<h1 class="text-3xl font-bold mb-2">Education</h1>
		<p class="text-gray-600 mb-12">
			My academic background in Mississippi, with honors including Hall of Fame
			and Lyceum Scholar distinctions.
		</p>

		<div class="grid md:grid-cols-2 gap-12">
			<div
				v-for="education in educationList"
				:key="education.year"
				class="relative min-h-[200px] w-full md:p-6 rounded-lg"
			>
				<!-- Top Section -->
				<div class="pr-16">
					<!-- Add padding for logo -->
					<h2 class="flex items-baseline gap-2 mb-4">
						<span class="md:text-2xl font-semibold">{{
							education.degree
						}}</span>
						<span class="md:text-2xl text-orange-400">
							- {{ education.major }}
						</span>
					</h2>

					<ul class="text-sm text-gray-600 flex flex-col gap-y-2">
						<li
							v-for="(achievement, index) in education.achievements"
							:key="index"
							class="flex gap-x-2 items-start"
						>
							<Icon name="ci:dot-03-m" class="w-4 h-4" />
							<span>{{ achievement }}</span>
						</li>
					</ul>
				</div>

				<!-- School Info Section -->
				<div class="mt-6">
					<div class="grid grid-cols-[1fr_80px] items-center">
						<h3 class="md:text-lg text-gray-600">{{ education.school }}</h3>
						<span class="text-gray-600 text-right">{{ education.year }}</span>
					</div>
				</div>

				<!-- Logo -->
				<img
					v-if="education.logo"
					:src="education.logo"
					:alt="`${education.school} logo`"
					class="absolute right-6 top-6 w-12 h-12 object-contain opacity-30 hover:opacity-100 transition-opacity"
				/>
			</div>
		</div>
	</section>
</template>

<script setup>
const educationList = [
	{
		degree: 'B.A',
		major: 'University Studies',
		achievements: [
			'Lyceum Scholar',
			'Lens Colletive Program',
			"Chancellor's Class",
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
</script>
