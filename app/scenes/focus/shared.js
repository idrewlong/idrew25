// Shared by the Focus artworks (ai.js, build.js, cloud.js). Each artwork is a
// factory: createX({ say, reduce }) returns its label, accessible name, hints
// and handlers. FocusVisual.vue owns the canvas, the loop and the call log.
//
//   draw(ctx, w, h, t)  paint one frame (t in ms)
//   move(x, y)          pointer over the canvas; returns the cursor to show
//   leave()             pointer left
//   tap(x, y)           click or tap
//   key(key)            keyboard; returns true when the key was used
//   blur()              keyboard focus left

export const ACCENT = '#ff5b1f';
export const TEXT = '#e8eaec';
export const MUTED = '#8b9097';
export const MONO = '10px "Geist Mono", ui-monospace, monospace';

// Deterministic pseudo-random, so layouts are the same every visit
export function seeded(seed) {
	return () => (seed = (seed * 16807) % 2147483647) / 2147483647;
}

// Move `from` toward `to` by a frame-rate independent fraction
export const ease = (from, to, dt, rate = 0.012) => from + (to - from) * (1 - Math.exp(-rate * dt));
