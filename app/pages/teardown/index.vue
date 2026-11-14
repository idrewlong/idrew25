<template>
	<div ref="root" class="teardown">
		<PageHeader
			index="[ 00 / 01 ]"
			kicker="Teardown"
			:title="['Tear', 'down']"
			lede="This site, taken apart piece by piece. Each part runs live next to what it does, why it's there and how it works, with what it costs to run."
		>
			<StatTiles
				:items="[
					{ value: String(entries.length).padStart(2, '0'), label: 'Components' },
					{ value: '04', label: 'Live data sources' },
				]"
			/>
		</PageHeader>

		<!-- Section opener -->
		<section class="wrap" aria-labelledby="components-title">
			<div class="sec-rule js-reveal">
				<span class="readout text-[var(--accent)]">[ 01 / 01 ]</span>
				<span class="readout">Components</span>
				<span class="readout ml-auto">Live demos · code in the repo</span>
			</div>
			<h2 id="components-title" class="display sec-word js-reveal">Components</h2>

			<LabEntry v-for="(e, i) in entries" :key="e.id" v-bind="e" :index="i + 1">
				<LabDemoScene v-if="e.id === 'globe'" kind="globe" />
				<LabDemoSatellites v-else-if="e.id === 'satellites'" />
				<LabDemoScene v-else-if="e.id === 'launch'" kind="rocket" />
				<LabDemoCursor v-else-if="e.id === 'cursor'" />
				<div v-else-if="e.id === 'network'" class="td-map"><UsNetworkMap /></div>
				<LabDemoGuardrails v-else-if="e.id === 'assistant'" />
				<LabDemoOps v-else-if="e.id === 'ops'" />
			</LabEntry>

			<!-- The glyph lookup at the heart of the ASCII renderer -->
			<figure class="td-code js-reveal">
				<figcaption class="readout">
					<span>
						<span class="text-[var(--accent)]">●</span> app/scenes/AsciiStage.ts · glyph lookup
					</span>
				</figcaption>
				<pre><code>{{ shaderExcerpt }}</code></pre>
			</figure>

			<div class="td-stack js-reveal">
				<p class="readout">Stack</p>
				<p>
					Nuxt 4 and Vue 3, Tailwind 4, GSAP and Lenis, Three.js, a Sanity-backed
					blog, Vitest, on Vercel. Type is Big Shoulders Display, Archivo and
					Geist Mono.
				</p>
			</div>
		</section>
	</div>
</template>

<script setup>
import { ref } from 'vue';

const root = ref(null);
useReveal(root);


// Every line here can be checked against this repo.
const entries = [
	{
		id: 'globe',
		path: 'app/scenes/GlobeScene.ts',
		name: 'Dot globe',
		summary: 'The hero Earth: about 28,000 dots, real coastlines, a marker on Long Beach. Drag it.',
		why: 'A hero built from real data instead of a stock photo, and it says where I work from at a glance.',
		how: 'Natural Earth 1:50m land, rasterised offline into a 720 × 360 one-bit mask (43 KB). Dots sit on latitude rows; a point shader lights land and fades the limb. An invisible depth-only core hides the far side of each orbit. Dragging rotates it with inertia.',
		tags: ['Three.js', 'GLSL', 'Natural Earth', 'Pointer events'],
		cost: 'Three.js · ~131 KB gzipped, after first paint',
		tradeoff: 'The home page now always loads Three.js. It arrives after the headline renders and stops drawing when the hero is off screen or the tab is hidden.',
	},
	{
		id: 'satellites',
		path: 'server/api/satellites.get.ts · app/scenes/orbits.ts',
		name: 'Live satellites',
		summary: 'The ISS, Hubble, Landsat 9 and NOAA-21 where they are right now, recomputed every second.',
		why: 'Live data makes the globe true rather than decorative.',
		how: 'A server route pulls orbital elements (TLEs) from CelesTrak and caches them for two hours, matching their update cycle. The browser propagates each one with SGP4 via satellite.js. I checked the ISS against an independent tracker and the positions matched.',
		tags: ['Nitro', 'CelesTrak', 'SGP4', 'satellite.js'],
		cost: '1 upstream call per 2 hours',
		tradeoff: 'CelesTrak refuses repeat downloads of large groups inside one update window, so the Starlink sample is cached separately and can be empty for a while after a deploy.',
	},
	{
		id: 'launch',
		path: 'app/scenes/RocketScene.ts · app/scenes/AsciiStage.ts',
		name: 'ASCII launch',
		summary: 'A Falcon 9-style mission drawn in characters: pad, ignition, staging, fairing separation, deploy.',
		why: 'Plan, build, ship, told as a launch instead of a list.',
		how: 'The scene renders into a tiny target, one texel per character cell. A fragment shader picks a glyph by brightness and keeps warm colours, so the exhaust stays orange. Every part is a pure function of scroll progress, so scrolling back plays it in reverse. Scrub it here.',
		tags: ['Three.js', 'Render target', 'GSAP ScrollTrigger'],
		cost: 'Renders only while on screen',
		tradeoff: 'The home section pins for 4.2 screen heights. That much scroll is the point, but it is a long way to the next section.',
	},
	{
		id: 'cursor',
		path: 'app/components/SiteCursor.vue',
		name: 'Cursor',
		summary: 'An arrow with a trailing signal square. It changes over links and drag zones, and steps aside in Work.',
		why: 'A small, consistent detail that matches the readout style without hiding the actual pointer position.',
		how: 'The arrow follows the pointer through GSAP quickSetter (no lag); the square uses quickTo with easing. State comes from one delegated pointerover listener checking what is under the pointer.',
		tags: ['GSAP', 'Pointer events', 'matchMedia'],
		cost: 'One listener, transforms only',
		tradeoff: 'Off on touch screens and with reduced motion, where the native cursor is the right answer anyway.',
	},
	{
		id: 'network',
		path: 'app/components/UsNetworkMap.vue · server/api/served-from.get.ts',
		name: 'Network map',
		summary: 'The lower 48 seen from the Gulf, with the US regions this site can run in, and the one that served you.',
		why: 'Infrastructure is part of the job; this shows it instead of saying it.',
		how: 'The same land mask as the globe, clipped to a rough US outline and projected onto a ground plane with simple perspective. "Served from" reads VERCEL_REGION from a no-store API route, so it is the real region that ran the request.',
		tags: ['Canvas 2D', 'Perspective', 'Vercel'],
		cost: 'Dots drawn once, arcs per frame',
		tradeoff: 'Locally there is no Vercel region, so it reports the dev server.',
	},
	{
		id: 'assistant',
		path: 'server/api/assistant.post.ts · server/utils/assistantGuard.ts',
		name: 'AI assistant',
		summary: 'A Claude-backed chat that answers only about me and this site, built so strangers can’t spend my API credits.',
		why: 'Recruiters can ask a direct question and get an answer from what is published here.',
		how: 'Seven checks run before the model is called, cheapest first. Counters are atomic Upstash INCRs so concurrent bursts can’t slip through, and replies are HMAC-signed so a visitor can’t invent earlier answers. An independent security review found four issues; all four are fixed.',
		tags: ['Claude API', 'Upstash Redis', 'HMAC', 'Rate limiting'],
		cost: 'Capped daily, plus a Console spend limit',
		tradeoff: 'Production refuses to run it without shared storage. Safer, but one more service to keep up.',
	},
	{
		id: 'ops',
		path: 'server/api/ops.get.ts · server/api/ops/dora.get.ts · .github/workflows/ops-monitor.yml',
		name: 'Ops panel',
		summary: 'How this site is running right now: the deploy you are looking at, its CI result, how your request was served, 30 days of uptime, the latest Lighthouse score, delivery (DORA) metrics and what the assistant has cost today.',
		why: 'Most DevOps work is invisible when it goes well. This puts the pipeline, the cache, the monitoring and the bill where you can see them.',
		how: 'Deploy details are captured at build time from Vercel’s git variables, and CI is GitHub’s check runs for that commit. The route is cached at Vercel’s edge for 60 seconds, and the panel reads x-vercel-cache and x-vercel-id from your response to show whether the edge answered and which region ran it. A scheduled GitHub Action checks the home page from outside Vercel every 15 minutes and runs Lighthouse once a day, reporting to an authenticated endpoint that stores results in Upstash. DORA metrics come from the production deployments Vercel records on GitHub. Each assistant answer adds its real token counts to a daily total, priced at list rates.',
		tags: ['Vercel ISR', 'GitHub Actions', 'GitHub API', 'Lighthouse', 'DORA', 'Upstash Redis'],
		cost: 'Free Actions minutes on a public repo, about one GitHub call a minute',
		tradeoff: 'GitHub can start scheduled runs late or skip them, so uptime counts the checks that actually arrived. If the whole site is unreachable the report can’t land either, so a full outage shows as missing checks rather than failures. Lighthouse is one lab run that moves from day to day, and the assistant’s cost is calculated from token counts and list prices, not read from the bill.',
	},
];

const shaderExcerpt = `vec4 src = texture2D(uScene, (cell + 0.5) / uCells);
float lum = dot(src.rgb, vec3(0.299, 0.587, 0.114));
float idx = floor(clamp(pow(lum, 0.8), 0.0, 0.999) * uGlyphCount);
vec2 guv = vec2((idx + local.x) / uGlyphCount, local.y);
float mask = texture2D(uGlyphs, guv).r;`;

useSeoMeta({
	title: 'Teardown',
	description:
		'How idrewlong.com is built, part by part with live demos: the dot globe, live satellites, the ASCII launch, the network map and the AI assistant guardrails.',
	ogTitle: 'The site, taken apart | Andrew Long',
	ogDescription:
		'How idrewlong.com is built, part by part with live demos: the dot globe, live satellites, the ASCII launch, the network map and the AI assistant guardrails.',
});
</script>

<style scoped>
.teardown {
	padding-bottom: 6rem;
}

.td-map {
	position: absolute;
	inset: 3rem 0 0;
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.td-code {
	margin-top: 4rem;
	border: 1px solid var(--border);
	background: #050506;
}

.td-code figcaption {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 1rem;
	padding: 0.6rem 1rem;
	border-bottom: 1px solid var(--border);
}

.td-code pre {
	overflow-x: auto;
	padding: 1.25rem 1rem;
	font-family: 'Geist Mono', ui-monospace, monospace;
	font-size: 12.5px;
	line-height: 1.7;
	color: #c9cdd2;
}

.td-stack {
	display: grid;
	grid-template-columns: 1fr;
	gap: 0.75rem;
	margin-top: 3rem;
	padding-top: 1.5rem;
	border-top: 1px solid var(--border);
}

@media (min-width: 976px) {
	.td-stack {
		grid-template-columns: 14rem 1fr;
	}
}

.td-stack p:last-child {
	max-width: 64ch;
	font-size: 0.9375rem;
	line-height: 1.6;
	color: var(--text-muted);
}
</style>
