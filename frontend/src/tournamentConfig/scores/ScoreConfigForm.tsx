import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { validationSchema } from './schema';
import GroupRankBetConfig from './groupRankBets/GroupRankBetConfig';
import MatchBetsConfig from './matchBets/MatchBetsConfig';
import SpecialBetsConfig from './specialQuestions/SpecialBetsConfig';
import { ScoreConfigForm } from '../types';
import { mapFormStateToApiParams, getInitialOptionsConfig } from '../utils';
import { generateDefaultScoresConfig } from '../../utils';
import { isEmpty } from 'lodash';
import { LoadingButton } from '../../widgets/Buttons';
import { ScoresConfigFromatted } from '../../_selectors';



interface Props {
	config: ScoresConfigFromatted,
	updateConfig?: (config: ScoresConfigFromatted) => Promise<void>,
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


	const resetDefaultConfig = async () => {
		const defaultOptions = getInitialOptionsConfig(defaultConfig)
		reset({
			...defaultOptions,
			...defaultConfig,
		})
		return await onSubmit()
	}


	const submit = async (formState: ScoreConfigForm) => {
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
			{updateConfig && (<>
				<div className={'saveScoresButton'}>
					<LoadingButton action={onSubmit}>
						עדכן
					</LoadingButton>
				</div>
				<div className={'resetButton'}>
					<LoadingButton color='error' action={resetDefaultConfig}>
						אפס לברירת מחדל
					</LoadingButton>
				</div>
			</>)}
		</div>
	);
}


export default ScoreConfigFormView;