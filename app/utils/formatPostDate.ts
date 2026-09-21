export function formatPostDate(
	value: string,
	month: 'short' | 'long' = 'short'
): string {
	return new Date(value).toLocaleDateString('en-US', {
		year: 'numeric',
		month,
		day: 'numeric',
	});
}
