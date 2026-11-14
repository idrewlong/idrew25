/**
 * The site's current up/down state for the header's status dot, fetched once
 * per visit from the edge-cached /api/status/now.
 */
export function useSiteStatus() {
	const state = useState<'up' | 'down' | 'unknown' | null>('site-status', () => null);
	const asked = useState('site-status-asked', () => false);

	onMounted(async () => {
		if (asked.value) return;
		asked.value = true;
		try {
			state.value = (await $fetch<{ state: 'up' | 'down' | 'unknown' }>('/api/status/now')).state;
		} catch {
			state.value = 'unknown';
		}
	});

	const label = computed(() =>
		({ up: 'Site status: up', down: 'Site status: down', unknown: 'Site status: no recent checks' })[state.value ?? 'unknown']
	);

	return { state, label };
}
