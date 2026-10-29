<!-- components/Footer.vue -->
<template>
	<footer class="sig">
		<!-- US network map (the Contact section above carries the name) -->
		<ClientOnly>
			<UsNetworkMap />
		</ClientOnly>

		<div class="wrap sig-grid">
			<div class="sig-intro">
				<NuxtLink to="/" aria-label="Go to homepage" class="inline-block">
					<img src="/images/IDLOGO.webp" alt="" width="44" height="44" class="h-11 w-11" />
				</NuxtLink>
				<p class="readout !text-[var(--text)] mt-5">Senior full stack developer · Long Beach, MS</p>
				<p class="sig-blurb">Go by choice. TypeScript by trade. AWS by necessity.</p>
			</div>

			<nav class="sig-col" aria-label="Projects">
				<p class="readout sig-head"><span>01</span> Projects</p>
				<a v-for="p in projects" :key="p.url" :href="p.url" target="_blank" rel="noopener noreferrer" class="sig-link">
					{{ p.label }}
				</a>
			</nav>

			<nav class="sig-col" aria-label="Social">
				<p class="readout sig-head"><span>02</span> Social</p>
				<a v-for="s in socialLinks" :key="s.url" :href="s.url" target="_blank" rel="noopener noreferrer" class="sig-link">
					{{ s.label }} ↗
				</a>
				<a :href="`mailto:${contactEmail}`" class="sig-link">Email ↗</a>
			</nav>

			<nav class="sig-col" aria-label="Footer navigation">
				<p class="readout sig-head"><span>03</span> Pages</p>
				<NuxtLink to="/" class="sig-link">Home</NuxtLink>
				<NuxtLink v-for="link in navigationLinks" :key="link.to" :to="link.to" class="sig-link" @click="onSectionLink($event, link.to)">
					{{ link.label }}
				</NuxtLink>
				<NuxtLink to="/contact" class="sig-link">Contact</NuxtLink>
				<NuxtLink to="/teardown" class="sig-link">Teardown</NuxtLink>
			</nav>

			<div class="sig-col">
				<p class="readout sig-head"><span>04</span> Long Beach</p>
				<p class="readout">Mississippi, USA</p>
				<p class="readout">30.35°N · 89.15°W</p>
			</div>
		</div>

		<div class="wrap sig-bar">
			<NuxtLink to="/teardown" class="readout sig-credit">Design &amp; code: Andrew Long · How it's built ↗</NuxtLink>
			<span class="readout inline-flex items-center gap-1.5">
				<svg class="w-4 h-3" viewBox="0 0 19 13" fill="none" aria-hidden="true">
					<rect width="19" height="13" rx="1" fill="#8B9097" />
					<rect y="1" width="19" height="1" fill="#0A0B0C" />
					<rect y="3" width="19" height="1" fill="#0A0B0C" />
					<rect y="5" width="19" height="1" fill="#0A0B0C" />
					<rect y="7" width="19" height="1" fill="#0A0B0C" />
					<rect y="9" width="19" height="1" fill="#0A0B0C" />
					<rect y="11" width="19" height="1" fill="#0A0B0C" />
					<rect width="8" height="7" fill="#8B9097" />
				</svg>
				Made in the USA · © {{ year }}
			</span>
		</div>
	</footer>
</template>

<script setup>
const year = new Date().getFullYear();
const onSectionLink = useSectionLink();

// Open-source tools, linked to their repos
const projects = [
	{ label: 'crawlmark', url: 'https://github.com/idrewlong/crawlmark-mcp' },
	{ label: 'Skinamp', url: 'https://github.com/idrewlong/skinamp' },
	{ label: 'djilog', url: 'https://github.com/idrewlong/djilog' },
	{ label: 'Shrinkr', url: 'https://github.com/idrewlong/shrinkr_cli' },
	{ label: 'Morphr', url: 'https://github.com/idrewlong/morphr' },
];
</script>

<style scoped>
.sig {
	position: relative;
	width: 100%;
	overflow: hidden;
	border-top: 1px solid var(--border);
	background: var(--bg);
}

.sig-grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 2rem 1.5rem;
	padding-top: 3.5rem;
	padding-bottom: 2.5rem;
}

@media (min-width: 976px) {
	.sig-grid {
		grid-template-columns: 2fr repeat(4, minmax(0, 1fr));
	}
}

.sig-intro {
	grid-column: 1 / -1;
}

@media (min-width: 976px) {
	.sig-intro {
		grid-column: auto;
	}
}

.sig-blurb {
	margin-top: 0.75rem;
	max-width: 32ch;
	font-size: 0.9375rem;
	line-height: 1.6;
	color: var(--text-muted);
}

.sig-col {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 0.15rem;
}

.sig-head {
	margin-bottom: 0.6rem;
	color: var(--text);
}

.sig-head span {
	color: var(--accent);
	margin-right: 0.4rem;
}

.sig-link {
	display: inline-flex;
	align-items: center;
	min-height: 32px;
	font-family: 'Geist Mono', monospace;
	font-size: 11px;
	letter-spacing: 0.18em;
	text-transform: uppercase;
	color: var(--text-muted);
	text-decoration: none;
	transition: color 0.15s ease;
}

.sig-link:hover {
	color: var(--accent);
}

/* Touch screens get full 44px tap targets */
@media (pointer: coarse) {
	.sig-link {
		min-height: 44px;
	}
}

.sig-bar {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	gap: 0.75rem 1.5rem;
	padding-top: 1rem;
	padding-bottom: 1.25rem;
	border-top: 1px solid var(--border);
}

.sig-credit {
	text-decoration: none;
	transition: color 0.15s ease;
}

.sig-credit:hover {
	color: var(--accent);
}
</style>
