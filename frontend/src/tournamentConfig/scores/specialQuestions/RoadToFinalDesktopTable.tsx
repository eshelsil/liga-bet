import React from 'react';
import { CompetitionStageName, SpecialQuestionType } from '../../../types';
import { SpecialQuestionConfigProps } from '../../types';
import CustomTable from '../../../widgets/Table/CustomTable';
import TeamAchivementStageConfig from './TeamAchivementStageConfig';
import HeaderWithSwitch from './HeaderWithSwitch';
import { competitionStageToString } from '../../../strings';


const WINNER_STRING = 'זוכה בגביע';
const RUNNER_UP_STRING = 'סגנית';


interface TeamAchivementsConfigModel {
	id: string,
	label: string,
	question: SpecialQuestionType.Winner | SpecialQuestionType.RunnerUp,
}



function RoadToFinalDesktopTable({disabled, ...formProps}: SpecialQuestionConfigProps){
	const { watch, setValue } = formProps;

	const isOnRunnerUp = watch('specialQuestionFlags.runnerUp');

	const isOnSemiFinal = watch('specialQuestionOptions.roadToFinal.semiFinal');
	const onChangeSemiFinal = (event: any, value: boolean) => {
		setValue('specialQuestionOptions.roadToFinal.semiFinal', value as never);
	}
	const isOnQuarterFinal = watch('specialQuestionOptions.roadToFinal.quarterFinal');
	const onChangeQuarterFinal = (event: any, value: boolean) => {
		setValue('specialQuestionOptions.roadToFinal.quarterFinal', value as never);
	}

	const models: TeamAchivementsConfigModel[] = [
		{
			id: 'winner',
			label: WINNER_STRING,
			question: SpecialQuestionType.Winner,
		},
		...(
			isOnRunnerUp
			? [
				{
					id: 'runnerUp',
					label: RUNNER_UP_STRING,
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
			header: 'זכייה בתואר',
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
			header: 'הגעה לגמר',
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
					label={competitionStageToString.semiFinal}
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
					label={competitionStageToString.quarterFinal}
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
	]

	return (
		<div className={'LB-RoadToFinalDesktopTable'}>
			<CustomTable models={models} cells={cells} />
		</div>
	);
}

export default RoadToFinalDesktopTable;