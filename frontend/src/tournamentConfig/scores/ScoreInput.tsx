import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';


interface Props {
	label?: string,
	error?: string,
	InputProps?: TextFieldProps['InputProps'],
	clearErrors?: () => void,
}

function ScoreInput({
	label,
	error,
	InputProps,
	clearErrors,
} : Props) {
	return (
		<TextField
			type={'number'}
			className={'LigaBet-ScoreInput'}
			label={label || ' '}
			error={!!error}
			helperText={error}
			InputLabelProps={{shrink: !!label}}
			InputProps={{
				...InputProps,
				inputProps: {
					max: 1000,
					min: 0,
					onClick:(e: any) => e.target.select(),
					...InputProps.inputProps,
				},
			}}
			onFocus={clearErrors}
		/>
	);
}


export default ScoreInput;