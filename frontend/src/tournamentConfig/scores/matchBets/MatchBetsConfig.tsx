import React from 'react';
import TakanonPreviewModal from '../../takanonPreview/TakanonPreviewModal';
import { ScoreConfigFormProps } from '../../types';
import MatchBetRules from '../../../takanon/matches/MatchBetRulesProvider';
import CustomTable from '../../../widgets/Table/CustomTable';
import { GameBetScoreConfig, GameStage } from '../../../types';
import MatchBetsExplanation from './MatchBetsExplanation';
import { ensureNumberValuesOnMatchBetConfig } from '../../utils';
import MatchBetStageConfig from './MatchBetStageConfig';
import SectionTitle from '../SectionTitle';



interface StageConfigModel {
	id: string,
	stageName: GameStage,
	config: GameBetScoreConfig,
}

function MatchBetsConfig(formProps: ScoreConfigFormProps){
	const { watch } = formProps;
	const scoreConfig = watch('gameBets');
	const models: StageConfigModel[] = Object.entries(scoreConfig).map(
		([stageName, config]) => ({
			id: stageName,
			stageName,
			config,
		})
	) as StageConfigModel[];
	return (
		<div className='LigaBet-MatchRankBetCofig'>
			<SectionTitle
				title={'ניקוד על משחקים'}
				tooltipContent={<MatchBetsExplanation />}
			/>
			<div>
				<CustomTable models={models} cells={[
					{
						id: 'stageName',
						label: '',
						getter: (model: StageConfigModel) => model.stageName,
					},
					{
						id: 'result',
						label: 'תוצאה מדויקת',
						getter: (model: StageConfigModel) => (
							<MatchBetStageConfig
								stageName={model.stageName}
								gameConfigType='result'
								{...formProps}
							/>
						),
					},
					{
						id: 'winnerSide',
						label: 'מי תנצח - (1X2)',
						getter: (model: StageConfigModel) => (
							<MatchBetStageConfig
								stageName={model.stageName}
								gameConfigType='winnerSide'
								{...formProps}
							/>
						),
					},
					{
						id: 'qualifier',
						label: 'מעפילה',
						getter: (model: StageConfigModel) => (<>
							{model.stageName !== GameStage.GroupStage && (
								<MatchBetStageConfig
									stageName={model.stageName}
									gameConfigType='qualifier'
									{...formProps}
								/>
							)}
						</>),
					},
				]} />
			</div>
			<TakanonPreviewModal>
				<MatchBetRules scoreConfig={ensureNumberValuesOnMatchBetConfig(scoreConfig)} />
			</TakanonPreviewModal>
		</div>
	);
}


export default MatchBetsConfig;