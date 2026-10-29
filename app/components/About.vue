<template>
	<section id="about" ref="root" class="wrap">
		<div class="sec-rule js-reveal">
			<span class="readout text-[var(--accent)]">01</span>
			<span class="readout">Profile</span>
			<span class="readout ml-auto hidden sm:inline">Operator file // A. Long</span>
		</div>
		<h2 class="display sec-word js-reveal">About<span class="sr-only"> Andrew Long</span></h2>

		<div class="about-grid">
			<!-- Left: photo + floating tech icons in a reticle frame -->
			<figure class="about-figure js-reveal">
				<div class="about-frame">
					<span class="reticle reticle--tl" aria-hidden="true"></span>
					<span class="reticle reticle--tr" aria-hidden="true"></span>
					<span class="reticle reticle--bl" aria-hidden="true"></span>
					<span class="reticle reticle--br" aria-hidden="true"></span>
					<span class="about-crosshair" aria-hidden="true"></span>
					<div class="about-glow" aria-hidden="true"></div>

					<TechIcons />

					<div class="about-photo-wrapper">
						<img
							src="/images/me_1.webp"
							alt="Andrew Long"
							class="about-photo"
							width="800"
							height="1200"
							loading="lazy"
						/>
					</div>
				</div>
				<figcaption class="about-caption readout">
					<span class="inline-flex items-center gap-1">ID // Andrew Long</span>
					<span>30.35°N 89.15°W</span>
				</figcaption>
			</figure>

			<!-- Right: statement, then bio + fact tiles (side by side on wide screens) -->
			<div class="about-copy">
				<p class="display about-statement js-reveal">
					I build web and mobile apps end to end, from the database to the
					<span class="text-[var(--accent)]">AWS servers</span> they run on.
				</p>

				<div class="about-bio mt-8 space-y-5">
					<p class="about-body js-reveal">
						I'm Andrew Long, a senior full stack developer at Mad Genius. I
						build client web and mobile apps from the database schema to
						production, and I fix security and compliance gaps in AWS for
						Mississippi state agencies.
					</p>
					<p class="about-body js-reveal">
						I got here through SEO and marketing work, so I usually ask what a
						build is supposed to do for the business before I start it. When I
						don't know something, I go find out.
					</p>
					<div class="about-actions js-reveal">
						<NuxtLink to="/resume" class="btn btn-solid">
							<span>View resume</span>
							<Icon name="heroicons:arrow-up-right-20-solid" class="w-4 h-4" :aria-hidden="true" />
						</NuxtLink>
						<a href="/Andrew%20Long%20Resume.pdf" download class="btn btn-ghost">
							<span>Download PDF</span>
							<Icon name="heroicons:arrow-down-tray" class="w-4 h-4" :aria-hidden="true" />
						</a>
					</div>
				</div>

				<div class="spec js-reveal">
					<p class="spec-head readout">
						<span class="spec-live" aria-hidden="true"></span>
						<span class="spec-open">Open to software, platform, DevOps, AI &amp; cleared roles</span>
					</p>
					<dl class="spec-grid">
						<div
							v-for="item in currently"
							:key="item.label"
							class="spec-cell"
							:class="{ 'spec-cell--wide': item.wide }"
						>
							<dt class="readout">{{ item.label }}</dt>
							<dd>
								<a
									v-if="item.link"
									:href="item.link"
									target="_blank"
									rel="noopener noreferrer"
									class="spec-link"
								>
									{{ leadingWords(item.value)
									}}<span class="whitespace-nowrap"
										>{{ lastWord(item.value)
										}}<Icon
											name="heroicons:arrow-up-right-20-solid"
											class="w-3.5 h-3.5 shrink-0"
											:aria-hidden="true"
									/></span>
								</a>
								<span v-else>{{ item.value }}</span>
							</dd>
						</div>
					</dl>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
import { ref } from 'vue';

const root = ref(null);
useReveal(root);

// Keep a link's arrow glued to its last word so it never wraps onto a line alone
const lastSpace = (text) => text.lastIndexOf(' ');
const leadingWords = (text) => text.slice(0, lastSpace(text) + 1);
const lastWord = (text) => text.slice(lastSpace(text) + 1);

// `wide` spans two tiles; the grid packs densely so short facts fill the gaps.
const currently = [
	{ label: 'Status', value: 'U.S. Citizen' },
	{ label: 'Based in', value: 'Long Beach, MS' },
	{
		label: 'Certified',
		value: 'CompTIA Security+',
		link: 'https://www.credly.com/badges/22a82737-95da-458f-856a-02be00e5a352/public_url',
	},
	{
		label: 'Day job',
		value: 'Senior Full Stack Developer · Mad Genius',
		link: 'https://madg.com/people/andrew-long/',
		wide: true,
	},
	{ label: 'Hobbies', value: 'Soon to be Dad.' },
];
</script>

<style scoped>
/* Sits right under the bio text, lined up with it */
.about-actions {
	display: grid;
	grid-template-columns: 1fr;
	gap: 0.75rem;
	padding-top: 0.75rem;
}

@media (min-width: 480px) {
	.about-actions {
		grid-template-columns: repeat(2, minmax(0, 1fr));
		max-width: 30rem;
	}
}

.about-grid {
	display: grid;
	grid-template-columns: 1fr;
	gap: 3rem;
}

@media (min-width: 976px) {
	.about-grid {
		grid-template-columns: 26rem 1fr;
		gap: 4.5rem;
		align-items: start;
	}
}

/* Photo stays in view while the copy scrolls past (desktop) */
@media (min-width: 976px) {
	.about-figure {
		position: sticky;
		top: 6rem;
	}
}

/* ── Photo frame ── */
.about-frame {
	position: relative;
	aspect-ratio: 4 / 5;
	max-width: 26rem;
	border: 1px solid var(--border);
	background: linear-gradient(180deg, var(--bg-card) 0%, var(--bg) 100%);
	overflow: hidden;
}

.reticle {
	position: absolute;
	width: 18px;
	height: 18px;
	border-color: var(--accent);
	border-style: solid;
	border-width: 0;
	z-index: 20;
}
.reticle--tl { top: 8px; left: 8px; border-top-width: 2px; border-left-width: 2px; }
.reticle--tr { top: 8px; right: 8px; border-top-width: 2px; border-right-width: 2px; }
.reticle--bl { bottom: 8px; left: 8px; border-bottom-width: 2px; border-left-width: 2px; }
.reticle--br { bottom: 8px; right: 8px; border-bottom-width: 2px; border-right-width: 2px; }

.about-crosshair {
	position: absolute;
	inset: 0;
	pointer-events: none;
	background:
		linear-gradient(var(--border), var(--border)) center / 1px 100% no-repeat,
		linear-gradient(var(--border), var(--border)) center / 100% 1px no-repeat;
	opacity: 0.6;
}

.about-glow {
	position: absolute;
	left: 50%;
	bottom: -10%;
	width: 120%;
	aspect-ratio: 1;
	transform: translateX(-50%);
	background: radial-gradient(
		circle at center,
		rgba(255, 91, 31, 0.16) 0%,
		rgba(255, 91, 31, 0.05) 40%,
		transparent 68%
	);
	pointer-events: none;
}

.about-photo-wrapper {
	position: absolute;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
	width: 76%;
	height: 88%;
	z-index: 10;
}

.about-photo {
	width: 100%;
	height: 100%;
	object-fit: cover;
	object-position: top center;
	mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
	-webkit-mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
}

.about-caption {
	display: flex;
	justify-content: space-between;
	gap: 1rem;
	max-width: 26rem;
	padding-top: 0.75rem;
}

/* ── Copy ── */
.about-statement {
	font-size: clamp(2.25rem, 5vw, 3.75rem);
	font-weight: 800;
	max-width: 18ch;
}

.about-body {
	font-size: 1rem;
	line-height: 1.7;
	color: var(--text-muted);
}

/* ── Copy column: statement, bio and tiles share one readable width ── */
.about-copy {
	min-width: 0;
	max-width: 40rem;
}

/* Wide screens: the statement spans the column; bio and tiles sit side by
   side under it, so the section fills the width without long text lines */
@media (min-width: 1200px) {
	.about-copy {
		max-width: none;
		display: grid;
		grid-template-columns: minmax(0, 1fr) 24rem;
		grid-template-areas:
			'statement statement'
			'bio facts';
		column-gap: 3rem;
		align-items: start;
	}

	.about-statement {
		grid-area: statement;
		max-width: 22ch;
		font-size: clamp(3rem, 4.4vw, 4.5rem);
	}

	.about-bio {
		grid-area: bio;
		max-width: 34rem;
	}

	.about-copy .spec {
		grid-area: facts;
		margin-top: 2rem;
	}

	.about-copy .spec-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
}

/* ── Currently: hairline tile grid ── */
.spec {
	margin-top: 2.5rem;
}

.spec-head {
	/* Inline, so the availability line wraps like text beside the square */
	display: block;
	margin-bottom: 0.75rem;
	color: var(--accent);
}

.spec-live {
	display: inline-block;
	width: 6px;
	height: 6px;
	margin-right: 0.6rem;
	vertical-align: 0.15em;
	background: var(--accent);
	animation: spec-pulse 2.4s ease-in-out infinite;
}

@keyframes spec-pulse {
	50% {
		opacity: 0.35;
	}
}

@media (prefers-reduced-motion: reduce) {
	.spec-live {
		animation: none;
	}
}

.spec-open {
	color: var(--text);
}

.spec-grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	grid-auto-flow: dense;
	border-top: 1px solid var(--border);
	border-left: 1px solid var(--border);
	background: var(--bg-card);
}

@media (min-width: 640px) {
	.spec-grid {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
}

.spec-cell {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	padding: 1rem 1.25rem 1.1rem;
	border-right: 1px solid var(--border);
	border-bottom: 1px solid var(--border);
}

.spec-cell--wide {
	grid-column: span 2;
}

.spec-cell dd {
	font-size: 0.9375rem;
	line-height: 1.35;
	color: var(--text);
}

/* Inline (not flex) so the arrow follows the last word when the value wraps */
.spec-link {
	color: var(--text);
	text-decoration: none;
	transition: color 0.15s ease;
}

.spec-link:hover {
	color: var(--accent);
}

.spec-link :deep(svg),
.spec-link :deep(.iconify) {
	display: inline-block;
	margin-left: 0.3rem;
	vertical-align: -0.1em;
}
</style>
