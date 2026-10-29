<template>
	<svg
		class="pa"
		viewBox="0 0 1600 900"
		:preserveAspectRatio="crop ? 'xMidYMid slice' : 'xMidYMid meet'"
		role="img"
		:aria-label="labels[name]"
	>
		<defs>
			<pattern :id="`pa-dots-${uid}`" width="32" height="32" patternUnits="userSpaceOnUse">
				<rect x="15" y="15" width="2" height="2" fill="#24282c" />
			</pattern>
		</defs>
		<rect width="1600" height="900" fill="#0a0b0c" />
		<rect width="1600" height="900" :fill="`url(#pa-dots-${uid})`" />

		<!-- crawlmark: data sources → MCP server (cache + caps) → Claude and its report tools -->
		<g v-if="name === 'crawlmark'">
			<text x="80" y="90" class="pa-mono pa-muted">crawlmark-mcp</text>
			<text x="1520" y="90" class="pa-mono pa-muted" text-anchor="end">MCP · TYPESCRIPT</text>

			<g v-for="(src, i) in crawlSources" :key="src">
				<path :d="`M440 ${185 + i * 92} C 530 ${185 + i * 92}, 530 430, 620 430`" class="pa-flow" />
				<rect x="80" :y="150 + i * 92" width="360" height="70" class="pa-box" />
				<rect x="80" :y="150 + i * 92" width="3" height="70" fill="#8b9097" />
				<text x="104" :y="192 + i * 92" class="pa-mono">{{ src }}</text>
			</g>

			<path d="M980 430 C 1070 430, 1070 200, 1160 200" class="pa-flow pa-flow--hot" />
			<g v-for="(tool, i) in crawlTools" :key="tool">
				<path :d="`M980 430 C 1070 430, 1070 ${332 + i * 82}, 1160 ${332 + i * 82}`" class="pa-flow" />
				<rect x="1160" :y="300 + i * 82" width="360" height="64" class="pa-box" />
				<text x="1184" :y="340 + i * 82" class="pa-mono">{{ tool }}()</text>
			</g>

			<rect x="1160" y="150" width="360" height="100" class="pa-box pa-box--hot" />
			<text x="1184" y="192" class="pa-mono pa-accent">CLAUDE</text>
			<text x="1184" y="226" class="pa-mono pa-muted">any MCP client</text>

			<rect x="620" y="280" width="360" height="300" class="pa-box pa-box--hot" />
			<text x="650" y="360" class="pa-display" font-size="64">crawlmark</text>
			<text x="650" y="400" class="pa-mono pa-muted">report-shaped tools</text>
			<!-- SQLite cache -->
			<g transform="translate(650 440)">
				<ellipse cx="40" cy="10" rx="40" ry="10" class="pa-line" />
				<path d="M0 10 V60 A40 10 0 0 0 80 60 V10" class="pa-line" />
				<path d="M0 35 A40 10 0 0 0 80 35" class="pa-line" />
				<text x="100" y="32" class="pa-mono pa-small">SQLite cache</text>
			</g>
			<!-- Monthly spend cap -->
			<text x="650" y="545" class="pa-mono pa-small pa-muted">monthly cap</text>
			<rect x="790" y="532" width="160" height="12" class="pa-box" />
			<rect x="790" y="532" width="104" height="12" fill="#ff5b1f" />

		</g>

		<!-- djilog: flight track, altitude profile, format versions and exports -->
		<g v-else-if="name === 'djilog'">
			<text x="60" y="80" class="pa-mono pa-muted">flight.txt · track</text>
			<rect x="60" y="110" width="1000" height="530" class="pa-frame" />
			<g class="pa-grid">
				<path v-for="x in 9" :key="'gx' + x" :d="`M${60 + x * 100} 110 V640`" />
				<path v-for="y in 4" :key="'gy' + y" :d="`M60 ${110 + y * 106} H1060`" />
			</g>
			<path :d="flightPath" class="pa-track-shadow" />
			<path :d="flightPath" class="pa-track" />
			<!-- Home point and aircraft -->
			<g transform="translate(180 540)">
				<circle r="18" class="pa-line" />
				<text y="7" text-anchor="middle" class="pa-mono pa-small">H</text>
			</g>
			<g transform="translate(905 230) rotate(35)">
				<path d="M0 -16 L12 14 L0 7 L-12 14 Z" fill="#ff5b1f" />
			</g>
			<g v-for="(p, i) in photoPoints" :key="i" :transform="`translate(${p[0]} ${p[1]})`">
				<rect x="-7" y="-7" width="14" height="14" class="pa-line" />
			</g>

			<text x="60" y="690" class="pa-mono pa-muted pa-small">ALTITUDE</text>
			<path d="M60 840 L60 830 C 160 760, 240 730, 340 735 S 520 700, 620 712 S 820 728, 900 705 S 1010 760, 1060 790 L1060 840 Z" fill="rgba(255,91,31,0.12)" />
			<path d="M60 830 C 160 760, 240 730, 340 735 S 520 700, 620 712 S 820 728, 900 705 S 1010 760, 1060 790" class="pa-line pa-line--hot" />
			<path d="M60 840 H1060" class="pa-line" />

			<text x="1120" y="160" class="pa-display" font-size="64">djilog</text>
			<text x="1120" y="200" class="pa-mono pa-muted">DJI flight log parser</text>

			<text x="1120" y="280" class="pa-mono pa-small pa-muted">FORMAT VERSIONS</text>
			<g v-for="v in 14" :key="'v' + v">
				<rect :x="1120 + ((v - 1) % 7) * 58" :y="300 + Math.floor((v - 1) / 7) * 58" width="48" height="48" :class="v >= 13 ? 'pa-box pa-box--hot' : 'pa-box'" />
				<text :x="1144 + ((v - 1) % 7) * 58" :y="331 + Math.floor((v - 1) / 7) * 58" text-anchor="middle" class="pa-mono pa-small" :class="{ 'pa-accent': v >= 13 }">{{ v }}</text>
			</g>
			<text x="1120" y="448" class="pa-mono pa-small pa-accent">■ v13+ encrypted</text>

			<text x="1120" y="530" class="pa-mono pa-small pa-muted">EXPORT</text>
			<g v-for="(fmt, i) in ['CSV', 'GEOJSON', 'KML', 'JSON']" :key="fmt">
				<rect x="1120" :y="550 + i * 62" width="400" height="50" class="pa-box" />
				<text x="1144" :y="583 + i * 62" class="pa-mono pa-small">{{ fmt }}</text>
				<text x="1496" :y="583 + i * 62" text-anchor="end" class="pa-mono pa-small pa-muted">→</text>
			</g>
		</g>

		<!-- Morphr: RAW files → sensor mosaic developing into a photo → output formats -->
		<g v-else-if="name === 'morphr'">
			<text x="80" y="90" class="pa-mono pa-muted">morphr · RAW converter</text>

			<g v-for="(raw, i) in ['CR2', 'NEF', 'ARW', 'DNG', '+25 MORE']" :key="raw">
				<path :d="`M380 ${215 + i * 100} C 470 ${215 + i * 100}, 470 420, 560 420`" class="pa-flow" />
				<rect x="80" :y="180 + i * 100" width="300" height="70" class="pa-box" :class="{ 'pa-box--dim': i === 4 }" />
				<text x="104" :y="223 + i * 100" class="pa-mono" :class="{ 'pa-muted': i === 4 }">{{ raw }}</text>
				<text x="356" :y="223 + i * 100" text-anchor="end" class="pa-mono pa-small pa-muted">RAW</text>
			</g>

			<!-- Sensor data on the left half, developed image on the right -->
			<g transform="translate(560 180)">
				<clipPath :id="`pa-mosaic-${uid}`"><rect width="240" height="480" /></clipPath>
				<clipPath :id="`pa-photo-${uid}`"><rect x="240" width="240" height="480" /></clipPath>
				<g :clip-path="`url(#pa-mosaic-${uid})`">
					<rect v-for="c in bayer" :key="c.k" :x="c.x" :y="c.y" width="18" height="18" :fill="c.fill" />
				</g>
				<g :clip-path="`url(#pa-photo-${uid})`">
					<rect width="480" height="480" :fill="`url(#pa-sky-${uid})`" />
					<circle cx="380" cy="190" r="46" fill="#ff5b1f" />
					<path d="M0 360 L120 280 L210 330 L320 250 L480 340 V480 H0 Z" fill="#14171a" />
					<path d="M0 410 L150 350 L280 400 L400 360 L480 390 V480 H0 Z" fill="#0a0b0c" />
				</g>
				<linearGradient :id="`pa-sky-${uid}`" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stop-color="#2a1a14" />
					<stop offset="1" stop-color="#5a2a18" />
				</linearGradient>
				<rect width="480" height="480" class="pa-frame" />
				<path d="M240 -14 V494" class="pa-line pa-line--hot" />
				<text x="0" y="520" class="pa-mono pa-small pa-muted">SENSOR</text>
				<text x="480" y="520" text-anchor="end" class="pa-mono pa-small pa-muted">DEVELOPED</text>
			</g>

			<g v-for="(out, i) in ['JPEG', 'PNG', 'TIFF', 'WEBP', 'AVIF']" :key="out">
				<path :d="`M1040 420 C 1120 420, 1120 ${215 + i * 100}, 1200 ${215 + i * 100}`" class="pa-flow" :class="{ 'pa-flow--hot': i === 4 }" />
				<rect x="1200" :y="180 + i * 100" width="320" height="70" class="pa-box" :class="{ 'pa-box--hot': i === 4 }" />
				<text x="1224" :y="223 + i * 100" class="pa-mono" :class="{ 'pa-accent': i === 4 }">{{ out }}</text>
			</g>
		</g>
	</svg>
</template>

<script setup>
/**
 * Generated covers for tools that have no screenshot. Each one diagrams what
 * the tool actually does (see the project description) in the site's palette.
 * `crop` fills the box (used by the narrow hover peek).
 */
const props = defineProps({
	name: { type: String, required: true }, // 'crawlmark' | 'djilog' | 'morphr'
	crop: { type: Boolean, default: false },
});

// Unique ids so several copies on one page don't share pattern/clip ids
const uid = `${props.name}-${props.crop ? 'c' : 'f'}`;

const labels = {
	crawlmark: 'Diagram: Search Console, GA4, Tag Manager, Lighthouse, axe-core and keyword APIs feed crawlmark, which serves report tools to Claude.',
	djilog: 'Diagram: a drone flight track and altitude profile parsed by djilog, with its 14 log versions and export formats.',
	morphr: 'Diagram: RAW camera files converted by Morphr from sensor data into JPEG, PNG, TIFF, WebP or AVIF.',
};

const crawlSources = ['SEARCH CONSOLE', 'GA4', 'TAG MANAGER', 'LIGHTHOUSE', 'AXE-CORE', 'DATAFORSEO · AHREFS'];
const crawlTools = ['run_audit', 'quick_wins', 'monthly_report', 'technical_issues', 'striking_distance'];

const flightPath =
	'M180 540 C 220 470, 300 430, 380 440 S 520 520, 600 470 S 660 330, 760 300 S 840 360, 880 320 S 890 250, 905 230';
const photoPoints = [
	[380, 440],
	[600, 470],
	[760, 300],
];

// RGGB Bayer pattern, dimmed so it reads as raw sensor data
const bayer = [];
for (let y = 0; y < 480; y += 20) {
	for (let x = 0; x < 240; x += 20) {
		const r = (x / 20) % 2, c = (y / 20) % 2;
		const fill = r === 0 && c === 0 ? '#5a2320' : r === 1 && c === 1 ? '#1d2a4a' : '#1f3d27';
		bayer.push({ k: `${x}-${y}`, x, y, fill });
	}
}
</script>

<style scoped>
.pa {
	display: block;
	width: 100%;
	height: 100%;
}

.pa-mono {
	font-family: 'Geist Mono', ui-monospace, monospace;
	font-size: 22px;
	letter-spacing: 0.08em;
	fill: #e8eaec;
}

.pa-small {
	font-size: 17px;
}

.pa-display {
	font-family: 'Big Shoulders Display', 'Archivo', sans-serif;
	font-weight: 800;
	text-transform: uppercase;
	fill: #e8eaec;
}

.pa-muted {
	fill: #8b9097;
}

.pa-accent {
	fill: #ff5b1f;
}

.pa-box {
	fill: #111315;
	stroke: #2c3135;
	stroke-width: 2;
}

.pa-box--hot {
	stroke: #ff5b1f;
}

.pa-box--dim {
	stroke-dasharray: 6 6;
}

.pa-frame {
	fill: none;
	stroke: #2c3135;
	stroke-width: 2;
}

.pa-line {
	fill: none;
	stroke: #8b9097;
	stroke-width: 2;
}

.pa-line--hot {
	stroke: #ff5b1f;
}

.pa-grid path {
	stroke: #1a1d20;
	stroke-width: 1;
}

/* Data moving along the connectors */
.pa-flow {
	fill: none;
	stroke: #3a3f44;
	stroke-width: 2;
	stroke-dasharray: 6 10;
	animation: pa-flow 1.6s linear infinite;
}

.pa-flow--hot {
	stroke: #ff5b1f;
}

@keyframes pa-flow {
	to {
		stroke-dashoffset: -32;
	}
}

.pa-track-shadow {
	fill: none;
	stroke: rgba(255, 91, 31, 0.15);
	stroke-width: 10;
}

/* The track draws itself, holds, then redraws */
.pa-track {
	fill: none;
	stroke: #ff5b1f;
	stroke-width: 3;
	/* Longer than the path, so one dash covers it and the offset reveals it */
	stroke-dasharray: 1400;
	animation: pa-draw 6s ease-in-out infinite;
}

@keyframes pa-draw {
	0% {
		stroke-dashoffset: 1400;
	}
	55%,
	100% {
		stroke-dashoffset: 0;
	}
}

@media (prefers-reduced-motion: reduce) {
	.pa-flow,
	.pa-track {
		animation: none;
	}
}
</style>
