<template>
	<header class="py-4 px-2">
		<nav
			class="p-4 px-6 mx-auto max-w-7xl rounded-2xl md:flex md:justify-between md:items-center bg-white/90 backdrop-blur-md border border-stone-200 shadow-sm relative"
			aria-label="Main navigation"
		>
			<div class="flex items-center justify-between">
				<NuxtLink to="/" class="flex items-center" aria-label="Go to homepage">
					<img
						src="/public/images/IDLOGO.png"
						class="h-14 w-auto transition-transform duration-300 hover:scale-105"
						alt="iDrew Logo"
					/>
				</NuxtLink>

				<!-- Mobile menu button -->
				<button
					type="button"
					class="text-stone-500 focus:outline-none rounded md:hidden hover:text-stone-900 transition-colors duration-200"
					:aria-expanded="showMenu"
					aria-controls="main-navigation"
					@click="toggleNavbar"
				>
					<span class="sr-only">{{
						showMenu ? 'Close menu' : 'Open menu'
					}}</span>
					<Icon
						:name="showMenu ? 'heroicons:x-mark' : 'heroicons:bars-3'"
						class="w-7 h-7 transition-transform duration-300"
						:class="{ 'rotate-180': showMenu }"
						aria-hidden="true"
					/>
				</button>
			</div>

			<!-- Desktop Navigation -->
			<div
				id="main-navigation"
				class="hidden md:flex md:flex-row md:items-center md:gap-6 md:mt-0"
			>
				<NuxtLink
					v-for="link in navigationLinks"
					:key="link.to"
					:to="link.to"
					class="text-stone-500 text-sm tracking-wide transition-colors duration-300 hover:text-orange-500"
				>
					{{ link.label }}
				</NuxtLink>

				<div class="flex gap-5 items-center">
					<a
						v-for="social in socialLinks"
						:key="social.url"
						:href="social.url"
						target="_blank"
						rel="noopener noreferrer"
						class="text-stone-400"
					>
						<span class="sr-only">{{ social.label }}</span>
						<Icon
							:name="social.icon"
							class="w-5 h-5 transition-colors duration-300 hover:text-orange-500"
							aria-hidden="true"
						/>
					</a>
				</div>
			</div>

			<!-- Mobile Navigation with Transition -->
			<Transition
				enter-active-class="transition duration-300 ease-out"
				enter-from-class="transform -translate-y-4 opacity-0"
				enter-to-class="transform translate-y-0 opacity-100"
				leave-active-class="transition duration-200 ease-in"
				leave-from-class="transform translate-y-0 opacity-100"
				leave-to-class="transform -translate-y-4 opacity-0"
			>
				<div
					v-show="showMenu"
					class="absolute top-full left-0 right-0 bg-white mt-2 p-4 rounded-xl border border-stone-200 shadow-lg md:hidden z-50"
				>
					<div class="flex flex-col space-y-4">
						<NuxtLink
							v-for="link in navigationLinks"
							:key="link.to"
							:to="link.to"
							class="text-stone-500 text-sm transition-colors duration-300 hover:text-orange-500"
							@click="closeNavbar"
						>
							{{ link.label }}
						</NuxtLink>

						<div class="flex flex-col space-y-4">
							<a
								v-for="social in socialLinks"
								:key="social.url"
								:href="social.url"
								target="_blank"
								rel="noopener noreferrer"
								class="text-stone-400 flex items-center gap-2 hover:text-orange-500 transition-colors duration-300"
							>
								<Icon
									:name="social.icon"
									class="w-5 h-5"
									aria-hidden="true"
								/>
								<span class="text-sm">{{ social.label }}</span>
							</a>
						</div>
					</div>
				</div>
			</Transition>
		</nav>
	</header>
</template>

<script setup>
import { ref } from 'vue';

const showMenu = ref(false);

const navigationLinks = [
	// { to: '/blog', label: 'Blog' },
	{ to: '/contact', label: 'Contact' },
];

const socialLinks = [
	{
		url: 'https://github.com/idrewlong',
		icon: 'mdi:github',
		label: 'GitHub',
	},
	{
		url: 'https://www.linkedin.com/in/idrewlong/',
		icon: 'mdi:linkedin',
		label: 'LinkedIn',
	},
];

const toggleNavbar = () => (showMenu.value = !showMenu.value);
const closeNavbar = () => (showMenu.value = false);
</script>
