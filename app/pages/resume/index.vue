<template>
	<div ref="root" class="wrap cv">
		<!-- Toolbar -->
		<div class="cv-bar js-reveal">
			<NuxtLink to="/" class="btn btn-ghost">
				<Icon name="heroicons:arrow-left-20-solid" class="w-4 h-4" :aria-hidden="true" />
				<span>Back to site</span>
			</NuxtLink>
			<div class="cv-actions">
				<button type="button" class="btn btn-ghost" @click="print">
					<span>Print</span>
				</button>
				<a :href="RESUME_PDF" download class="btn btn-solid">
					<Icon name="heroicons:arrow-down-tray" class="w-4 h-4" :aria-hidden="true" />
					<span>Download PDF</span>
				</a>
			</div>
		</div>

		<!-- The sheet -->
		<article class="cv-sheet">
			<span class="cv-tick cv-tick--tl" aria-hidden="true">+</span>
			<span class="cv-tick cv-tick--br" aria-hidden="true">+</span>

			<header class="cv-head">
				<h1 class="display cv-name">
					<span class="cv-mask"><span class="cv-word">Andrew Long</span></span>
				</h1>
				<p class="display cv-role js-reveal">Senior Full Stack Developer</p>
				<ul class="cv-contact js-reveal">
					<li>
						<Icon name="heroicons:envelope" class="w-4 h-4" :aria-hidden="true" />
						<a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a>
					</li>
					<li>
						<Icon name="heroicons:map-pin" class="w-4 h-4" :aria-hidden="true" />
						<span>Long Beach, MS</span>
					</li>
					<li v-for="link in socialLinks" :key="link.url">
						<Icon :name="link.icon" class="w-4 h-4" :aria-hidden="true" />
						<a :href="link.url" target="_blank" rel="noopener noreferrer">{{ link.label }}</a>
					</li>
				</ul>
			</header>

			<div class="cv-grid">
				<!-- Main column -->
				<div class="cv-main">
					<section class="cv-sec js-reveal" aria-labelledby="cv-profile">
						<h2 id="cv-profile" class="display cv-h">Profile</h2>
						<p class="cv-profile">
							Senior full stack developer at Mad Genius. I build client web and
							mobile apps from the database schema to production, and I fix
							security and compliance gaps in AWS for Mississippi state agencies.
							I came up through SEO and marketing, so I start every build by asking
							what it's supposed to do for the business.
						</p>
					</section>

					<section class="cv-sec" aria-labelledby="cv-experience">
						<h2 id="cv-experience" class="display cv-h js-reveal">Professional experience</h2>
						<article
							v-for="exp in experiences"
							:key="exp.title + exp.company"
							class="cv-card js-reveal"
						>
							<div class="cv-card-head">
								<div>
									<h3 class="display cv-card-title">{{ exp.title }}</h3>
									<p class="cv-card-org">{{ exp.company }}</p>
								</div>
								<p class="readout cv-date">{{ exp.period }}</p>
							</div>
							<ul class="cv-points">
								<li v-for="(point, j) in exp.achievements" :key="j">{{ point }}</li>
							</ul>
						</article>
					</section>

					<section class="cv-sec" aria-labelledby="cv-education">
						<h2 id="cv-education" class="display cv-h js-reveal">Education</h2>
						<article v-for="edu in educationList" :key="edu.school" class="cv-card js-reveal">
							<div class="cv-card-head">
								<div>
									<h3 class="display cv-card-title">{{ edu.degree }}, {{ edu.major }}</h3>
									<p class="cv-card-org">{{ edu.school }}</p>
								</div>
								<p class="readout cv-date">{{ edu.year }}</p>
							</div>
							<p class="cv-note">{{ edu.achievements.join(' · ') }}</p>
						</article>
					</section>
				</div>

				<!-- Sidebar -->
				<aside class="cv-side">
					<section class="cv-sec js-reveal" aria-labelledby="cv-skills">
						<h2 id="cv-skills" class="display cv-h">Skills</h2>
						<div v-for="cat in skillCategories" :key="cat.title" class="cv-skill-group">
							<p class="readout">{{ cat.title }}</p>
							<ul class="cv-chips">
								<li v-for="skill in cat.skills" :key="skill">{{ skill }}</li>
							</ul>
						</div>
					</section>

					<section class="cv-sec js-reveal" aria-labelledby="cv-certs">
						<h2 id="cv-certs" class="display cv-h">Certifications</h2>
						<div v-for="cert in certifications" :key="cert.name" class="cv-cert">
							<img :src="cert.badge" :alt="`${cert.name} badge`" width="56" height="56" />
							<div>
								<p class="display cv-card-title">{{ cert.name }}</p>
								<p class="readout">{{ cert.issuer }} · {{ cert.code }} · {{ cert.date }}</p>
								<a
									v-if="cert.verifyUrl"
									:href="cert.verifyUrl"
									target="_blank"
									rel="noopener noreferrer"
									class="readout cv-verify"
								>Verify on Credly ↗</a>
							</div>
						</div>
					</section>
				</aside>
			</div>
		</article>
	</div>
</template>

<script setup>
import { RESUME_PDF } from '#shared/siteData/recruiter';
import { ref, onMounted } from 'vue';
import { onPageLeft } from '~/composables/usePageLeave';
import { experiences, educationList, skillCategories, certifications } from '#shared/siteData/resume';



const root = ref(null);
useReveal(root);

const { $gsap } = useNuxtApp();
let mm;

// The name rises out of its mask, like the inner-page headers
onMounted(() => {
	mm = $gsap.matchMedia(root.value);
	mm.add('(prefers-reduced-motion: reduce)', () => {
		$gsap.set('.cv-word', { autoAlpha: 1 });
	});
	mm.add('(prefers-reduced-motion: no-preference)', () => {
		$gsap.fromTo('.cv-word', { yPercent: 110, autoAlpha: 1 }, { yPercent: 0, duration: 1.1, ease: 'expo.out' });
	});
});

onPageLeft(() => mm?.revert());

const print = () => window.print();

useSeoMeta({
	title: 'Resume',
	description:
		'Resume of Andrew Long, senior full stack developer at Mad Genius: experience, education, skills and certifications.',
	ogTitle: 'Resume | Andrew Long',
	ogDescription:
		'Resume of Andrew Long, senior full stack developer at Mad Genius: experience, education, skills and certifications.',
});

// The page is about the site's Person identity (nuxt.config schemaOrg)
useSchemaOrg([defineWebPage({ '@type': 'ProfilePage', mainEntity: { '@id': 'https://www.idrewlong.com/#identity' } })]);
</script>

<style scoped>
.cv {
	padding-top: 2.5rem;
	padding-bottom: 6rem;
	max-width: 76rem;
}

.cv-bar {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	gap: 0.75rem;
	margin-bottom: 1.5rem;
}

.cv-bar .btn {
	gap: 0.75rem;
}

.cv-actions {
	display: flex;
	gap: 0.75rem;
}

.cv-sheet {
	position: relative;
	padding: 2rem 1.25rem;
	border: 1px solid var(--border);
	background: #0c0d0f;
}

@media (min-width: 768px) {
	.cv-sheet {
		padding: 3rem 2.5rem;
	}
}

.cv-tick {
	position: absolute;
	font-family: 'Geist Mono', ui-monospace, monospace;
	font-size: 12px;
	line-height: 1;
	color: var(--text-muted);
}

.cv-tick--tl {
	top: -7px;
	left: -4px;
}

.cv-tick--br {
	bottom: -7px;
	right: -4px;
}

/* Header */
.cv-name {
	font-size: clamp(3.5rem, 11vw, 7.5rem);
	line-height: 0.85;
}

.cv-mask {
	display: block;
	overflow: hidden;
	padding-bottom: 0.04em;
}

.cv-word {
	display: inline-block;
	visibility: hidden;
}

.cv-role {
	margin-top: 0.5rem;
	font-size: clamp(1.5rem, 3.4vw, 2.25rem);
	line-height: 1;
	color: var(--text-muted);
}

.cv-contact {
	display: flex;
	flex-wrap: wrap;
	gap: 0.75rem 2rem;
	margin-top: 1.75rem;
	padding-bottom: 1.75rem;
	border-bottom: 1px solid var(--border);
	font-family: 'Geist Mono', ui-monospace, monospace;
	font-size: 11px;
	letter-spacing: 0.12em;
	text-transform: uppercase;
	color: var(--text-muted);
}

.cv-contact li {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
}

.cv-contact a {
	color: var(--text);
	text-decoration: none;
}

.cv-contact a:hover {
	color: var(--accent);
}

/* Touch screens get full 44px tap targets */
@media (pointer: coarse) {
	.cv-contact a,
	.cv-verify {
		display: inline-flex;
		align-items: center;
		min-height: 44px;
	}
}

/* Body */
.cv-grid {
	display: grid;
	grid-template-columns: 1fr;
	gap: 1rem 3rem;
}

@media (min-width: 976px) {
	.cv-grid {
		grid-template-columns: minmax(0, 1fr) 20rem;
	}
}

.cv-sec {
	margin-top: 2.5rem;
}

.cv-h {
	margin-bottom: 1.25rem;
	padding-bottom: 0.6rem;
	border-bottom: 1px solid var(--border);
	font-size: 1.75rem;
	line-height: 1;
}

.cv-profile {
	font-size: 1.0625rem;
	line-height: 1.65;
	color: var(--text);
}

.cv-card {
	padding: 1.25rem;
	border: 1px solid var(--border);
	background: var(--bg-card);
	transition: border-color 0.2s ease;
}

.cv-card + .cv-card {
	margin-top: 1rem;
}

.cv-card:hover {
	border-color: #3a3f44;
}

.cv-card-head {
	display: flex;
	flex-direction: column-reverse;
	gap: 0.5rem;
}

@media (min-width: 640px) {
	.cv-card-head {
		flex-direction: row;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1.5rem;
	}
}

.cv-card-title {
	font-size: 1.5rem;
	line-height: 1.05;
}

.cv-card-org {
	margin-top: 0.25rem;
	color: var(--text-muted);
}

.cv-date {
	flex-shrink: 0;
	white-space: nowrap;
}

.cv-points {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	margin-top: 1rem;
}

.cv-points li {
	position: relative;
	padding-left: 1rem;
	font-size: 0.9375rem;
	line-height: 1.55;
	color: var(--text);
}

.cv-points li::before {
	content: '';
	position: absolute;
	left: 0;
	top: 0.7em;
	width: 6px;
	height: 1px;
	background: var(--accent);
}

.cv-note {
	margin-top: 0.75rem;
	font-size: 0.9375rem;
	color: var(--text-muted);
}

/* Sidebar */
.cv-skill-group + .cv-skill-group {
	margin-top: 1.25rem;
}

.cv-chips {
	display: flex;
	flex-wrap: wrap;
	gap: 6px;
	margin-top: 0.6rem;
}

.cv-chips li {
	padding: 0.35rem 0.6rem;
	border: 1px solid var(--border);
	font-family: 'Geist Mono', ui-monospace, monospace;
	font-size: 10.5px;
	letter-spacing: 0.08em;
	text-transform: uppercase;
	color: var(--text);
}

.cv-cert {
	display: flex;
	gap: 1rem;
	align-items: flex-start;
}

.cv-cert img {
	width: 56px;
	height: 56px;
	flex-shrink: 0;
}

.cv-cert .readout {
	margin-top: 0.35rem;
}

.cv-verify {
	display: inline-block;
	color: var(--accent);
	text-decoration: none;
}

.cv-verify:hover {
	text-decoration: underline;
}

/* Print: just the sheet, black on white */
@media print {
	.cv {
		padding: 0;
		max-width: none;
	}

	.cv-bar,
	.cv-tick {
		display: none;
	}

	.cv-sheet,
	.cv-card {
		border: 0;
		padding: 0;
		background: none;
	}

	.cv-card {
		margin-top: 1rem;
		break-inside: avoid;
	}

	.cv *,
	.cv-word,
	.js-reveal {
		visibility: visible !important;
		opacity: 1 !important;
		transform: none !important;
		color: #000 !important;
		border-color: #ccc !important;
	}

	.cv-grid {
		grid-template-columns: minmax(0, 1fr) 14rem;
		gap: 0 2rem;
	}
}
</style>

<style>
/* Hide the site chrome when printing the resume */
@media print {
	/* Everything in the app shell except <main>: header, footer, cursor, chat, frame */
	#__nuxt:has(.cv) > div > :not(main) {
		display: none !important;
	}

	html:has(.cv),
	body:has(.cv),
	#__nuxt:has(.cv) {
		color-scheme: light;
		background: #fff !important;
	}
}
</style>
