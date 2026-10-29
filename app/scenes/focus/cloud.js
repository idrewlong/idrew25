import { ACCENT, TEXT, MONO, seeded } from './shared';

// Fig. 03: a perimeter scan. Open gaps (orange) close as the sweep passes
// over them. The sweep follows the pointer, turns to a tap, or steps with the
// arrow keys; left alone it turns by itself, and once every gap is closed
// they reopen so the loop can run again. Demo data: no real findings.
const GAPS = 7;
const RESET_MS = 2600; // pause on "all clear" before the gaps reopen

const TAU = Math.PI * 2;
// Signed shortest turn from a to b, in (-π, π]
const turn = (a, b) => ((((b - a) % TAU) + TAU + Math.PI) % TAU) - Math.PI;

export function createCloud({ say, reduce }) {
	const rand = seeded(11);
	const field = Array.from({ length: 220 }, () => ({ a: rand() * TAU, r: Math.sqrt(rand()) }));
	// Gaps spread around the dial, away from the centre
	const gaps = Array.from({ length: GAPS }, (_, i) => ({
		id: String(i + 1).padStart(2, '0'),
		a: (i / GAPS) * TAU + rand() * 0.6,
		r: 0.35 + rand() * 0.55,
		open: true,
		closedAt: 0,
	}));
	let sweep = -Math.PI / 2;
	let target = null; // angle the pointer or a tap asked for
	let pointing = false;
	let lastUser = -Infinity;
	let clearAt = 0;
	let lastT = 0;
	let cx = 0, cy = 0;

	// Close every open gap the sweep crossed between `from` and `to`
	function sweepTo(to, user) {
		const d = turn(sweep, to);
		gaps.forEach((g) => {
			if (!g.open) return;
			const rel = turn(sweep, g.a);
			if ((d >= 0 && rel >= 0 && rel <= d) || (d < 0 && rel <= 0 && rel >= d)) {
				g.open = false;
				g.closedAt = performance.now();
				const left = gaps.filter((x) => x.open).length;
				say(left ? `gap ${g.id} closed · ${left} open` : 'all gaps closed · perimeter clear', user);
				if (!left) clearAt = performance.now();
			}
		});
		sweep = to;
	}

	function draw(ctx, w, h, t) {
		const dt = lastT ? Math.min(t - lastT, 50) : 16;
		lastT = t;
		cx = w / 2;
		cy = h / 2 + 10;
		const R = Math.min(w * 0.42, (h - 76) / 2);

		// Reopen after a short "all clear"
		if (clearAt && performance.now() - clearAt > RESET_MS) {
			gaps.forEach((g) => (g.open = true));
			clearAt = 0;
		}

		// A tap's aim lapses after a while so the sweep turns by itself again
		if (target !== null && !pointing && t - lastUser > 3000) target = null;
		if (!reduce) {
			if (target !== null) sweepTo(sweep + turn(sweep, target) * (1 - Math.exp(-0.012 * dt)), true);
			else if (!pointing && t - lastUser > 3000) sweepTo(sweep + dt * 0.0009, false);
		}

		ctx.lineWidth = 1;
		ctx.strokeStyle = 'rgba(139,144,151,0.2)';
		[0.33, 0.66, 1].forEach((k) => {
			ctx.beginPath();
			ctx.arc(cx, cy, R * k, 0, TAU);
			ctx.stroke();
		});
		ctx.beginPath();
		ctx.moveTo(cx - R, cy);
		ctx.lineTo(cx + R, cy);
		ctx.moveTo(cx, cy - R);
		ctx.lineTo(cx, cy + R);
		ctx.stroke();

		// Sweep wedge trailing the beam
		if (ctx.createConicGradient) {
			const grad = ctx.createConicGradient(sweep - 0.9, cx, cy);
			grad.addColorStop(0, 'rgba(255,91,31,0)');
			grad.addColorStop(0.143, 'rgba(255,91,31,0.22)');
			grad.addColorStop(0.1431, 'rgba(255,91,31,0)');
			ctx.fillStyle = grad;
			ctx.beginPath();
			ctx.arc(cx, cy, R, 0, TAU);
			ctx.fill();
		}
		ctx.strokeStyle = ACCENT;
		ctx.beginPath();
		ctx.moveTo(cx, cy);
		ctx.lineTo(cx + Math.cos(sweep) * R, cy + Math.sin(sweep) * R);
		ctx.stroke();

		// Dots glow just after the beam passes
		field.forEach((d) => {
			const behind = (sweep - d.a + TAU * 2) % TAU;
			const glow = Math.max(0, 1 - behind / 2.2);
			ctx.fillStyle = `rgba(232,234,236,${0.14 + glow * 0.55})`;
			ctx.fillRect(cx + Math.cos(d.a) * d.r * R - 1, cy + Math.sin(d.a) * d.r * R - 1, 2, 2);
		});

		ctx.font = MONO;
		ctx.textBaseline = 'middle';
		ctx.textAlign = 'left';
		gaps.forEach((g) => {
			const x = cx + Math.cos(g.a) * g.r * R;
			const y = cy + Math.sin(g.a) * g.r * R;
			if (g.open) {
				// Open: pulsing orange square with its number
				const p = reduce ? 1 : 0.6 + Math.sin(t * 0.005 + g.a) * 0.4;
				ctx.strokeStyle = `rgba(255,91,31,${p})`;
				ctx.strokeRect(x - 5, y - 5, 10, 10);
				ctx.fillStyle = ACCENT;
				ctx.fillText(g.id, x + 9, y);
			} else {
				// Closed: solid white square, with a brief ring as it locks
				const since = performance.now() - g.closedAt;
				if (since < 600 && !reduce) {
					ctx.strokeStyle = `rgba(232,234,236,${1 - since / 600})`;
					ctx.strokeRect(x - 5 - since / 40, y - 5 - since / 40, 10 + since / 20, 10 + since / 20);
				}
				ctx.fillStyle = TEXT;
				ctx.fillRect(x - 3.5, y - 3.5, 7, 7);
			}
		});

		// Open count, top right
		const open = gaps.filter((g) => g.open).length;
		ctx.textAlign = 'right';
		ctx.fillStyle = open ? ACCENT : TEXT;
		ctx.fillText(open ? `${open} open` : 'clear', w - 12, 16);
	}

	const angleTo = (x, y) => Math.atan2(y - cy, x - cx);

	return {
		label: 'fig. 03 · demo scan',
		ariaLabel: 'Demo: a security scan that closes open gaps as it sweeps. Arrow keys turn the sweep.',
		hint: { mouse: 'Aim the sweep', touch: 'Tap to aim' },
		draw,
		move(x, y) {
			pointing = true;
			lastUser = performance.now();
			if (reduce) sweepTo(angleTo(x, y), true);
			else target = angleTo(x, y);
			return 'crosshair';
		},
		leave() {
			pointing = false;
			target = null;
			lastUser = performance.now();
		},
		tap(x, y) {
			lastUser = performance.now();
			if (reduce) sweepTo(angleTo(x, y), true);
			else target = angleTo(x, y);
		},
		key(key) {
			const step = key === 'ArrowRight' || key === 'ArrowDown' ? 1 : key === 'ArrowLeft' || key === 'ArrowUp' ? -1 : 0;
			if (!step) return false;
			lastUser = performance.now();
			target = null;
			sweepTo(sweep + step * (Math.PI / 12), true);
			return true;
		},
		blur() {},
	};
}
