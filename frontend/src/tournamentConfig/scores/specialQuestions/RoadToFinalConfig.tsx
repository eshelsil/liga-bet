import React from 'react';
import { SpecialQuestionConfigProps } from '../../types';
import TakanonPreviewModal from '../../takanonPreview/TakanonPreviewModal';
import TeamAchivementRules from '../../../takanon/specialQuestions/TeamAchivementRules';
import SpecialQuestionHeader from './SpecialQuestionHeader';
import { useIsXsScreen } from '../../../hooks/useMedia';
import RoadToFinalDesktopTable from './RoadToFinalDesktopTable';
import RoadToFinalMobileTable from './RoadToFinalMobileTable';
import RoadToFinalExplanation from './explanations/RoadToFinalExplanation';


function RoadToFinalConfig(configProps: SpecialQuestionConfigProps){
	const { watch, setValue } = configProps;
	const isMobile = useIsXsScreen()

	const isOnWinner = watch('specialQuestionFlags.winner');
	const scoreConfigWinner = watch('specialBets.winner');
	const onChangeWinner = (event: any, value: boolean) => {
		setValue('specialQuestionFlags.winner', value as never);
	}
	
	const isOnRunnerUp = watch('specialQuestionFlags.runnerUp');
	const scoreConfigRunnerUp = watch('specialBets.runnerUp');
	const onChangeRunnerUp = (event: any, value: boolean) => {
		setValue('specialQuestionFlags.runnerUp', value as never);
	}

	return (
		<div className='LigaBet-RoadToFinalConfig configContainer'>
			<SpecialQuestionHeader
				title={'זוכה'}
				tooltipContent={<RoadToFinalExplanation />}
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
			{!isMobile && (
				<RoadToFinalDesktopTable {...configProps} />
			)}
			{isMobile && (
				<RoadToFinalMobileTable {...configProps} />
			)}
			<TakanonPreviewModal>
				<TeamAchivementRules label={'זוכה'} scoreConfig={scoreConfigWinner} />
				{isOnRunnerUp && (<>
					<br/>
					<TeamAchivementRules label={'סגנית'} scoreConfig={scoreConfigRunnerUp} isRunnerUp />
				</>)}
			</TakanonPreviewModal>
		</div>
	);
}


export default RoadToFinalConfig;