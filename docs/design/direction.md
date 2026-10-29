# Design direction: idrewlong.com (newdesign branch)

Subject / audience / primary job: a senior full stack developer's portfolio, read by recruiters and hiring managers, including defense and gov-tech teams. Job: show role, range and proof fast, then get a message sent.

Direction: a defense-tech spec sheet with American-optimism launch imagery. Dark, sparse, condensed uppercase type in solid and outline, hairline grid, mono readouts, ASCII-rendered 3D. References: Anduril, Shield AI, christendijoux.com.

Palette (tokens in `app/assets/css/main.css`):
- ink / bg `#0A0B0C`
- surface `#111315`
- elevated `#171A1D`
- line `#24282C`
- text `#ECEDEE`
- muted `#8B9097`
- accent (signal orange, from the iD logo) `#FF5B1F`, used for state and one word at a time, never fills

Type:
- Display: Big Shoulders Display 800/900, uppercase, line-height 0.85; `.outline` for the stroked variant
- Body: Archivo 400
- Readouts and labels: Geist Mono 400, uppercase, wide tracking
- Preloader uses the display face too (no serif left on the home page)

Layout: full-bleed dark page on a faint 4-column hairline grid. Sections open with a giant uppercase word and a mono readout row (`SEC/02 · WORK · 15 ENTRIES`). Content sits on hairlines, not cards.

```
ANDREW LONG ▪ PORTFOLIO          WORK  BLOG  PROCESS  [CONTACT ↗]
────────────────────────────────────────────────────────────────
SENIOR FULL STACK DEV            ┌ ─              ─ ┐
I BUILD                                photo +
RELIABLE                            floating icons
TOOLS_                           └ ─              ─ ┘
Go by choice. TypeScript…        30.35°N 89.15°W · LONG BEACH, MS
[GET IN TOUCH ↗] [SEE WORK ↓]
────────────────────────────────────────────────────────────────
ABOUT                                   ███ giant word ███
statement line                  │ CURRENTLY
two short paragraphs            │ facts
```

Alignment: left-aligned throughout. Nothing centered except the preloader.

Width: every home section uses `.wrap` (main.css): full width with 16 / 24 / 40px gutters at 0 / 480 / 976px, capped at 1600px. Header and hero use the same gutters and cap so all left edges line up. Prose stays at a readable measure (bios `max-w-xl`, experience bullets 75ch); grids spread (Stack goes to 5 columns at 1440px).

The one memorable thing: the launch sequence (`LaunchSequence.vue` + `app/scenes/RocketScene.ts`), rendered through the ASCII shader. A pinned scroll section (420% of the viewport) plays a Falcon 9-style mission: pad with lattice tower and swing arm, ignition smoke, ascent as the stars brighten and Earth's limb rises, first-stage separation, second-stage burn, fairing separation, and a satellite deploying its panels. Stages map to Plan (pad) / Build (ascent and staging) / Ship (fairing sep and deploy); telemetry is decorative and derived from scroll. Every transform is a pure function of progress, so scrubbing back reverses it. Lazy-loads three near the viewport, pauses offscreen, holds one still frame under reduced motion, and falls back to a hand-drawn ASCII rocket without WebGL.

Hero: full-bleed dot-matrix Earth (`app/scenes/GlobeScene.ts`, rendered without the ASCII pass). Land comes from a 720x360 Natural Earth 1:50m mask baked into `app/scenes/landMask.ts` (public domain, generated with world-atlas + a scanline rasteriser); lit land dots, faint ocean dots, back-face atmosphere glow, a pulsing orange marker on Long Beach, MS, and live satellites: ISS, Hubble, Landsat 9 and NOAA-21 at true lat/lon/altitude with full closed orbit rings (one period, Earth rotation frozen at refresh, rebuilt every 10 s) and labels (ISS only on phones), plus a 36-satellite Starlink sample as dots. Data: `server/api/satellites.get.ts` pulls CelesTrak TLEs (cached 2 h, CDN `swr` 2 h, matching CelesTrak's update cadence); positions via satellite.js SGP4 in `app/scenes/orbits.ts`. Decorative orbits remain only if the data fails to load; info rail with live CT clock; headline bottom-left, brief panel bottom-right. Both scenes share `app/scenes/AsciiStage.ts` (renderer, ASCII pass, loop, dispose).

The globe is draggable (pointer drag rotates, tilt clamped to ±1.2 rad, inertia on release, auto-spin resumes after 3 s idle; `touch-action: pan-y` keeps vertical page scroll on phones). The hero text layer is `pointer-events: none` with links, buttons, the panel and the rail opted back in.

Experience: desktop is a two-pane service record (vertical WAI-ARIA tabs: role list left, detail right with stat tiles and focus tags); below 976px it's an accordion with the newest role open. Stats and tags only restate numbers and tools from that role's own bullets (`ExperienceDetail.vue`).

Supporting: About holds the photo in a reticle frame with the floating tech icons (sticky on desktop); PLAN / BUILD / SHIP / LAUNCH word ticker (solid and outline); hairline frame around the viewport on desktop.

Rejected defaults:
- Cream + Instrument Serif italic + orange accent (the old site; reads as a generic editorial template)
- Rounded white cards with soft shadows for every list
- An entrance animation on every section; reveals use one shared batch helper instead

Tried before: Archivo heavy grotesk on this branch (too close to a generic dark SaaS look; swapped for condensed Big Shoulders). Editorial magazine (cream, serif italic, masthead rail) on the previous version of this site.
