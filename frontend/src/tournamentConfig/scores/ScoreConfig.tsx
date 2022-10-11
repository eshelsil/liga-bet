import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { validationSchema } from './schema';
import { SpecialQuestionType, TournamentScoreConfig } from '../../types';
import { Button } from '@mui/material';
import GroupRankBetConfig from './groupRankBets/GroupRankBetConfig';
import MatchBetsConfig from './matchBets/MatchBetsConfig';
import SpecialBetsConfig from './specialQuestions/SpecialBetsConfig';
import { ScoreConfigForm } from '../types';

interface Props {
	config: TournamentScoreConfig,
	updateConfig: (config: TournamentScoreConfig) => Promise<void>,
}

function ScoreConfig({
	config,
	updateConfig,
}: Props){
	const { setValue, handleSubmit, watch, register, formState, clearErrors, reset} = useForm<ScoreConfigForm>({
		// resolver: yupResolver(validationSchema),
		// TODO: use validationSchema
		reValidateMode: 'onSubmit',
		shouldFocusError: true,
		defaultValues: {
			...config,
			chosenSpecialQuestions: {
				[SpecialQuestionType.Winner]: true,
				[SpecialQuestionType.RunnerUp]: true,
				[SpecialQuestionType.TopScorer]: true,
				[SpecialQuestionType.TopAssists]: true,
				[SpecialQuestionType.MVP]: true,
				[SpecialQuestionType.OffensiveTeamGroupStage]: false,
			}
		},
	})
	const { errors, isSubmitting } = formState;


	const submit = async (params: TournamentScoreConfig) => {
		console.log('params', params);
		await updateConfig(params)
		.then(() => {
			(window as any).toastr["success"]('ההגדרות הניקוד עודכנו בהצלחה');
		});
	}

	return (
		<div className='LigaBet-ScoreConfig'>
			<GroupRankBetConfig
				{...{setValue, register, clearErrors, errors, watch}}
			/>
			<MatchBetsConfig
				{...{setValue, register, clearErrors, errors, watch}}
			/>
			<SpecialBetsConfig
				{...{setValue, register, clearErrors, errors, watch}}
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