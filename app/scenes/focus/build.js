import { ACCENT, TEXT, MUTED, MONO, ease } from './shared';

// Fig. 02: the four layers of an app, data to edge, with the tools I use on
// each (all from the Skills section). Pointing at the stack pulls it apart
// and lights the layer under the pointer; left alone, it walks the layers.
const LAYERS = [
	{ name: 'Data', tools: 'PostgreSQL · Redis · SQLite' },
	{ name: 'API', tools: 'Laravel · Node.js · GraphQL' },
	{ name: 'UI', tools: 'Nuxt · React · React Native' },
	{ name: 'Edge', tools: 'Vercel · AWS · Cloudflare' },
]; // bottom to top

const IDLE_MS = 3000; // after the last interaction, the stack runs itself again
const STEP_MS = 1800; // how long each layer stays lit while idle

export function createBuild({ say, reduce }) {
	const layers = LAYERS.map((l) => ({ ...l, y: 0, lit: 0 }));
	let active = -1;
	let explode = reduce ? 0.6 : 0.25;
	let pointing = false;
	let lastUser = -Infinity;
	let nextStep = 800;
	let lastT = 0;

	function select(i, user) {
		if (i === active) return;
		active = i;
		say(`${layers[i].name} · ${layers[i].tools}`, user);
	}

	function layerAt(y) {
		let best = 0;
		layers.forEach((l, i) => {
			if (Math.abs(l.y - y) < Math.abs(layers[best].y - y)) best = i;
		});
		return best;
	}

	function draw(ctx, w, h, t) {
		const dt = lastT ? Math.min(t - lastT, 50) : 16;
		lastT = t;
		const idle = t - lastUser > IDLE_MS && !pointing;

		if (!reduce && idle && t > nextStep) {
			select((active + 1) % layers.length, false);
			nextStep = t + STEP_MS;
		}

		// Pulled apart while someone is pointing at it, nearly closed otherwise
		const target = reduce ? 0.6 : pointing || !idle ? 1 : 0.25;
		explode = reduce ? target : ease(explode, target, dt, 0.006);

		// Space between the call log (top) and the caption (bottom)
		const top = 36, bottom = h - 30;
		const avail = bottom - top;
		const narrow = w < 520;
		const size = Math.min(w * (narrow ? 0.27 : 0.3), avail * 0.4);
		const gap = size * 0.3 + ((avail - size) / 3 - size * 0.3) * explode;
		const span = gap * 3;
		const cx = w / 2 + (narrow ? 14 : 0);
		const base = top + (avail + span) / 2; // bottom plate's centre
		const n = 9;

		ctx.lineWidth = 1;
		ctx.font = MONO;
		ctx.textBaseline = 'middle';

		// Risers between the plates' side corners
		ctx.strokeStyle = 'rgba(139,144,151,0.25)';
		[-size, size].forEach((dx) => {
			ctx.beginPath();
			ctx.moveTo(cx + dx, base - span);
			ctx.lineTo(cx + dx, base);
			ctx.stroke();
		});

		// Bottom plate first, so upper plates draw over it
		layers.forEach((layer, L) => {
			const cy = (layer.y = base - L * gap);
			layer.lit = reduce ? (L === active ? 1 : 0) : ease(layer.lit, L === active ? 1 : 0, dt, 0.01);
			const lit = layer.lit;

			// Plate: a filled diamond so the plate above hides what's behind it
			ctx.beginPath();
			ctx.moveTo(cx, cy - size * 0.5);
			ctx.lineTo(cx + size, cy);
			ctx.lineTo(cx, cy + size * 0.5);
			ctx.lineTo(cx - size, cy);
			ctx.closePath();
			ctx.fillStyle = `rgba(10,11,12,${0.75 + lit * 0.2})`;
			ctx.fill();
			ctx.strokeStyle = lit > 0.05 ? `rgba(255,91,31,${0.3 + lit * 0.7})` : 'rgba(139,144,151,0.35)';
			ctx.stroke();

			for (let i = 1; i < n; i++) {
				for (let j = 1; j < n; j++) {
					const u = i / n, v = j / n;
					const x = cx + (u - v) * size;
					const y = cy + (u + v - 1) * size * 0.5;
					ctx.fillStyle =
						lit > 0.3 && (i + j + L) % 3 === 0 ? ACCENT : `rgba(232,234,236,${0.16 + lit * 0.5})`;
					ctx.fillRect(x - 1, y - 1, 2, 2);
				}
			}

			// Label off the left corner
			ctx.textAlign = 'right';
			ctx.fillStyle = lit > 0.3 ? TEXT : MUTED;
			ctx.fillText(`0${L + 1} ${layer.name.toUpperCase()}`, cx - size - 10, cy);
		});
	}

	function aim(y, user) {
		lastUser = performance.now();
		select(layerAt(y), user);
	}

	return {
		label: 'fig. 02 · data → edge',
		ariaLabel: 'Demo: the four layers of an app I build, data to edge. Arrow keys move between layers.',
		hint: { mouse: 'Point at a layer', touch: 'Tap a layer' },
		draw,
		move(x, y) {
			pointing = true;
			aim(y, true);
			return 'crosshair';
		},
		leave() {
			pointing = false;
			lastUser = performance.now();
		},
		tap(x, y) {
			aim(y, true);
		},
		key(key) {
			const step = key === 'ArrowUp' || key === 'ArrowRight' ? 1 : key === 'ArrowDown' || key === 'ArrowLeft' ? -1 : 0;
			if (!step) return false;
			lastUser = performance.now();
			select((Math.max(active, 0) + step + layers.length) % layers.length, true);
			return true;
		},
		blur() {},
	};
}
