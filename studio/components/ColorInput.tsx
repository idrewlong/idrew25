import { Box, Flex, TextInput } from '@sanity/ui';
import { useCallback } from 'react';
import { set, unset, type StringInputProps } from 'sanity';

const HEX = /^#[0-9a-fA-F]{6}$/;
const FALLBACK = '#f5f5f4';

export function ColorInput(props: StringInputProps) {
	const { value = '', onChange, elementProps } = props;

	const handleChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const next = event.currentTarget.value;
			onChange(next ? set(next) : unset());
		},
		[onChange]
	);

	return (
		<Flex gap={2} align="center">
			<input
				type="color"
				aria-label="Pick accent colour"
				value={HEX.test(value) ? value : FALLBACK}
				onChange={handleChange}
				style={{
					width: 44,
					height: 35,
					padding: 0,
					border: '1px solid #E7E5E0',
					borderRadius: 4,
					background: 'none',
					cursor: 'pointer',
				}}
			/>
			{/* The text field stays alongside the swatch on purpose: a native
			    colour picker cannot express "empty", and pasting a known hex
			    from a brand guide is faster than hunting for it in a gradient. */}
			<Box flex={1}>
				<TextInput
					{...elementProps}
					value={value}
					onChange={handleChange}
					placeholder="#de6daa"
				/>
			</Box>
		</Flex>
	);
}
