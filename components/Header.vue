<template>
	<header class="py-4 px-2">
		<nav
			class="p-4 px-6 mx-auto max-w-7xl rounded-3xl md:flex md:justify-between md:items-center shadow-xl bg-white"
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
					class="text-gray-900 focus:outline-none rounded md:hidden"
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
					class="text-gray-500 transition-colors duration-300 hover:text-orange-400"
				>
					{{ link.label }}
				</NuxtLink>

				<div class="flex gap-6 items-center">
					<a
						v-for="social in socialLinks"
						:key="social.url"
						:href="social.url"
						target="_blank"
						rel="noopener noreferrer"
						class="text-gray-500"
					>
						<span class="sr-only">{{ social.label }}</span>
						<Icon
							:name="social.icon"
							class="w-6 h-6 transition-colors duration-300 hover:text-orange-400"
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
				<div v-show="showMenu" class="flex flex-col mt-8 space-y-4 md:hidden">
					<NuxtLink
						v-for="link in navigationLinks"
						:key="link.to"
						:to="link.to"
						class="text-gray-500 transition-colors duration-300 hover:text-orange-400"
						@click="closeNavbar"
					>
						{{ link.label }}
					</NuxtLink>

					<div class="flex space-x-4 items-center">
						<a
							v-for="social in socialLinks"
							:key="social.url"
							:href="social.url"
							target="_blank"
							rel="noopener noreferrer"
							class="text-gray-500"
						>
							<span class="sr-only">{{ social.label }}</span>
							<Icon
								:name="social.icon"
								class="w-6 h-6 transition-colors duration-300 hover:text-orange-400"
								aria-hidden="true"
							/>
						</a>
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
		url: 'https://github.com/Code-Oxford',
		icon: 'mdi:github',
		label: 'GitHub',
	},
	{
		url: 'https://discord.com/invite/FrEnAhpReY',
		icon: 'mdi:linkedin',
		label: 'LinkedIn',
	},
];

const toggleNavbar = () => (showMenu.value = !showMenu.value);
const closeNavbar = () => (showMenu.value = false);
</script>
