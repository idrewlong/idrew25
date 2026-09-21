import { Flex, Text } from '@sanity/ui';

export function Logo() {
	return (
		<Flex align="center" gap={2}>
			<img
				src="/logo.webp"
				alt=""
				width={28}
				height={28}
				style={{ display: 'block', objectFit: 'contain' }}
			/>
			<Text size={1} weight="semibold">
				idrewlong.com
			</Text>
		</Flex>
	);
}
