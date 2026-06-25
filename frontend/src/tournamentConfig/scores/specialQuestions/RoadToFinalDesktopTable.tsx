import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { CompetitionStageName, SpecialQuestionType } from '../../../types';
import { SpecialQuestionConfigProps } from '../../types';
import CustomTable from '../../../widgets/Table/CustomTable';
import TeamAchivementStageConfig from './TeamAchivementStageConfig';
import HeaderWithSwitch from './HeaderWithSwitch';
import { getCompetitionStageName } from '../../../strings';
import { IsWC48 } from '@/_selectors';


interface TeamAchivementsConfigModel {
	id: string,
	label: string,
	question: SpecialQuestionType.Winner | SpecialQuestionType.RunnerUp,
}



function RoadToFinalDesktopTable({disabled, ...formProps}: SpecialQuestionConfigProps){
	const { t } = useTranslation('tournamentConfig');
	const { watch, setValue } = formProps;
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

	const models: TeamAchivementsConfigModel[] = [
		{
			id: 'winner',
			label: t('roadToFinal.winnerCup'),
			question: SpecialQuestionType.Winner,
		},
		...(
			isOnRunnerUp
			? [
				{
					id: 'runnerUp',
					label: t('roadToFinal.runnerUp'),
					question: SpecialQuestionType.RunnerUp as any,
				}
			]
			: []
		)
	];

	const cells = [
		{
			id: 'questionName',
			header: '',
			getter: (model: TeamAchivementsConfigModel) => model.label,
		},
		{
			id: 'winning',
			header: t('roadToFinal.winningTitle'),
			getter: (model: TeamAchivementsConfigModel) => (<>
				{model.id === 'winner' && (
					<TeamAchivementStageConfig
						stageName={CompetitionStageName.Winning}
						questionType={model.question}
						disabled={disabled}
						{...formProps}
					/>
				)}
			</>),
		},
		{
			id: 'final',
			header: t('roadToFinal.reachingFinal'),
			getter: (model: TeamAchivementsConfigModel) => (
				<TeamAchivementStageConfig
					stageName={CompetitionStageName.Final}
					questionType={model.question}
					disabled={disabled}
					{...formProps}
				/>
			),
		},
		{
			id: 'semifinal',
			header: (
				<HeaderWithSwitch
					label={getCompetitionStageName(CompetitionStageName.SemiFinal)}
					checked={isOnSemiFinal}
					onChange={onChangeSemiFinal}
					disabled={disabled}
				/>
			),
			getter: (model: TeamAchivementsConfigModel) => (
				<TeamAchivementStageConfig
					stageName={CompetitionStageName.SemiFinal}
					questionType={model.question}
					disabled={!isOnSemiFinal || disabled}
					{...formProps}
				/>
			),
		},
		{
			id: 'quarterFinal',
			header: (
				<HeaderWithSwitch
					label={getCompetitionStageName(CompetitionStageName.QuarterFinal)}
					checked={isOnQuarterFinal}
					onChange={onChangeQuarterFinal}
					disabled={disabled}
				/>
			),
			getter: (model: TeamAchivementsConfigModel) => (
				<TeamAchivementStageConfig
					stageName={CompetitionStageName.QuarterFinal}
					disabled={!isOnQuarterFinal || disabled}
					questionType={model.question}
					{...formProps}
				/>
			),
		},
		...(isWc48 ? [{
			id: 'last16',
			header: (
				<HeaderWithSwitch
					label={getCompetitionStageName(CompetitionStageName.Last16)}
					checked={isOnLast16}
					onChange={onChangeLast16}
					disabled={disabled}
				/>
			),
			getter: (model: TeamAchivementsConfigModel) => (
				<TeamAchivementStageConfig
					stageName={CompetitionStageName.Last16}
					disabled={!isOnLast16 || disabled}
					questionType={model.question}
					{...formProps}
				/>
			),
		}] : []),
	]

	return (
		<div className={'LB-RoadToFinalDesktopTable'}>
			<CustomTable models={models} cells={cells} />
		</div>
	);
}

export default RoadToFinalDesktopTable;