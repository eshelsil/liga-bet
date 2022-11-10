import React from 'react';
import { CompetitionStageName } from '../../../types';
import { SpecialQuestionConfigProps } from '../../types';
import CustomTable from '../../../widgets/Table/CustomTable';
import ScoreInput from '../ScoreInput';
import HeaderWithSwitch from './HeaderWithSwitch';
import { competitionStageToString } from '../../../strings';


interface CompetitionStageConfigModel {
	id: string,
	stageName: CompetitionStageName,
}

function RoadToFinalMobileTable({disabled, ...formProps}: SpecialQuestionConfigProps){
	const { watch, setValue, errors, register, clearErrors } = formProps;

	const isOnRunnerUp = watch('specialQuestionFlags.runnerUp');

	const isOnSemiFinal = watch('specialQuestionOptions.roadToFinal.semiFinal');
	const onChangeSemiFinal = (event: any, value: boolean) => {
		setValue('specialQuestionOptions.roadToFinal.semiFinal', value as never);
	}
	const isOnQuarterFinal = watch('specialQuestionOptions.roadToFinal.quarterFinal');
	const onChangeQuarterFinal = (event: any, value: boolean) => {
		setValue('specialQuestionOptions.roadToFinal.quarterFinal', value as never);
	}


	const models: CompetitionStageConfigModel[] = [
		{
			id: CompetitionStageName.Winning,
			stageName: CompetitionStageName.Winning,
		},
		{
			id: CompetitionStageName.Final,
			stageName: CompetitionStageName.Final,
		},
		{
			id: CompetitionStageName.SemiFinal,
			stageName: CompetitionStageName.SemiFinal,
		},
		{
			id: CompetitionStageName.QuarterFinal,
			stageName: CompetitionStageName.QuarterFinal,
		},
	];


	const cells = [
		{
			id: 'stage',
			header: '',
			getter: (model: CompetitionStageConfigModel) => {
				const label = competitionStageToString[model.stageName];
				if (model.stageName === CompetitionStageName.SemiFinal) {
					return (
						<HeaderWithSwitch
							label={label}
							checked={isOnSemiFinal}
							onChange={onChangeSemiFinal}
							disabled={disabled}
						/>
					)
				}
				if (model.stageName === CompetitionStageName.QuarterFinal) {
					return (
						<HeaderWithSwitch
							label={label}
							checked={isOnQuarterFinal}
							onChange={onChangeQuarterFinal}
							disabled={disabled}
						/>
					)
				}
				return label
			}
		},
		{
			id: 'winner',
			header: 'זוכה',
			getter: (model: CompetitionStageConfigModel) => (
				<ScoreInput
					error={errors.specialBets?.winner?.message}
					InputProps={{
						...register(`specialBets.winner.${model.stageName}`),
						disabled: (
							(model.stageName === CompetitionStageName.SemiFinal && !isOnSemiFinal)
							|| (model.stageName === CompetitionStageName.QuarterFinal && !isOnQuarterFinal)
							|| disabled
						),
					}}
					clearErrors={() => clearErrors(`specialBets.winner.${model.stageName}`)}
				/>
			)
		},
		...(isOnRunnerUp ? [
			{
				id: 'runnerUp',
				header: 'סגנית',
				getter: (model: CompetitionStageConfigModel) => (<>
					{model.id !== CompetitionStageName.Winning && (
						<ScoreInput
							error={errors.specialBets?.runnerUp?.message}
							InputProps={{
								...register(`specialBets.runnerUp.${model.stageName}`),
								disabled: (
									(model.stageName === CompetitionStageName.SemiFinal && !isOnSemiFinal)
									|| (model.stageName === CompetitionStageName.QuarterFinal && !isOnQuarterFinal)
									|| disabled
								),
							}}
							clearErrors={() => clearErrors(`specialBets.runnerUp.${model.stageName}`)}
						/>
					)}
				</>),
			},
		] : []),
	]

	return (
		<div className={'LB-RoadToFinalMobileTable'}>
			<CustomTable models={models} cells={cells} />
		</div>
	);
}

export default RoadToFinalMobileTable;