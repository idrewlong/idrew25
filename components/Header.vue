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
					<Icon :name="social.icon" class="w-4 h-4" aria-hidden="true" />
				</a>

				<div class="nav-divider" aria-hidden="true" />

				<NuxtLink to="/contact" class="header-cta">
					<span class="header-cta-label">Contact</span>
					<Icon
						name="heroicons:arrow-up-right-20-solid"
						class="header-cta-icon"
						aria-hidden="true"
					/>
				</NuxtLink>
			</nav>

			<!-- Mobile: just the contact CTA — socials live on the contact page -->
			<div class="mobile-actions">
				<NuxtLink to="/contact" class="header-cta header-cta--compact">
					<span class="header-cta-label">Contact</span>
					<Icon
						name="heroicons:arrow-up-right-20-solid"
						class="header-cta-icon"
						aria-hidden="true"
					/>
				</NuxtLink>
			</div>
		</div>
	</header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const isScrolled = ref(false);

// Contact lives in its own CTA button, not in this list.
const navigationLinks = [
	// { to: '/blog', label: 'Blog' },
];

const socialLinks = [
	{
		url: 'https://github.com/idrewlong',
		icon: 'ph:github-logo-fill',
		label: 'GitHub',
	},
	{
		url: 'https://www.linkedin.com/in/idrewlong/',
		icon: 'ph:linkedin-logo-fill',
		label: 'LinkedIn',
	},
];

const handleScroll = () => {
	isScrolled.value = window.scrollY > 8;
};

onMounted(() => {
	window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
	window.removeEventListener('scroll', handleScroll);
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

</style>
