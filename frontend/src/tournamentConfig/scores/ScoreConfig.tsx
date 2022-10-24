import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { validationSchema } from './schema';
import { TournamentScoreConfig } from '../../types';
import { Button } from '@mui/material';
import GroupRankBetConfig from './groupRankBets/GroupRankBetConfig';
import MatchBetsConfig from './matchBets/MatchBetsConfig';
import SpecialBetsConfig from './specialQuestions/SpecialBetsConfig';
import { ScoreConfigForm } from '../types';
import { generateDefaultScoresConfig, mapFormStateToApiParams, getInitialOptionsConfig } from '../utils';


interface Props {
	config: TournamentScoreConfig,
	updateConfig: (config: TournamentScoreConfig) => Promise<void>,
}

function ScoreConfig({
	config,
	updateConfig,
}: Props){
	const defaultConfig = config || generateDefaultScoresConfig()
	const initialOptionsConfig = getInitialOptionsConfig(config)
	const { setValue, handleSubmit, watch, register, control, formState, clearErrors, reset} = useForm<ScoreConfigForm>({
		// resolver: yupResolver(validationSchema),
		// TODO: use validationSchema
		reValidateMode: 'onSubmit',
		shouldFocusError: true,
		defaultValues: {
			...defaultConfig,
			...initialOptionsConfig,		
		},
	})
	const { errors, isSubmitting } = formState;
	const formProps = {setValue, control, register, clearErrors, errors, watch};


	const submit = async (formState: ScoreConfigForm) => {
		const apiParams = mapFormStateToApiParams(formState)
		await updateConfig(apiParams)
		.then(() => {
			(window as any).toastr["success"]('ההגדרות הניקוד עודכנו בהצלחה');
		});
	}

	return (
		<div className='LigaBet-ScoreConfig'>
			<MatchBetsConfig
				{...formProps}
			/>
			<GroupRankBetConfig
				{...formProps}
			/>
			<SpecialBetsConfig
				{...formProps}
			/>
			<div className={'savePrizes'}>
				<Button variant='contained' color='primary' onClick={handleSubmit(submit)}>
					עדכן
				</Button>
			</div>
		</div>
	);
}


export default ScoreConfig;