import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { validationSchema } from './schema';
import { TournamentScoreConfig } from '../../types';
import { Button } from '@mui/material';
import GroupRankBetConfig from './groupRankBets/GroupRankBetConfig';
import MatchBetsConfig from './matchBets/MatchBetsConfig';
import SpecialBetsConfig from './specialQuestions/SpecialBetsConfig';
import { ScoreConfigForm } from '../types';
import { generateDefaultScoresConfig, mapFormStateToApiParams, getInitialOptionsConfig } from '../utils';
import { isEmpty } from 'lodash';


interface Props {
	config: TournamentScoreConfig,
	updateConfig: (config: TournamentScoreConfig) => Promise<void>,
}

function ScoreConfigFormView({
	config,
	updateConfig,
}: Props){
	const defaultConfig = generateDefaultScoresConfig()
	const initialConfig = !isEmpty(config) ? config : defaultConfig
	const initialOptionsConfig = getInitialOptionsConfig(initialConfig)
	const { setValue, handleSubmit, watch, register, control, formState, clearErrors, reset} = useForm<ScoreConfigForm>({
		// resolver: yupResolver(validationSchema),
		// TODO: use validationSchema
		reValidateMode: 'onSubmit',
		shouldFocusError: true,
		defaultValues: {
			...initialConfig,
			...initialOptionsConfig,		
		},
	})
	const { errors, isSubmitting } = formState;
	const formProps = {setValue, control, register, clearErrors, errors, watch};


	const resetDefaultConfig = () => {
		const defaultOptions = getInitialOptionsConfig(defaultConfig)
		reset({
			...defaultOptions,
			...defaultConfig,
		})
		onSubmit()
	}


	const submit = async (formState: ScoreConfigForm) => {
		console.log('')
		const apiParams = mapFormStateToApiParams(formState)
		await updateConfig(apiParams)
		.then(() => {
			(window as any).toastr["success"]('ההגדרות הניקוד עודכנו בהצלחה');
		});
	}

	const onSubmit = handleSubmit(submit)

	return (
		<div className='LigaBet-ScoreConfigFormView'>
			<MatchBetsConfig
				{...formProps}
			/>
			<GroupRankBetConfig
				{...formProps}
			/>
			<SpecialBetsConfig
				{...formProps}
			/>
			<div className={'saveScoresButton'}>
				<Button variant='contained' color='primary' onClick={onSubmit}>
					עדכן
				</Button>
			</div>
			<div className={'resetButton'}>
				<Button variant='contained' color='error' onClick={resetDefaultConfig}>
					אפס לברירת מחדל
				</Button>
			</div>
		</div>
	);
}


export default ScoreConfigFormView;