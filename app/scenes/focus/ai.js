import { ACCENT, TEXT, MUTED, MONO } from './shared';

// Fig. 01: an agent calling real crawlmark MCP tools. Hover or tap a tool (or
// arrow keys + Enter) to call it; left alone, the agent calls them itself.
const TOOLS = ['run_audit', 'quick_wins', 'lighthouse', 'monthly_report', 'gsc_query', 'striking_distance'];
const CALL_MS = 900; // out and back

export function createAi({ say, reduce }) {
	const tools = TOOLS.map((name, i) => ({ name, angle: (i / TOOLS.length) * Math.PI * 2 - Math.PI / 2, x: 0, y: 0 }));
	let spin = 0; // orbit rotation
	let lastT = 0;
	let hover = -1; // tool under the pointer
	let selected = -1; // keyboard selection
	let calls = []; // in flight: { i, start }
	let lastUserCall = -Infinity;
	let nextAuto = 1500;
	let lastAuto = -1;

	function fire(i, user) {
		const t = performance.now();
		calls.push({ i, start: t });
		if (user) lastUserCall = t;
		// The reply lands when the packet gets back
		setTimeout(() => say(`→ ${tools[i].name}()  ← ok`, user), reduce ? 0 : CALL_MS);
	}

	function toolAt(x, y) {
		let best = -1, bestD = 30;
		tools.forEach((tool, i) => {
			const d = Math.hypot(tool.x - x, tool.y - y);
			if (d < bestD) (best = i), (bestD = d);
		});
		return best;
	}

	function draw(ctx, w, h, t) {
		// Narrow (phones): labels sit above/below their tool so the long names
		// fit, and the orbit drops below the one-line call log
		const narrow = w < 520;
		const cx = w / 2, cy = h * (narrow ? 0.55 : 0.54);
		const rx = narrow ? w / 2 - 62 : Math.min(w * 0.36, h * 0.62);
		// Bottom labels stay clear of the caption row
		const ry = narrow ? Math.min(h * 0.27, h - cy - 46) : h * 0.3;
		const dt = lastT ? Math.min(t - lastT, 50) : 0;
		lastT = t;
		// Orbit drifts slowly, and holds still while someone is aiming at a tool
		if (hover < 0 && !reduce) spin += dt * 0.00005;

		// Auto calls when nobody has touched it for a while; never the same tool twice running
		if (!reduce && t > nextAuto && t - lastUserCall > 4000) {
			lastAuto = (lastAuto + 1 + Math.floor(Math.random() * (tools.length - 1))) % tools.length;
			fire(lastAuto, false);
			nextAuto = t + 2200;
		}
		calls = calls.filter((c) => performance.now() - c.start < CALL_MS);

		ctx.lineWidth = 1;
		ctx.strokeStyle = 'rgba(139,144,151,0.22)';
		ctx.setLineDash([2, 5]);
		ctx.beginPath();
		ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
		ctx.stroke();
		ctx.setLineDash([]);
		ctx.font = MONO;
		ctx.textBaseline = 'middle';

		tools.forEach((tool, i) => {
			const a = tool.angle + spin;
			const x = (tool.x = cx + Math.cos(a) * rx);
			const y = (tool.y = cy + Math.sin(a) * ry);
			const call = calls.find((c) => c.i === i);
			const active = i === hover || i === selected || !!call;

			ctx.strokeStyle = active ? 'rgba(255,91,31,0.55)' : 'rgba(139,144,151,0.18)';
			ctx.beginPath();
			ctx.moveTo(cx, cy);
			ctx.lineTo(x, y);
			ctx.stroke();

			// Packet: out to the tool in orange, back to the agent in white
			if (call && !reduce) {
				const p = (performance.now() - call.start) / (CALL_MS / 2);
				const k = p < 1 ? p : 2 - p;
				ctx.fillStyle = p < 1 ? ACCENT : TEXT;
				ctx.fillRect(cx + (x - cx) * k - 2, cy + (y - cy) * k - 2, 4, 4);
			}

			ctx.strokeStyle = active ? ACCENT : MUTED;
			ctx.fillStyle = call ? 'rgba(255,91,31,0.25)' : '#0a0b0c';
			ctx.beginPath();
			ctx.rect(x - 6, y - 6, 12, 12);
			ctx.fill();
			ctx.stroke();

			ctx.fillStyle = active ? TEXT : 'rgba(139,144,151,0.85)';
			if (narrow) {
				const half = ctx.measureText(tool.name).width / 2;
				ctx.textAlign = 'center';
				ctx.fillText(tool.name, Math.min(Math.max(x, half + 4), w - half - 4), y + (Math.sin(a) < 0 ? -15 : 16));
			} else {
				const right = Math.cos(a) >= 0;
				ctx.textAlign = right ? 'left' : 'right';
				ctx.fillText(tool.name, x + (right ? 12 : -12), y);
			}
		});

		// Agent core: pulses harder while a call is out
		const pulse = 1 + Math.sin(t * 0.004) * (calls.length ? 0.2 : 0.08);
		ctx.strokeStyle = 'rgba(255,91,31,0.35)';
		ctx.beginPath();
		ctx.arc(cx, cy, 22 * pulse, 0, Math.PI * 2);
		ctx.stroke();
		ctx.fillStyle = ACCENT;
		ctx.beginPath();
		ctx.arc(cx, cy, 7, 0, Math.PI * 2);
		ctx.fill();
		ctx.textAlign = 'center';
		ctx.fillStyle = 'rgba(232,234,236,0.9)';
		ctx.fillText('claude', cx, cy + 36);
	}

	return {
		label: 'fig. 01 · crawlmark mcp',
		ariaLabel: 'Demo: an AI agent calling crawlmark tools. Arrow keys pick a tool, Enter calls it.',
		hint: { mouse: 'Click a tool', touch: 'Tap a tool' },
		draw,
		move(x, y) {
			hover = toolAt(x, y);
			return hover >= 0 ? 'pointer' : '';
		},
		leave() {
			hover = -1;
		},
		tap(x, y) {
			const i = toolAt(x, y);
			if (i >= 0) fire(i, true);
		},
		key(key) {
			if (key === 'ArrowRight' || key === 'ArrowDown') selected = (selected + 1) % tools.length;
			else if (key === 'ArrowLeft' || key === 'ArrowUp') selected = (selected - 1 + tools.length) % tools.length;
			else if ((key === 'Enter' || key === ' ') && selected >= 0) fire(selected, true);
			else return false;
			return true;
		},
		blur() {
			selected = -1;
		},
	};
}
