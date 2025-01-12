export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const body = await readBody(event);

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
