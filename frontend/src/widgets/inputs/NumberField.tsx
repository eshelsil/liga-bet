import React from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';


export default function NumberField(props: TextFieldProps) {
	return (
		<TextField
			type='number'
			{...props}
			inputProps={{
				inputMode: 'numeric',
				pattern: '[0-9]*',
				...props?.inputProps
			}}
		/>
	);
}
