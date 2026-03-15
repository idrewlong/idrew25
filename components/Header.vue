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

				<div class="nav-divider" aria-hidden="true" />

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
			</nav>

			<!-- Mobile Toggle -->
			<button
				type="button"
				class="mobile-toggle"
				:aria-expanded="showMenu"
				aria-controls="mobile-nav"
				@click="toggleNavbar"
			>
				<span class="sr-only">{{
					showMenu ? 'Close menu' : 'Open menu'
				}}</span>
				<Icon
					:name="showMenu ? 'heroicons:x-mark' : 'heroicons:bars-3'"
					class="w-5 h-5"
					aria-hidden="true"
				/>
			</button>
		</div>

		<!-- Mobile Navigation -->
		<Transition
			enter-active-class="transition-all duration-200 ease-out"
			enter-from-class="opacity-0 -translate-y-1"
			enter-to-class="opacity-100 translate-y-0"
			leave-active-class="transition-all duration-150 ease-in"
			leave-from-class="opacity-100 translate-y-0"
			leave-to-class="opacity-0 -translate-y-1"
		>
			<div v-show="showMenu" id="mobile-nav" class="mobile-nav">
				<NuxtLink
					v-for="link in navigationLinks"
					:key="link.to"
					:to="link.to"
					class="mobile-nav-item"
					@click="closeNavbar"
				>
					{{ link.label }}
				</NuxtLink>

				<div class="mobile-divider" />

				<div class="mobile-socials">
					<a
						v-for="social in socialLinks"
						:key="social.url"
						:href="social.url"
						target="_blank"
						rel="noopener noreferrer"
						class="mobile-social-item"
					>
						<Icon :name="social.icon" class="w-4 h-4" aria-hidden="true" />
						<span>{{ social.label }}</span>
					</a>
				</div>
			</div>
		</Transition>
	</header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const showMenu = ref(false);
const isScrolled = ref(false);

const navigationLinks = [
	// { to: '/blog', label: 'Blog' },
	{ to: '/contact', label: 'Contact' },
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

const toggleNavbar = () => (showMenu.value = !showMenu.value);
const closeNavbar = () => (showMenu.value = false);

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

/* Mobile toggle — shown on mobile, hidden on md+ */
.mobile-toggle {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 36px;
	height: 36px;
	border-radius: 6px;
	color: var(--text-muted);
	background: transparent;
	border: none;
	cursor: pointer;
	transition:
		background 0.12s ease,
		color 0.12s ease;
}

.mobile-toggle:hover {
	background: rgba(0, 0, 0, 0.05);
	color: var(--text);
}

@media (min-width: 768px) {
	.desktop-nav {
		display: flex;
	}

	.mobile-toggle {
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

/* Mobile nav */
.mobile-nav {
	border-top: 1px solid var(--border);
	background: rgba(247, 246, 243, 0.98);
	padding: 6px 0 10px;
}

.mobile-nav-item {
	display: block;
	padding: 8px 24px;
	font-size: 0.9375rem;
	font-family: inherit;
	color: var(--text-muted);
	text-decoration: none;
	transition:
		background 0.12s ease,
		color 0.12s ease;
}

.mobile-nav-item:hover {
	background: rgba(0, 0, 0, 0.04);
	color: var(--text);
}

.mobile-divider {
	height: 1px;
	background: var(--border);
	margin: 6px 24px;
}

.mobile-socials {
	display: flex;
	flex-direction: column;
}

.mobile-social-item {
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 8px 24px;
	font-size: 0.9375rem;
	font-family: inherit;
	color: var(--text-muted);
	text-decoration: none;
	transition:
		background 0.12s ease,
		color 0.12s ease;
}

.mobile-social-item:hover {
	background: rgba(0, 0, 0, 0.04);
	color: var(--text);
}
</style>
