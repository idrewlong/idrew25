<template>
	<section class="max-w-6xl mx-auto p-6">
		<h1 class="text-3xl font-bold mb-2">Education</h1>
		<p class="text-gray-600 mb-12">
			My academic background in theoretical mathematics, computational science,
			and education.
		</p>

		<div class="grid md:grid-cols-2 gap-12">
			<div
				v-for="education in educationList"
				:key="education.year"
				class="relative h-48"
			>
				<!-- Top Section -->
				<div>
					<h2 class="flex items-baseline gap-2 mb-4">
						<span class="text-2xl font-semibold">{{ education.degree }}</span>
						<span class="text-2xl text-orange-400">
							- {{ education.major }}
						</span>
					</h2>

					<p class="text-gray-600">
						{{ education.description }}
					</p>
				</div>

				<!-- Bottom Section - Absolutely positioned -->
				<div class="absolute bottom-0 left-0 right-0">
					<div class="grid grid-cols-[1fr_80px] items-center">
						<h3 class="text-xl text-gray-600">{{ education.school }}</h3>
						<span class="text-gray-600 text-right">{{ education.year }}</span>
					</div>
				</div>

				<img
					v-if="education.logo"
					:src="education.logo"
					:alt="`${education.school} logo`"
					class="absolute right-0 top-0 w-12 h-12 object-contain opacity-30"
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
		description:
			'4.0 GPA. Focus on theoretical mathematics, math education, and online curriculum development.',
		school: 'University of Mississippi',
		year: '2022',
		logo: '/images/IDLOGO.png',
	},
	{
		degree: 'A.A',
		major: 'Pre-Engineering',
		description: '4.0 GPA. Focus on theoretical and applied mathematics.',
		school: 'Mississippi Delta Community College',
		year: '2016',
		logo: '/images/IDLOGO.png',
	},
];
</script>
