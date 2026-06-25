import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, connect } from 'react-redux';
import { TournamentScoreConfig } from '../../types';
import {
	updateScoreConfig
} from '../../_actions/tournament';
import { IsCurrentTournamentKnockoutBracket, IsTournamentStarted, NoSelector, ScoresConfigSelector } from '../../_selectors';
import ScoresConfigPage from './ScoresConfigPage';
import BracketScoresConfigPage from './BracketScoresConfigPage';
import './ScoresConfig.scss';


function ScoresConfigPageProvider({
	updateScoreConfig,
}: {
	updateScoreConfig: (config: TournamentScoreConfig ) => Promise<void>,
}){
	const { t } = useTranslation('tournamentConfig')
	const scoresConfig = useSelector(ScoresConfigSelector);
	const hasTournamentStarted = useSelector(IsTournamentStarted)
	const isKnockoutBracket = useSelector(IsCurrentTournamentKnockoutBracket)

	return (
		<div>
			{!hasTournamentStarted && isKnockoutBracket && (
				<BracketScoresConfigPage
					updateScoreConfig={updateScoreConfig}
				/>
			)}
			{!hasTournamentStarted && !isKnockoutBracket && (
				<ScoresConfigPage
					scoreConfig={scoresConfig}
					updateScoreConfig={updateScoreConfig}
				/>
			)}
			{hasTournamentStarted && (
				<h2 className='LB-TitleText'>{t('scoresConfigProvider.unavailableAfterStart')}</h2>
			)}
		</div>
	);
}

const mapDispatchToProps = {
	updateScoreConfig,
}


export default connect(NoSelector, mapDispatchToProps)(ScoresConfigPageProvider);