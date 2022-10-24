import React from 'react';
import { ScoreConfigFormProps } from '../../types';
import { useWatch } from 'react-hook-form';
import { Checkbox, FormControlLabel } from '@mui/material';



function BonusesRow(formProps: ScoreConfigFormProps) {
	const optionsConfig = useWatch({control: formProps.control, name: 'gameBetOptions'})
	const onChangeFinal = (event: any, value: boolean) => {
		formProps.setValue('gameBetOptions.bonuses.final', value as never);
	}
	const onChangeSemiFinal = (event: any, value: boolean) => {
		formProps.setValue('gameBetOptions.bonuses.semiFinal', value as never);
	}

	return (
		<div className='LB-BonusesRow'>
			<div className='bonusesLabel'>בונוסים:</div>
			<FormControlLabel
				control={<Checkbox
					size='small'
					checked={optionsConfig.bonuses.final}
					onChange={onChangeFinal}
				/>}
				label="גמר"
			/>
			<FormControlLabel
				control={<Checkbox
					size='small'
					checked={optionsConfig.bonuses.semiFinal}
					onChange={onChangeSemiFinal}
				/>}
				label="חצי גמר"
			/>
		</div>
	)
}


export default BonusesRow;