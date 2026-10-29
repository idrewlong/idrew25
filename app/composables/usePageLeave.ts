import { onBeforeUnmount } from 'vue';

/**
 * Vue unmounts the old page at the start of its fade-out, so cleanup in
 * onBeforeUnmount (mm.revert(), disposing a scene) would empty the page
 * while it's still on screen: reveals snap back to hidden and pins collapse.
 *
 * app.vue marks the leave in the page transition's hooks. Cleanup registered
 * here waits for the fade to finish; anything unmounted outside a page change
 * cleans up straight away.
 */
let leaving = false;
let pending: (() => void)[] = [];

export function startPageLeave() {
	leaving = true;
}

export function finishPageLeave() {
	leaving = false;
	const queued = pending;
	pending = [];
	queued.forEach((fn) => fn());
}

export function onPageLeft(fn: () => void) {
	onBeforeUnmount(() => {
		// beforeUnmount runs just before the transition's onBeforeLeave, so
		// check one microtask later, once the leave has been marked
		queueMicrotask(() => (leaving ? pending.push(fn) : fn()));
	});
}
