export interface TleRecord {
	name: string;
	/** NORAD catalogue number */
	id: number;
	line1: string;
	line2: string;
}

/**
 * Parses CelesTrak's three-line TLE text (name, line 1, line 2) into records.
 * A record is kept only when its two element lines start with "1 " and "2 ";
 * anything else (blank input, "No GP data found", a mangled record) is skipped.
 */
export function parseTle(text: string): TleRecord[] {
	const lines = text
		.split(/\r?\n/)
		.map((l) => l.trimEnd())
		.filter((l) => l.length > 0);

	const records: TleRecord[] = [];
	for (let i = 0; i + 2 < lines.length; ) {
		const [name, line1, line2] = [lines[i], lines[i + 1], lines[i + 2]];
		if (line1?.startsWith('1 ') && line2?.startsWith('2 ')) {
			records.push({ name: name.trim(), id: Number(line1.slice(2, 7)), line1, line2 });
			i += 3;
		} else {
			i += 1;
		}
	}
	return records;
}
