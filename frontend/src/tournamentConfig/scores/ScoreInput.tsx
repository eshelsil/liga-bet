import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';


interface Props {
	label?: string,
	error?: string,
	InputProps?: TextFieldProps['InputProps'],
	clearErrors?: () => void,
	// Controlled usage (e.g. the bracket scores page). Classic form usage drives the value
	// through `InputProps` (react-hook-form register) and leaves these undefined.
	value?: number,
	onChange?: TextFieldProps['onChange'],
}

function ScoreInput({
	label,
	error,
	InputProps,
	clearErrors,
	value,
	onChange,
} : Props) {
	return (
		<TextField
			type={'number'}
			className={'LigaBet-ScoreInput'}
			label={label || ' '}
			error={!!error}
			helperText={error}
			value={value}
			onChange={onChange}
			InputLabelProps={{shrink: !!label}}
			InputProps={{
				...InputProps,
				inputProps: {
					max: 1000,
					min: 0,
					onClick:(e: any) => e.target.select(),
					...(InputProps?.inputProps),
				},
			}}
			onFocus={clearErrors}
		/>
	);
}


export default ScoreInput;