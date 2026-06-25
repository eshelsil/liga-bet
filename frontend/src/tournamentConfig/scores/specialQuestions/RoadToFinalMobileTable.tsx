import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { CompetitionStageName } from '../../../types';
import { SpecialQuestionConfigProps } from '../../types';
import CustomTable from '../../../widgets/Table/CustomTable';
import ScoreInput from '../ScoreInput';
import HeaderWithSwitch from './HeaderWithSwitch';
import { getCompetitionStageName } from '../../../strings';
import { IsWC48 } from '../../../_selectors';


interface CompetitionStageConfigModel {
	id: string,
	stageName: CompetitionStageName,
}

function RoadToFinalMobileTable({disabled, ...formProps}: SpecialQuestionConfigProps){
	const { t } = useTranslation('tournamentConfig');
	const { watch, setValue, errors, register, clearErrors } = formProps;
	const isWc48 = useSelector(IsWC48);

	const isOnRunnerUp = watch('specialQuestionFlags.runnerUp');

	const isOnSemiFinal = watch('specialQuestionOptions.roadToFinal.semiFinal');
	const onChangeSemiFinal = (event: any, value: boolean) => {
		setValue('specialQuestionOptions.roadToFinal.semiFinal', value as never);
	}
	const isOnQuarterFinal = watch('specialQuestionOptions.roadToFinal.quarterFinal');
	const onChangeQuarterFinal = (event: any, value: boolean) => {
		setValue('specialQuestionOptions.roadToFinal.quarterFinal', value as never);
	}
	const isOnLast16 = watch('specialQuestionOptions.roadToFinal.last16');
	const onChangeLast16 = (event: any, value: boolean) => {
		setValue('specialQuestionOptions.roadToFinal.last16', value as never);
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
		...(isWc48 ? [{
			id: CompetitionStageName.Last16,
			stageName: CompetitionStageName.Last16,
		}] : []),
	];


	const cells = [
		{
			id: 'stage',
			header: '',
			getter: (model: CompetitionStageConfigModel) => {
				const label = getCompetitionStageName(model.stageName);
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
				if (model.stageName === CompetitionStageName.Last16) {
					return (
						<HeaderWithSwitch
							label={label}
							checked={isOnLast16}
							onChange={onChangeLast16}
							disabled={disabled}
						/>
					)
				}
				return label
			}
		},
		{
			id: 'winner',
			header: t('roadToFinal.winner'),
			getter: (model: CompetitionStageConfigModel) => (
				<ScoreInput
					error={errors.specialBets?.winner?.message}
					InputProps={{
						...register(`specialBets.winner.${model.stageName}`),
						disabled: (
							(model.stageName === CompetitionStageName.SemiFinal && !isOnSemiFinal)
							|| (model.stageName === CompetitionStageName.QuarterFinal && !isOnQuarterFinal)
							|| (model.stageName === CompetitionStageName.Last16 && !isOnLast16)
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
				header: t('roadToFinal.runnerUp'),
				getter: (model: CompetitionStageConfigModel) => (<>
					{model.id !== CompetitionStageName.Winning && (
						<ScoreInput
							error={errors.specialBets?.runnerUp?.message}
							InputProps={{
								...register(`specialBets.runnerUp.${model.stageName}`),
								disabled: (
									(model.stageName === CompetitionStageName.SemiFinal && !isOnSemiFinal)
									|| (model.stageName === CompetitionStageName.QuarterFinal && !isOnQuarterFinal)
									|| (model.stageName === CompetitionStageName.Last16 && !isOnLast16)
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