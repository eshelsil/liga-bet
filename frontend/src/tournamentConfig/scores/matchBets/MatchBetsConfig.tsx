import React from 'react';
import TakanonPreviewModal from '../../takanonPreview/TakanonPreviewModal';
import { ScoreConfigFormProps } from '../../types';
import MatchBetRules from '../../../takanon/matches/MatchBetRulesProvider';
import CustomTable from '../../../widgets/Table/CustomTable';
import { GameBetType, KnockoutStage } from '../../../types';
import MatchBetsExplanation from './MatchBetsExplanation';
import MatchBetStageConfig from './MatchBetStageConfig';
import SectionTitle from '../SectionTitle';
import { gameStageToString } from '../../../utils';
import { useWatch } from 'react-hook-form';
import { Switch } from '@mui/material';
import { Model as TableModel } from '../../../widgets/Table';
import BonusesRow from './BonusesRow';


interface StageConfigModel {
	id: string,
	gameBetType: GameBetType,
	koStageName?: KnockoutStage,
}


function MatchBetsConfig(formProps: ScoreConfigFormProps){
	const scoreConfig = useWatch({control: formProps.control, name: 'gameBets'})
	const optionsConfig = useWatch({control: formProps.control, name: 'gameBetOptions'})
	const qualifierIsOn = optionsConfig.qualifier

	const onKoSwitchChange = (event: any, value: boolean) => {
		formProps.setValue('gameBetOptions.qualifier', value as never);
	}

	const models: (StageConfigModel | TableModel)[] = [
		{
			id: GameBetType.GroupStage,
			gameBetType: GameBetType.GroupStage,
		},
		{
			id: GameBetType.Knockout,
			gameBetType: GameBetType.Knockout,
		},
		{
			id: 'bonuses',
			isFullRow: true,
			fullRowContent: (
				<BonusesRow {...formProps} />
			),
		},
		...(optionsConfig.bonuses.final ? [{
			id: KnockoutStage.Final,
			gameBetType: GameBetType.Bonus,
			koStageName: KnockoutStage.Final,
		}] : []),
		...(optionsConfig.bonuses.semiFinal ? [{
			id: KnockoutStage.SemiFinal,
			gameBetType: GameBetType.Bonus,
			koStageName: KnockoutStage.SemiFinal,
		}] : []),
	];
	const tableCells = [
		{
			id: 'stageName',
			header: '',
			getter: (model: StageConfigModel) => gameStageToString[model.id],
		},
		{
			id: 'result',
			header: 'תוצאה מדויקת',
			getter: (model: StageConfigModel) => (
				<MatchBetStageConfig
					attribute={'result'}
					gameBetType={model.gameBetType}
					koStageName={model.koStageName}
					{...formProps}
				/>
			),
		},
		{
			id: 'winnerSide',
			header: 'מי תנצח - (1X2)',
			getter: (model: StageConfigModel) => (
				<MatchBetStageConfig
					attribute={'winnerSide'}
					gameBetType={model.gameBetType}
					koStageName={model.koStageName}
					{...formProps}
				/>
			),
		},
		{
			id: 'qualifier',
			header: (
				<div className={'headerWithSwitch'}>
					<Switch checked={qualifierIsOn} onChange={onKoSwitchChange} />
					<div>מעפילה</div>
				</div>
			),
			getter: (model: StageConfigModel) => (<>
				{model.gameBetType !== GameBetType.GroupStage && (
					<MatchBetStageConfig
						attribute={'qualifier'}
						gameBetType={model.gameBetType}
						koStageName={model.koStageName}
						disabled={!qualifierIsOn}
						{...formProps}
					/>
				)}
			</>),
		},
	]
	return (
		<div className='LigaBet-MatchRankBetCofig'>
			<SectionTitle
				title={'ניקוד על משחקים'}
				tooltipContent={<MatchBetsExplanation />}
			/>
			<div>
				<CustomTable models={models} cells={tableCells} />
			</div>
			<TakanonPreviewModal>
				<MatchBetRules scoreConfig={scoreConfig} />
			</TakanonPreviewModal>
		</div>
	);
}


export default MatchBetsConfig;