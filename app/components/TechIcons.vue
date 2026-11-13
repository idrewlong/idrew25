<template>
	<div
		ref="fieldRef"
		class="absolute inset-0 overflow-hidden pointer-events-none"
		@mousemove="onMouseMove"
		@mouseleave="onMouseLeave"
	>
		<div
			v-for="(icon, index) in techIcons"
			:key="icon.name"
			:ref="
				(el) => {
					if (el) iconEls[index] = el;
				}
			"
			class="magnetic-icon"
			:style="getInitialStyle(index)"
		>
			<div class="icon-inner">
				<Icon
					:name="icon.logo"
					class="tech-logo"
					:style="{ '--icon-scale': icon.scale ?? 1 }"
					aria-hidden="true"
				/>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { onPageLeft } from '~/composables/usePageLeave';

const { $gsap } = useNuxtApp();

const fieldRef = ref(null);
const iconEls = ref([]);

const mouse = { x: -9999, y: -9999 };
let isMouseInField = false;
let rafId = null;
let positions = [];
let fieldW = 0;
let fieldH = 0;
let mm = null;

// Add `scale` to an entry to size that logo up or down (1 = default,
// 1.2 = 20% bigger). Wide wordmark logos read smaller than square ones,
// so they're the usual candidates.
const techIcons = [
	{ logo: 'logos:react' },
	{ logo: 'logos:vue' },
	{ logo: 'logos:nuxt-icon', scale: 0.9 },
	{ logo: 'logos:typescript-icon' },
	{ logo: 'logos:tailwindcss-icon', scale: 0.9 },
	{ logo: 'logos:laravel' },
	{ logo: 'logos:python' },
	// { logo: 'logos:javascript' },

	{ logo: 'logos:go', scale: 0.9 },
	{ logo: 'logos:svelte-icon' },
	{ logo: 'logos:docker-icon' },
	{ logo: 'logos:php' },
	{ logo: 'logos:digital-ocean-icon' },
	{ logo: 'logos:postgresql' },
];

// Scattered home positions (percentages) — organic web pattern
const homePositions = [
	{ x: 10, y: 5 }, // React
	{ x: 42, y: 8 }, // Vue
	{ x: 74, y: 3 }, // Nuxt
	{ x: 76, y: 20 }, // TypeScript
	{ x: 24, y: 20 }, // Tailwind
	{ x: 56, y: 26 }, // Laravel (behind photo)
	{ x: 6, y: 36 }, // Python

	{ x: 68, y: 48 }, // Go (behind photo)
	{ x: 14, y: 58 }, // Svelte
	{ x: 84, y: 62 }, // Docker
	{ x: 48, y: 68 }, // PHP (behind photo)
	{ x: 78, y: 78 }, // Digital Ocean
	{ x: 8, y: 80 }, // PostgreSQL
];

const REPEL_RADIUS = 180;
const REPEL_STRENGTH = 60;
const RETURN_SPEED = 0.06;
const DRIFT_AMOUNT = 8;

const getInitialStyle = (index) => {
	const home = homePositions[index];
	return {
		left: `${home.x}%`,
		top: `${home.y}%`,
		opacity: 0,
	};
};

const onMouseMove = (e) => {
	if (!fieldRef.value) return;
	const rect = fieldRef.value.getBoundingClientRect();
	mouse.x = e.clientX - rect.left;
	mouse.y = e.clientY - rect.top;
	isMouseInField = true;
};

const onMouseLeave = () => {
	isMouseInField = false;
};

const animate = () => {
	if (!fieldRef.value) return;

	const w = fieldW;
	const h = fieldH;
	const time = Date.now() * 0.001;

	iconEls.value.forEach((el, i) => {
		if (!el || !positions[i]) return;
		const pos = positions[i];
		const home = homePositions[i];

		// Home position in pixels
		const homeX = (home.x / 100) * w;
		const homeY = (home.y / 100) * h;

		// Gentle idle drift
		const driftX = Math.sin(time * 0.4 + i * 1.7) * DRIFT_AMOUNT;
		const driftY = Math.cos(time * 0.3 + i * 2.1) * DRIFT_AMOUNT;

		let targetX = homeX + driftX;
		let targetY = homeY + driftY;

		// Magnetic repulsion from cursor
		if (isMouseInField) {
			const dx = targetX - mouse.x;
			const dy = targetY - mouse.y;
			const dist = Math.sqrt(dx * dx + dy * dy);

			if (dist < REPEL_RADIUS && dist > 0) {
				const force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH;
				const angle = Math.atan2(dy, dx);
				targetX += Math.cos(angle) * force;
				targetY += Math.sin(angle) * force;
			}
		}

		// Smooth interpolation toward target
		pos.x += (targetX - pos.x) * RETURN_SPEED;
		pos.y += (targetY - pos.y) * RETURN_SPEED;

		el.style.transform = `translate(${pos.x - homeX}px, ${pos.y - homeY}px)`;
	});

	rafId = requestAnimationFrame(animate);
};

onMounted(() => {
	nextTick(() => {
		const field = fieldRef.value;
		if (!field) return;

		mm = $gsap.matchMedia(field);
		mm.add(
			// matchMedia only runs the callback when a condition matches, so the
			// no-preference case needs its own entry
			{
				reduce: '(prefers-reduced-motion: reduce)',
				full: '(prefers-reduced-motion: no-preference)',
			},
			(ctx) => {
				const els = iconEls.value.filter(Boolean);

				// Reduced motion: final state, no entrance and no loop
				if (ctx.conditions.reduce) {
					$gsap.set(els, { opacity: 1, scale: 1 });
					return;
				}

				// Cache the field size; the loop runs every frame
				const measure = () => {
					fieldW = field.offsetWidth;
					fieldH = field.offsetHeight;
				};
				measure();
				positions = homePositions.map((home) => ({
					x: (home.x / 100) * fieldW,
					y: (home.y / 100) * fieldH,
				}));

				// Entrance: icons fade and scale in with stagger
				els.forEach((el, i) => {
					$gsap.set(el, { opacity: 0, scale: 0.4 });
					$gsap.to(el, {
						opacity: 1,
						scale: 1,
						duration: 0.8,
						delay: 0.6 + i * 0.07,
						ease: 'back.out(1.6)',
					});
				});

				// The loop only runs while the field is on screen
				let visible = false;
				const ro = new ResizeObserver(measure);
				ro.observe(field);
				const io = new IntersectionObserver(([entry]) => {
					visible = entry.isIntersecting;
					if (visible && !rafId) rafId = requestAnimationFrame(animate);
					else if (!visible && rafId) {
						cancelAnimationFrame(rafId);
						rafId = null;
					}
				});
				io.observe(field);

				return () => {
					io.disconnect();
					ro.disconnect();
					if (rafId) cancelAnimationFrame(rafId);
					rafId = null;
				};
			}
		);
	});
});

onPageLeft(() => {
	if (rafId) cancelAnimationFrame(rafId);
	rafId = null;
	mm?.revert();
	mm = null;
});
</script>

<style scoped>
.magnetic-icon {
	position: absolute;
	z-index: 5;
	cursor: default;
	will-change: transform;
	display: flex;
	flex-direction: column;
	align-items: center;
	transform: translate(-50%, -50%);
	transition: none;
}

.icon-inner {
	width: 52px;
	height: 52px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 6px;
	/* Light tiles keep every logo legible, including the dark ones */
	background: rgba(236, 237, 238, 0.94);
	border: 1px solid rgba(255, 255, 255, 0.6);
	backdrop-filter: blur(8px);
	-webkit-backdrop-filter: blur(8px);
	/* Lift the cards off the photo plate so they stay legible
	   where they overlap it */
	box-shadow:
		0 10px 24px -10px rgba(0, 0, 0, 0.7),
		0 2px 6px -2px rgba(0, 0, 0, 0.4);
	transition:
		border-color 0.2s ease,
		box-shadow 0.2s ease,
		background 0.2s ease;
}

/* @nuxt/icon's own .iconify rule sizes logos at 1em, which beats Tailwind's
   w-/h- utilities, so size them through font-size here instead. */
.icon-inner :deep(.tech-logo) {
	font-size: calc(28px * var(--icon-scale, 1));
}

@media (max-width: 767px) {
	.magnetic-icon {
		pointer-events: none;
	}
	.icon-inner {
		width: 40px;
		height: 40px;
		border-radius: 5px;
	}
	.icon-inner :deep(.tech-logo) {
		font-size: calc(20px * var(--icon-scale, 1));
	}
}
</style>
