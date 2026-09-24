<template>
	<header class="site-header" :class="{ 'is-scrolled': isScrolled }">
		<div class="header-inner">
			<!-- Brand -->
			<NuxtLink to="/" class="brand" aria-label="Go to homepage">
				<img
					src="/images/IDLOGO.webp"
					class="brand-logo"
					alt="iDrew"
				/>
			</NuxtLink>

			<!-- Desktop Navigation -->
			<nav class="desktop-nav" aria-label="Main navigation">
				<NuxtLink
					v-for="link in navigationLinks"
					:key="link.to"
					:to="link.to"
					class="nav-item"
					active-class="nav-item--active"
				>
					{{ link.label }}
				</NuxtLink>

				<a
					v-for="social in socialLinks"
					:key="social.url"
					:href="social.url"
					target="_blank"
					rel="noopener noreferrer"
					class="icon-item"
					:aria-label="social.label"
				>
					<Icon :name="social.icon" class="w-4 h-4" :aria-hidden="true" />
				</a>

				<div class="nav-divider" aria-hidden="true" />

				<NuxtLink to="/contact" class="header-cta">
					<span class="header-cta-label">Contact</span>
					<Icon
						name="heroicons:arrow-up-right-20-solid"
						class="header-cta-icon"
						:aria-hidden="true"
					/>
				</NuxtLink>
			</nav>

			<!-- Mobile: contact CTA + menu toggle -->
			<div class="mobile-actions">
				<NuxtLink to="/contact" class="header-cta header-cta--compact">
					<span class="header-cta-label">Contact</span>
					<Icon
						name="heroicons:arrow-up-right-20-solid"
						class="header-cta-icon"
						:aria-hidden="true"
					/>
				</NuxtLink>

				<button
					ref="toggleEl"
					type="button"
					class="menu-toggle"
					:class="{ 'is-open': menuOpen }"
					:aria-expanded="menuOpen"
					aria-controls="mobile-menu"
					:aria-label="menuOpen ? 'Close menu' : 'Open menu'"
					@click="menuOpen = !menuOpen"
				>
					<span class="menu-toggle-line" aria-hidden="true" />
					<span class="menu-toggle-line" aria-hidden="true" />
				</button>
			</div>
		</div>

		<!-- Mobile menu panel -->
		<Transition name="menu-backdrop">
			<div
				v-if="menuOpen"
				class="mobile-menu-backdrop"
				aria-hidden="true"
				@click="menuOpen = false"
			/>
		</Transition>

		<Transition name="menu-panel">
			<nav
				v-if="menuOpen"
				id="mobile-menu"
				class="mobile-menu"
				aria-label="Mobile navigation"
			>
				<NuxtLink
					to="/"
					class="mobile-menu-link"
					exact-active-class="mobile-menu-link--active"
				>
					<span class="mobile-menu-index">00</span>
					Home
				</NuxtLink>
				<NuxtLink
					v-for="(link, idx) in navigationLinks"
					:key="link.to"
					:to="link.to"
					class="mobile-menu-link"
					active-class="mobile-menu-link--active"
				>
					<span class="mobile-menu-index">{{
						String(idx + 1).padStart(2, '0')
					}}</span>
					{{ link.label }}
				</NuxtLink>

				<div class="mobile-menu-meta">
					<a :href="`mailto:${contactEmail}`" class="mobile-menu-email">
						{{ contactEmail }}
					</a>
					<div class="mobile-menu-socials">
						<a
							v-for="social in socialLinks"
							:key="social.url"
							:href="social.url"
							target="_blank"
							rel="noopener noreferrer"
							class="icon-item"
							:aria-label="social.label"
						>
							<Icon :name="social.icon" class="w-5 h-5" :aria-hidden="true" />
						</a>
					</div>
				</div>
			</nav>
		</Transition>
	</header>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';

const isScrolled = ref(false);
const menuOpen = ref(false);
const toggleEl = ref(null);
const route = useRoute();

// Close the menu once a link has navigated
watch(
	() => route.fullPath,
	() => {
		menuOpen.value = false;
	}
);

const handleScroll = () => {
	isScrolled.value = window.scrollY > 8;
};

const handleKeydown = (e) => {
	if (e.key === 'Escape' && menuOpen.value) {
		menuOpen.value = false;
		toggleEl.value?.focus();
	}
};

// Menu is mobile-only; close it if the viewport grows past md
let mdQuery;
const handleBreakpoint = (e) => {
	if (e.matches) menuOpen.value = false;
};

onMounted(() => {
	window.addEventListener('scroll', handleScroll, { passive: true });
	window.addEventListener('keydown', handleKeydown);
	mdQuery = window.matchMedia('(min-width: 768px)');
	mdQuery.addEventListener('change', handleBreakpoint);
});

onUnmounted(() => {
	window.removeEventListener('scroll', handleScroll);
	window.removeEventListener('keydown', handleKeydown);
	mdQuery?.removeEventListener('change', handleBreakpoint);
});
</script>

<style scoped>
.site-header {
	position: sticky;
	top: 0;
	z-index: 50;
	background: rgba(247, 246, 243, 0.82);
	backdrop-filter: blur(16px) saturate(1.4);
	-webkit-backdrop-filter: blur(16px) saturate(1.4);
	border-bottom: 1px solid transparent;
	transition:
		border-color 0.2s ease,
		box-shadow 0.2s ease;
}

.site-header.is-scrolled {
	border-bottom-color: var(--border);
	box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.03);
}

.header-inner {
	max-width: 72rem;
	margin: 0 auto;
	padding: 0 1rem;
	height: 56px;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

@media (min-width: 480px) {
	.header-inner {
		padding: 0 1.5rem;
		height: 64px;
	}
}

/* Brand */
.brand {
	display: flex;
	align-items: center;
	flex-shrink: 0;
}

.brand-logo {
	height: 2.75rem;
	width: auto;
	transition: opacity 0.15s ease;
}

.brand:hover .brand-logo {
	opacity: 0.65;
}

/* Desktop nav — hidden on mobile, shown on md+ */
.desktop-nav {
	display: none;
	align-items: center;
	gap: 2px;
}

/* Mobile actions — shown on mobile, hidden on md+ */
.mobile-actions {
	display: flex;
	align-items: center;
	gap: 8px;
}

@media (min-width: 768px) {
	.desktop-nav {
		display: flex;
	}

	.mobile-actions {
		display: none;
	}

	.brand-logo {
		height: 3.75rem;
	}
}

.nav-item {
	display: inline-flex;
	align-items: center;
	padding: 6px 12px;
	border-radius: 6px;
	font-size: 0.9375rem;
	font-family: inherit;
	color: var(--text-muted);
	text-decoration: none;
	letter-spacing: 0.01em;
	transition:
		background 0.12s ease,
		color 0.12s ease;
}

.nav-item:hover,
.nav-item--active {
	background: rgba(0, 0, 0, 0.05);
	color: var(--text);
}

/* Contact CTA — same swipe-fill button language as the hero and footer CTA */
.header-cta {
	position: relative;
	display: inline-flex;
	align-items: center;
	gap: 0.65rem;
	padding: 8px 14px;
	overflow: hidden;
	background: var(--bg);
	border: 1px solid #d6d3d1;
	color: var(--text);
	text-decoration: none;
	flex-shrink: 0;
	transition:
		color 0.25s ease,
		border-color 0.25s ease;
}

.header-cta:hover,
.header-cta:focus-visible {
	color: #fafaf9;
	border-color: var(--accent);
}

.header-cta::before {
	content: '';
	position: absolute;
	inset: 0;
	background: var(--accent);
	transform: scaleX(0);
	transform-origin: left center;
	transition: transform 0.4s cubic-bezier(0.65, 0, 0.35, 1);
	z-index: 0;
}

.header-cta:hover::before,
.header-cta:focus-visible::before {
	transform: scaleX(1);
}

.header-cta > * {
	position: relative;
	z-index: 1;
}

.header-cta-label {
	font-family: 'Geist Mono', monospace;
	font-size: 10px;
	letter-spacing: 0.25em;
	text-transform: uppercase;
	line-height: 1;
}

.header-cta-icon {
	width: 0.875rem;
	height: 0.875rem;
	transition: transform 0.2s ease;
}

.header-cta:hover .header-cta-icon,
.header-cta:focus-visible .header-cta-icon {
	transform: translate(1px, -1px);
}

.header-cta--compact {
	gap: 0.5rem;
	padding: 7px 11px;
}

.header-cta--compact .header-cta-label {
	font-size: 9px;
	letter-spacing: 0.2em;
}

.header-cta--compact .header-cta-icon {
	width: 0.75rem;
	height: 0.75rem;
}

@media (prefers-reduced-motion: reduce) {
	.header-cta,
	.header-cta::before,
	.header-cta-icon {
		transition: none;
	}
}

.nav-divider {
	width: 1px;
	height: 18px;
	background: var(--border);
	margin: 0 10px;
	flex-shrink: 0;
}

.icon-item {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 34px;
	height: 34px;
	border-radius: 6px;
	color: var(--text-muted);
	transition:
		background 0.12s ease,
		color 0.12s ease;
}

.icon-item:hover {
	background: rgba(0, 0, 0, 0.05);
	color: var(--text);
}

/* ── Mobile menu toggle: hamburger ↔ X ──
   Lines slide to center, then rotate (open); un-rotate, then slide apart (close). */
.menu-toggle {
	position: relative;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 36px;
	height: 36px;
	border: 1px solid #d6d3d1;
	background: var(--bg);
	color: var(--text);
	cursor: pointer;
	flex-shrink: 0;
}

.menu-toggle:focus-visible {
	outline: 2px solid var(--accent);
	outline-offset: 2px;
}

.menu-toggle-line {
	position: absolute;
	left: 50%;
	top: 50%;
	width: 16px;
	height: 1.5px;
	margin: -0.75px 0 0 -8px;
	background: currentColor;
	transition:
		translate 0.2s cubic-bezier(0.65, 0, 0.35, 1) 0.2s,
		rotate 0.2s cubic-bezier(0.65, 0, 0.35, 1) 0s;
}

.menu-toggle-line:first-child {
	translate: 0 -3.5px;
}

.menu-toggle-line:last-child {
	translate: 0 3.5px;
}

.menu-toggle.is-open .menu-toggle-line {
	translate: 0 0;
	transition:
		translate 0.2s cubic-bezier(0.65, 0, 0.35, 1) 0s,
		rotate 0.2s cubic-bezier(0.65, 0, 0.35, 1) 0.2s;
}

.menu-toggle.is-open .menu-toggle-line:first-child {
	rotate: 45deg;
}

.menu-toggle.is-open .menu-toggle-line:last-child {
	rotate: -45deg;
}

/* ── Mobile menu panel ── */
.mobile-menu-backdrop {
	position: absolute;
	top: 100%;
	left: 0;
	right: 0;
	height: 100vh;
	background: rgba(28, 25, 23, 0.2);
}

.mobile-menu {
	position: absolute;
	top: 100%;
	left: 0;
	right: 0;
	display: flex;
	flex-direction: column;
	padding: 0.5rem 1rem 1.25rem;
	background: var(--bg);
	border-bottom: 1px solid var(--border);
	box-shadow: 0 12px 24px -12px rgba(0, 0, 0, 0.12);
}

@media (min-width: 480px) {
	.mobile-menu {
		padding-inline: 1.5rem;
	}
}

@media (min-width: 768px) {
	.mobile-menu,
	.mobile-menu-backdrop {
		display: none;
	}
}

.mobile-menu-link {
	display: flex;
	align-items: baseline;
	gap: 0.875rem;
	padding: 0.625rem 0;
	border-bottom: 1px solid var(--border);
	font-family: 'Instrument Serif', Georgia, serif;
	font-style: italic;
	font-size: 2rem;
	line-height: 1.1;
	letter-spacing: -0.02em;
	color: var(--text);
	text-decoration: none;
	transition: color 0.15s ease;
}

.mobile-menu-link:hover,
.mobile-menu-link--active {
	color: var(--accent);
}

.mobile-menu-index {
	font-family: 'Geist Mono', monospace;
	font-style: normal;
	font-size: 10px;
	letter-spacing: 0.15em;
	color: var(--text-muted);
}

.mobile-menu-meta {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	padding-top: 1rem;
}

.mobile-menu-email {
	font-family: 'Geist Mono', monospace;
	font-size: 11px;
	letter-spacing: 0.08em;
	color: var(--text-muted);
	text-decoration: none;
	overflow-wrap: anywhere;
}

.mobile-menu-email:hover {
	color: var(--accent);
}

.mobile-menu-socials {
	display: flex;
	gap: 4px;
}

.menu-panel-enter-active,
.menu-panel-leave-active {
	transition:
		opacity 0.25s ease,
		transform 0.3s cubic-bezier(0.65, 0, 0.35, 1);
}

.menu-panel-enter-from,
.menu-panel-leave-to {
	opacity: 0;
	transform: translateY(-8px);
}

.menu-backdrop-enter-active,
.menu-backdrop-leave-active {
	transition: opacity 0.25s ease;
}

.menu-backdrop-enter-from,
.menu-backdrop-leave-to {
	opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
	.menu-toggle-line,
	.menu-toggle.is-open .menu-toggle-line,
	.menu-panel-enter-active,
	.menu-panel-leave-active,
	.menu-backdrop-enter-active,
	.menu-backdrop-leave-active {
		transition: none;
	}
}

</style>
