/**
 * Shared assistant state, so the nav button and the floating launcher open
 * the same panel. `enabled` comes from /api/assistant/status: false when no
 * API key is set (or production has no shared rate-limit storage).
 */
export function useAssistant() {
	const enabled = useState('assistant-enabled', () => false);
	const open = useState('assistant-open', () => false);
	const checked = useState('assistant-checked', () => false);
	// Set by the site terminal's `ask` command; the chat opens and sends it
	const question = useState('assistant-question', () => '');

	onMounted(async () => {
		if (checked.value) return;
		checked.value = true;
		try {
			const status = await $fetch<{ enabled: boolean }>('/api/assistant/status');
			enabled.value = Boolean(status?.enabled);
		} catch {
			enabled.value = false;
		}
	});

	return { enabled, open, question };
}
