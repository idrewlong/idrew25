export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const body = await readBody(event);

	const { name, email, message } = body ?? {};

	if (
		typeof name !== 'string' ||
		typeof email !== 'string' ||
		typeof message !== 'string' ||
		name.trim().length < 1 ||
		name.length > 100 ||
		!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
		message.trim().length < 1 ||
		message.length > 5000
	) {
		throw createError({
			statusCode: 400,
			message: 'Invalid form submission',
		});
	}

	try {
		return await $fetch('https://api.web3forms.com/submit', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: {
				...body,
				access_key: config.ACCESS_KEY,
				subject: `New Contact Form Submission from ${body.name} - idrewlong.com`,
			},
		});
	} catch (error) {
		throw createError({
			statusCode: 500,
			message: 'Failed to send message',
		});
	}
});
