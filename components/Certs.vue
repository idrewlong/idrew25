<template>
	<section ref="certsSection" class="max-w-6xl mx-auto px-4 sm:px-6 w-full">
		<!-- Section label -->
		<div ref="labelEl" class="flex items-center gap-3 mb-10">
			<span class="text-[10px] font-bold tracking-[0.25em] uppercase text-stone-400"
				>Certifications</span
			>
			<div class="flex-1 h-px bg-stone-200"></div>
		</div>

		<!-- Card grid -->
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			<div
				v-for="(cert, i) in certifications"
				:key="cert.name"
				:ref="(el) => { if (el) cardEls[i] = el }"
				class="cert-card group relative bg-white border border-stone-200 rounded-xl overflow-hidden"
			>
				<!-- Left accent bar -->
				<div
					:class="[
						'absolute left-0 top-0 bottom-0 w-0.5',
						cert.status === 'earned' ? 'bg-stone-300' : 'bg-orange-400',
					]"
				></div>

				<!-- Watermark for in-progress -->
				<div
					v-if="cert.status !== 'earned'"
					class="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
					aria-hidden="true"
				>
					<span class="watermark-text font-mono tracking-[0.4em] uppercase text-stone-100 rotate-[-20deg] whitespace-nowrap font-bold leading-none">
						TBA
					</span>
				</div>

				<!-- Card content -->
				<div class="relative z-10 pl-5 pr-5 pt-5 pb-5 flex flex-col gap-4">
					<!-- Top row: issuer + status -->
					<div class="flex items-center justify-between gap-3">
						<div class="flex items-center gap-1.5">
							<span class="w-1 h-1 rounded-full bg-orange-400 shrink-0"></span>
							<span class="text-[9px] font-mono tracking-[0.2em] uppercase text-orange-400">
								{{ cert.issuer }}
							</span>
						</div>
						<!-- Status -->
						<div
							v-if="cert.status !== 'earned'"
							class="flex items-center gap-1.5"
						>
							<span class="status-pulse w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0"></span>
							<span class="text-[9px] font-mono tracking-[0.15em] uppercase text-orange-400">In Progress</span>
						</div>
						<span
							v-else
							class="text-[9px] font-mono tracking-[0.15em] uppercase text-stone-400"
						>{{ cert.date }}</span>
					</div>

					<!-- Cert name -->
					<div>
						<h3 class="text-lg font-bold font-serif text-stone-900 leading-snug">
							{{ cert.name }}
						</h3>
						<p v-if="cert.code" class="text-[10px] font-mono text-stone-400 tracking-[0.15em] mt-1">
							{{ cert.code }}
						</p>
					</div>

					<!-- Footer: category tags -->
					<div class="flex flex-wrap gap-1.5 pt-1 border-t border-stone-100">
						<span
							v-for="tag in cert.tags"
							:key="tag"
							class="text-[9px] font-mono tracking-[0.12em] uppercase text-stone-400 bg-stone-50 px-2 py-0.5 rounded"
						>{{ tag }}</span>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';

const { $gsap } = useNuxtApp();

const certsSection = ref(null);
const labelEl = ref(null);
const cardEls = ref([]);

const certifications = [
	{
		name: 'CompTIA Security+',
		issuer: 'CompTIA',
		code: 'SY0-701',
		status: 'in-progress',
		date: null,
		tags: ['Security', 'Networking', 'Compliance'],
	},
];

onMounted(() => {
	nextTick(() => {
		if (!certsSection.value) return;

		$gsap.set(labelEl.value, { opacity: 0, y: 20 });
		$gsap.set(cardEls.value.filter(Boolean), { opacity: 0, y: 24, scale: 0.98 });

		const tl = $gsap.timeline({
			scrollTrigger: {
				trigger: certsSection.value,
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
			cardEls.value.filter(Boolean),
			{
				opacity: 1,
				y: 0,
				scale: 1,
				duration: 0.55,
				ease: 'power3.out',
				stagger: 0.08,
				clearProps: 'all',
			},
			'-=0.2'
		);
	});
});
</script>

<style scoped>
.cert-card {
	transition: box-shadow 0.2s ease, border-color 0.2s ease;
}

.cert-card:hover {
	box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.06);
	border-color: #d6d3d1;
}

.status-pulse {
	animation: status-pulse 2.2s ease-in-out infinite;
}

@keyframes status-pulse {
	0%, 100% { opacity: 1; }
	50% { opacity: 0.2; }
}

.watermark-text {
	opacity: 0.045;
	font-size: clamp(28px, 6vw, 52px);
}
</style>
