import React from 'react';
import { Team, Tournament } from '../../types';
import GroupStageMatchRules from './GroupStageMatchRules';
import KnockoutMatchRules from './KnockoutMatchRules';


interface Props {
    groupStageGamesCount: number,
    knockoutGamesCount: number,
    homeTeam: Team,
    awayTeam: Team,
    tournament: Tournament,
}

function MatchBetRules({
    groupStageGamesCount,
    knockoutGamesCount,
    homeTeam,
    awayTeam,
    tournament,
}: Props) {
    return (<>
        <GroupStageMatchRules {...{
            scoreConfig: tournament.config.gameBets.group_stage,
            gamesCount: groupStageGamesCount,
            homeTeam,
            awayTeam,
        }}
        />
        <KnockoutMatchRules {...{
            scoreConfig: tournament.config.gameBets.knockout,
            gamesCount: knockoutGamesCount,
            homeTeam,
            awayTeam,
        }} />
    </>);
};

export default MatchBetRules;