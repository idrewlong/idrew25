// Which Vercel region ran this request (Vercel sets VERCEL_REGION in
// functions). The footer map highlights it; locally it reports "dev".
export default defineEventHandler((event) => {
	setResponseHeader(event, 'Cache-Control', 'no-store');
	return { region: process.env.VERCEL_REGION || 'dev' };
});
