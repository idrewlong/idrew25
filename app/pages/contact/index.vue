<script lang="ts" setup>
import { ref } from 'vue';

useSeoMeta({
	title: 'Contact',
	ogTitle: 'Get in Touch with Andrew Long',
	description:
		'Get in touch with Andrew Long, a full stack engineer working across software, platform and DevSecOps. Open to opportunities anywhere, especially Austin, Nashville and Huntsville.',
	ogDescription:
		'Get in touch with Andrew Long, a full stack engineer working across software, platform and DevSecOps. Open to opportunities anywhere, especially Austin, Nashville and Huntsville.',
	twitterTitle: 'Contact',
	twitterDescription:
		'Get in touch with Andrew Long, a full stack engineer working across software, platform and DevSecOps. Open to opportunities anywhere, especially Austin, Nashville and Huntsville.',
});

// Public by design -- see the note in nuxt.config.ts.
const accessKey = useRuntimeConfig().public.web3formsAccessKey;

// Form state
const form = ref({ name: '', email: '', message: '' });
const botcheck = ref(false);
const isSubmitting = ref(false);
const result = ref('');
const status = ref('');

const root = ref(null);
useReveal(root);
const headline = ["Let's build", 'something great.'];
const assistant = useAssistant();

// Reset on each call so an earlier timer can't wipe a newer message
let clearStatusTimer: ReturnType<typeof setTimeout> | undefined;
const clearStatusSoon = () => {
	clearTimeout(clearStatusTimer);
	clearStatusTimer = setTimeout(() => {
		result.value = '';
		status.value = '';
	}, 5000);
};

// Web3Forms' free plan rejects server-side calls, so the request goes
// straight from the browser -- these checks mirror the rules the old
// /api/contact route enforced before it was removed.
const validate = () => {
	const { name, email, message } = form.value;
	if (name.trim().length < 1) return 'Please enter your name.';
	if (name.length > 100) return 'Name is too long (100 characters max).';
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
		return 'Please enter a valid email address.';
	if (message.trim().length < 1) return 'Please enter a message.';
	if (message.length > 5000)
		return 'Message is too long (5000 characters max).';
	return null;
};

const submitForm = async () => {
	if (isSubmitting.value) return;

	const validationError = validate();
	if (validationError) {
		status.value = 'error';
		result.value = validationError;
		clearStatusSoon();
		return;
	}

	isSubmitting.value = true;
	clearTimeout(clearStatusTimer);
	result.value = 'Sending message...';
	status.value = 'info';

	// Sent as FormData, not JSON, and deliberately so: multipart/form-data is
	// a CORS-safelisted content type, so this is a "simple request" with no
	// preflight. An application/json body forces an OPTIONS preflight that
	// api.web3forms.com does not answer, and the POST never leaves the browser.
	const payload = new FormData();
	payload.append('access_key', accessKey);
	payload.append('name', form.value.name);
	payload.append('email', form.value.email);
	payload.append('message', form.value.message);
	// Only appended when actually checked. An unchecked checkbox is absent from
	// a native FormData submission entirely, and Web3Forms treats *any* present
	// value -- including the string "false" -- as the honeypot being tripped.
	if (botcheck.value) payload.append('botcheck', 'on');
	payload.append(
		'subject',
		`New contact form submission from ${form.value.name} - idrewlong.com`
	);

	try {
		const response = await fetch('https://api.web3forms.com/submit', {
			method: 'POST',
			body: payload,
		});
		const data: { success?: boolean; message?: string } = await response
			.json()
			.catch(() => ({}));

		if (data.success) {
			status.value = 'success';
			// GA key event: a recruiter or client actually reached out
			useTrackEvent('generate_lead', { form: 'contact' });
			result.value = "Message sent. I'll be in touch soon.";
			form.value = { name: '', email: '', message: '' };
		} else {
			// Surface what Web3Forms actually said rather than a generic string --
			// swallowing this is what made the original failure so hard to diagnose.
			console.error(
				'[contact] Web3Forms rejected the submission:',
				response.status,
				data
			);
			status.value = 'error';
			result.value = data.message || 'Something went wrong. Please try again.';
		}
	} catch (error) {
		console.error('[contact] Request to Web3Forms failed:', error);
		status.value = 'error';
		result.value = 'Failed to send message. Please try again later.';
	} finally {
		isSubmitting.value = false;
		clearStatusSoon();
	}
};

</script>

<template>
	<div ref="root" class="contact-page">
		<PageHeader
			index="[ 00 / 01 ]"
			kicker="Contact"
			:title="headline"
			lede="Have a project in mind, want to collaborate, or just want to connect? Drop me a line. I'd love to hear from you."
		/>

		<section class="wrap ct-grid">
			<!-- Form -->
			<div class="ct-form js-reveal">
				<p class="readout ct-form-head">
					<span><span class="text-[var(--accent)]">&gt;</span> new_message</span>
					<span>Web3Forms</span>
				</p>

				<form class="ct-fields" @submit.prevent="submitForm">
					<div class="form-field">
						<label for="contact-name" class="readout"><span class="text-[var(--accent)]">01</span> · Name</label>
						<input id="contact-name" v-model="form.name" name="name" type="text" autocomplete="name" required class="form-input" placeholder="Your name" />
					</div>

					<div class="form-field">
						<label for="contact-email" class="readout"><span class="text-[var(--accent)]">02</span> · Email</label>
						<input id="contact-email" v-model="form.email" name="email" type="email" autocomplete="email" required class="form-input" placeholder="you@example.com" />
					</div>

					<div class="form-field">
						<label for="contact-message" class="readout"><span class="text-[var(--accent)]">03</span> · Message</label>
						<textarea id="contact-message" v-model="form.message" name="message" required rows="6" class="form-input resize-none" placeholder="Tell me about your project..."></textarea>
					</div>

					<!-- Honeypot -->
					<input
						v-model="botcheck"
						type="checkbox"
						name="botcheck"
						class="hidden"
						style="display: none"
						tabindex="-1"
						autocomplete="off"
						aria-hidden="true"
					/>

					<!-- Status: the live region stays mounted so changes to it are announced -->
					<div role="status" aria-live="polite" aria-atomic="true">
						<Transition name="status">
							<p
								v-if="result"
								class="status-message"
								:class="status === 'success' ? 'status-success' : status === 'error' ? 'status-error' : 'status-info'"
							>
								<Icon
									:name="status === 'success' ? 'heroicons:check-circle' : status === 'error' ? 'heroicons:exclamation-circle' : 'heroicons:arrow-path'"
									class="w-4 h-4 shrink-0"
									:class="{ 'animate-spin': status === 'info' }"
									aria-hidden="true"
								/>
								<span>{{ result }}</span>
							</p>
						</Transition>
					</div>

					<div class="ct-actions">
						<button type="submit" :disabled="isSubmitting" class="btn btn-solid ct-submit">
							<span>{{ isSubmitting ? 'Sending…' : 'Send message' }}</span>
							<Icon name="heroicons:arrow-up-right-20-solid" class="w-4 h-4" aria-hidden="true" />
						</button>
						<p class="readout ct-alt">
							Not ready to write?
							<NuxtLink to="/process" class="ct-link">See how I work →</NuxtLink>
						</p>
					</div>
				</form>
			</div>

			<!-- Sidebar -->
			<aside class="ct-side js-reveal">
				<dl class="ct-spec">
					<div class="ct-row">
						<dt class="readout">Email</dt>
						<dd><a href="mailto:idrewlong@gmail.com" class="ct-link">idrewlong@gmail.com</a></dd>
					</div>
					<div class="ct-row">
						<dt class="readout">Connect</dt>
						<dd class="flex gap-2">
							<a href="https://github.com/idrewlong" target="_blank" rel="noopener noreferrer" class="ct-icon" aria-label="GitHub">
								<Icon name="ph:github-logo-fill" class="w-4 h-4" />
							</a>
							<a href="https://www.linkedin.com/in/idrewlong/" target="_blank" rel="noopener noreferrer" class="ct-icon" aria-label="LinkedIn">
								<Icon name="ph:linkedin-logo-fill" class="w-4 h-4" />
							</a>
						</dd>
					</div>
					<div class="ct-row">
						<dt class="readout">Based in</dt>
						<dd>Long Beach, MS <span class="readout ml-2">30.35°N 89.15°W</span></dd>
					</div>
					<div class="ct-row">
						<dt class="readout">Status</dt>
						<dd>
							<span class="inline-flex items-center gap-2">
								<span class="pulse-dot" aria-hidden="true"></span>
								Open to opportunities
							</span>
							<span class="ct-roles">Software, platform, DevOps, AI and cleared roles. Open to relocating.</span>
						</dd>
					</div>
				</dl>

				<div class="ct-side-actions">
					<button v-if="assistant.enabled.value" type="button" class="btn btn-ghost w-full" @click="assistant.open.value = true">
						<span>Ask my AI a quick question</span>
						<span aria-hidden="true" class="text-[var(--accent)]">↗</span>
					</button>
					<a href="/Andrew%20Long%20Resume.pdf" download class="btn btn-ghost w-full">
						<span>Download resume</span>
						<Icon name="heroicons:arrow-down-tray" class="w-4 h-4" aria-hidden="true" />
					</a>
				</div>
			</aside>
		</section>
	</div>
</template>

<style scoped>
.contact-page {
	padding-bottom: 6rem;
}

.ct-grid {
	display: grid;
	grid-template-columns: 1fr;
	gap: 2rem;
}

@media (min-width: 976px) {
	.ct-grid {
		grid-template-columns: minmax(0, 1fr) 24rem;
		gap: 3rem;
		align-items: start;
	}
}

.ct-form {
	border: 1px solid var(--border);
	background: var(--bg-card);
}

.ct-form-head {
	display: flex;
	justify-content: space-between;
	padding: 0.9rem 1.5rem;
	border-bottom: 1px solid var(--border);
	color: var(--text);
}

.ct-fields {
	display: flex;
	flex-direction: column;
	gap: 2rem;
	padding: 2rem 1.5rem;
}

@media (min-width: 768px) {
	.ct-fields {
		padding: 2.5rem 2.5rem;
	}
}

.form-field {
	display: flex;
	flex-direction: column;
	gap: 0.6rem;
}

.form-input {
	width: 100%;
	padding: 0.6rem 0;
	border: none;
	border-bottom: 1px solid var(--border);
	background: transparent;
	color: var(--text);
	font-size: 1.125rem;
	font-family: inherit;
	transition: border-color 0.2s ease;
	outline: none;
}

.form-input::placeholder {
	color: #4a4f55;
}

.form-input:focus {
	border-bottom-color: var(--accent);
}

.status-message {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	font-family: 'Geist Mono', monospace;
	font-size: 0.8rem;
	letter-spacing: 0.04em;
}

.status-success {
	color: #3ddc84;
}

.status-error {
	color: #ff6b5b;
}

.status-info {
	color: var(--accent);
}

.status-enter-active,
.status-leave-active {
	transition: opacity 0.25s ease, transform 0.25s ease;
}

.status-enter-from,
.status-leave-to {
	opacity: 0;
	transform: translateY(-4px);
}

.ct-actions {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 1.25rem;
	padding-top: 0.5rem;
}

@media (min-width: 640px) {
	.ct-actions {
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
}

.ct-submit {
	min-width: 16rem;
}

.ct-submit:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.ct-alt {
	text-transform: none;
	letter-spacing: 0.04em;
}

.ct-link {
	color: var(--text);
	text-decoration: underline;
	text-decoration-color: var(--text-muted);
	text-underline-offset: 0.25em;
	transition:
		color 0.2s ease,
		text-decoration-color 0.2s ease;
}

.ct-link:hover {
	color: var(--accent);
	text-decoration-color: var(--accent);
}

.ct-spec {
	border: 1px solid var(--border);
}

.ct-row {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	padding: 1.1rem 1.25rem;
	border-bottom: 1px solid var(--border);
}

.ct-row:last-child {
	border-bottom: 0;
}

.ct-row dd {
	font-size: 0.9375rem;
	color: var(--text);
}

.ct-roles {
	display: block;
	margin-top: 0.4rem;
	font-size: 0.875rem;
	color: var(--text-muted);
}

.ct-icon {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 44px;
	height: 44px;
	border: 1px solid var(--border);
	color: var(--text-muted);
	transition: color 0.2s ease, border-color 0.2s ease;
}

.ct-icon:hover {
	color: var(--accent);
	border-color: var(--accent);
}

.ct-side-actions {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	margin-top: 1rem;
}

.pulse-dot {
	width: 6px;
	height: 6px;
	background: var(--accent);
	animation: pulse-dot 2.4s ease-in-out infinite;
}

@keyframes pulse-dot {
	50% {
		opacity: 0.35;
	}
}

@media (prefers-reduced-motion: reduce) {
	.pulse-dot {
		animation: none;
	}

	.status-enter-active,
	.status-leave-active {
		transition: none;
	}
}
</style>
