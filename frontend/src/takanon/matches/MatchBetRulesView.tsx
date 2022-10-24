import React from 'react';
import { MatchBetsScoreConfig, Team } from '../../types';
import GroupStageMatchRules from './GroupStageMatchRules';
import KnockoutMatchRules from './KnockoutMatchRules';


interface Props {
    groupStageGamesCount: number,
    knockoutGamesCount: number,
    homeTeam: Team,
    awayTeam: Team,
    scoreConfig: MatchBetsScoreConfig,
}

function MatchBetRulesView({
    groupStageGamesCount,
    knockoutGamesCount,
    homeTeam,
    awayTeam,
    scoreConfig,
}: Props) {
    return (<>
        <GroupStageMatchRules {...{
            scoreConfig: scoreConfig.groupStage,
            gamesCount: groupStageGamesCount,
            homeTeam,
            awayTeam,
        }}
        />
        <KnockoutMatchRules {...{
            scoreConfig: scoreConfig.knockout,
            gamesCount: knockoutGamesCount,
            homeTeam,
            awayTeam,
        }} />
    </>);
};

export default MatchBetRulesView;
