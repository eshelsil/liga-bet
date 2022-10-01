import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField, { OutlinedTextFieldProps } from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { startCase } from 'lodash';
import './style.scss';


interface Props extends Partial<Omit<OutlinedTextFieldProps, 'error'>> {
  label: string,
  error: string,
  clearErrors?: () => void,
}

export default function PasswordField({
    label,
	error,
    InputProps,
	clearErrors,
    ...restProps
}: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const name = `password_input_${startCase(label)}`

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (<>
		<div className='LigaBet-PasswordField'>
			<TextField
				error={!!error}
				variant='outlined'
				id={name}
				helperText={error}
				type={showPassword ? 'text' : 'password'}
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
						<IconButton
							onClick={toggleShowPassword}
							edge="end"
						>
							{showPassword ? <VisibilityOff /> : <Visibility />}
						</IconButton>
						</InputAdornment>
					),
					onFocus: () => clearErrors && clearErrors(),
					...InputProps
				}}
				label={label}
				{...restProps}
			/>
		</div>
	</>);
}
