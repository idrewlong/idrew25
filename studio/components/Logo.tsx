// Rendered as the workspace `icon` (see sanity.config.ts), which mounts this
// inside a small (~25x25) navbar container alongside the workspace title.
// Icon-only, no text: the title already shows "idrewlong.com".
export function Logo() {
	return (
		<img
			src="/static/logo.webp"
			alt=""
			style={{
				display: 'block',
				width: '100%',
				height: '100%',
				objectFit: 'contain',
			}}
		/>
	);
}
