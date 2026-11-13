<template>
	<section id="certifications" ref="root" class="wrap">
		<div class="sec-rule js-reveal">
			<span class="readout text-[var(--accent)]">04</span>
			<span class="readout">Credentials</span>
		</div>
		<h2 class="display sec-word js-reveal">Certified<span class="sr-only">: certifications</span></h2>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<article
				v-for="cert in certifications"
				:key="cert.name"
				class="cert js-reveal"
			>
				<component
					:is="cert.verifyUrl ? 'a' : 'div'"
					v-if="cert.badge"
					:href="cert.verifyUrl"
					:target="cert.verifyUrl ? '_blank' : undefined"
					:rel="cert.verifyUrl ? 'noopener noreferrer' : undefined"
					class="cert-badge"
				>
					<img
						:src="cert.badge"
						:alt="cert.verifyUrl ? `Verify ${cert.name} on Credly` : `${cert.name} certification badge`"
						width="96"
						height="96"
						loading="lazy"
						class="w-20 h-20 sm:w-24 sm:h-24 object-contain"
					/>
				</component>

				<div class="min-w-0 flex-1">
					<p class="readout">
						{{ cert.issuer }}
						<template v-if="cert.code"> · {{ cert.code }}</template>
					</p>
					<h3 class="display cert-name">{{ cert.name }}</h3>

					<div class="cert-foot">
						<span v-if="cert.status === 'earned'" class="readout cert-status">
							<span class="cert-dot" aria-hidden="true"></span>
							Issued {{ cert.date }}
						</span>
						<span v-else class="readout text-[var(--accent)]">In progress</span>

						<a
							v-if="cert.verifyUrl"
							:href="cert.verifyUrl"
							target="_blank"
							rel="noopener noreferrer"
							class="readout cert-verify"
						>
							Verify on Credly
							<Icon
								name="heroicons:arrow-up-right-20-solid"
								class="w-3.5 h-3.5"
								:aria-hidden="true"
							/>
						</a>
					</div>
				</div>
			</article>
		</div>
	</section>
</template>

<script setup>
import { ref } from 'vue';
import { certifications } from '#shared/siteData/resume';

const root = ref(null);
useReveal(root);

</script>

<style scoped>
.cert {
	position: relative;
	display: flex;
	align-items: center;
	gap: 1.5rem;
	padding: 1.5rem;
	border: 1px solid var(--border);
	background: var(--bg-card);
	transition: border-color 0.2s ease;
}

.cert:hover {
	border-color: #3a3f44;
}

/* Signal edge on the left, like a status bar on a panel */
.cert::before {
	content: '';
	position: absolute;
	left: -1px;
	top: -1px;
	bottom: -1px;
	width: 2px;
	background: var(--accent);
}

.cert-badge {
	flex-shrink: 0;
	transition: transform 0.2s ease;
}

a.cert-badge:hover {
	transform: scale(1.04);
}

.cert-name {
	margin-top: 0.5rem;
	font-size: clamp(1.5rem, 3vw, 2rem);
	line-height: 1;
}

.cert-foot {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	gap: 0.75rem 1rem;
	margin-top: 1.25rem;
	padding-top: 1rem;
	border-top: 1px solid var(--border);
}

.cert-status {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	color: var(--text);
}

.cert-dot {
	width: 6px;
	height: 6px;
	background: #3ddc84;
}

.cert-verify {
	display: inline-flex;
	align-items: center;
	gap: 0.35rem;
	min-height: 44px;
	color: var(--accent);
	text-decoration: none;
}

.cert-verify:hover {
	color: var(--text);
}

@media (prefers-reduced-motion: reduce) {
	.cert,
	.cert-badge {
		transition: none;
	}
}
</style>
