import React from 'react';
import { CompetitionStageName, RoadToFinalBetScoreConfig, SpecialQuestionType } from '../../../types';
import { ScoreConfigFormProps } from '../../types';
import TakanonPreviewModal from '../../takanonPreview/TakanonPreviewModal';
import TeamAchivementRules from '../../../takanon/specialQuestions/TeamAchivementRules';
import CustomTable from '../../../widgets/Table/CustomTable';
import SpecialQuestionHeader from './SpecialQuestionHeader';
import TeamAchivementStageConfig from './TeamAchivementStageConfig';


const WINNER_STRING = 'זוכה בגביע';
const RUNNER_UP_STRING = 'סגנית';


interface TeamAchivementsConfigModel {
	id: string,
	label: string,
	question: SpecialQuestionType.Winner | SpecialQuestionType.RunnerUp,
	config: RoadToFinalBetScoreConfig,
}

function RoadToFinalConfig(formProps: ScoreConfigFormProps){
	const { watch, setValue } = formProps;

	const isOnWinner = watch('chosenSpecialQuestions.winner');
	const scoreConfigWinner = watch('specialBets.winner');
	const onChangeWinner = (event: any, value: boolean) => {
		setValue('chosenSpecialQuestions.winner', value as never);
	}
	
	const isOnRunnerUp = watch('chosenSpecialQuestions.runner_up');
	const scoreConfigRunnerUp = watch('specialBets.runner_up');
	const onChangeRunnerUp = (event: any, value: boolean) => {
		setValue('chosenSpecialQuestions.runner_up', value as never);
	}

	const models: TeamAchivementsConfigModel[] = [
		{
			id: 'winner',
			label: WINNER_STRING,
			question: SpecialQuestionType.Winner,
			config: scoreConfigRunnerUp,
		},
		...(
			isOnRunnerUp
			? [
				{
					id: 'runner_up',
					label: RUNNER_UP_STRING,
					question: SpecialQuestionType.RunnerUp as any,
					config: scoreConfigRunnerUp,
				}
			]
			: []
		)
	];
	// Todo: Manage add & remove stages from road-to-final config table
	return (
		<div className='LigaBet-RoadToFinalConfig configContainer'>

			<SpecialQuestionHeader
				title={'זוכה'}
				tooltipContent='any content'
				switchProps={{
					disabled: true,
					checked: isOnWinner,
					onChange: onChangeWinner,
				}}
			/>
			<SpecialQuestionHeader
				title={'סגנית'}
				tooltipContent='any content'
				switchProps={{
					checked: isOnRunnerUp,
					onChange: onChangeRunnerUp,
				}}
			/>
			<CustomTable models={models} cells={[
				{
					id: 'questionName',
					label: '',
					getter: (model: TeamAchivementsConfigModel) => model.label,
				},
				{
					id: 'winning',
					label: 'זכייה בתואר',
					getter: (model: TeamAchivementsConfigModel) => (<>
						{model.id === 'winner' && (
							<TeamAchivementStageConfig
								stageName={CompetitionStageName.Winning}
								questionType={model.question}
								{...formProps}
							/>
						)}
					</>),
				},
				{
					id: 'final',
					label: 'הגעה לגמר',
					getter: (model: TeamAchivementsConfigModel) => (
						<TeamAchivementStageConfig
							stageName={CompetitionStageName.Final}
							questionType={model.question}
							{...formProps}
						/>
					),
				},
				{
					id: 'semifinal',
					label: 'הגעה לחצי גמר',
					getter: (model: TeamAchivementsConfigModel) => (
						<TeamAchivementStageConfig
							stageName={CompetitionStageName.SemiFinal}
							questionType={model.question}
							{...formProps}
						/>
					),
				},
				{
					id: 'quarterFinal',
					label: 'הגעה לרבע גמר',
					getter: (model: TeamAchivementsConfigModel) => (
						<TeamAchivementStageConfig
							stageName={CompetitionStageName.QuarterFinal}
							questionType={model.question}
							{...formProps}
						/>
					),
				},
			]} />
			<TakanonPreviewModal>
				<TeamAchivementRules label={'זוכה'} scoreConfig={scoreConfigWinner} />
				{isOnRunnerUp && (<>
					<br/>
					<TeamAchivementRules label={'סגנית'} scoreConfig={scoreConfigRunnerUp} />
				</>)}
			</TakanonPreviewModal>
		</div>
	);
}


export default RoadToFinalConfig;