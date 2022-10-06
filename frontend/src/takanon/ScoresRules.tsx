import React from 'react';
import { GroupWithTeams, Tournament } from '../types';
import GroupStageRules from './GroupStageRules';
import MatchBetRules from './matches/MatchBetRules';
import SpecialQuestionsRules from './specialQuestions/SpecialQuestionsRules';


function ScoresRules({
    tournament,
    groupStageGamesCount,
    knockoutGamesCount,
    groupsCount,
    exampleGroup,
} : {
    tournament: Tournament,
    groupStageGamesCount: number,
    knockoutGamesCount: number,
    groupsCount: number,
    exampleGroup: GroupWithTeams,
}) {
    const homeTeam = exampleGroup?.teams[0];
    const awayTeam = exampleGroup?.teams[1];
    return (<>
            <h3 style={{marginBottom: 20}}>ניקוד</h3>
            <MatchBetRules 
                groupStageGamesCount={groupStageGamesCount}
                knockoutGamesCount={knockoutGamesCount}
                homeTeam={homeTeam}
                awayTeam={awayTeam}
                tournament={tournament}
            />
            {exampleGroup && (
                <GroupStageRules
                    exampleGroup={exampleGroup}
                    groupsCount={groupsCount}
                    scoreConfig={tournament.config.groupRankBets}
                />
            )}
            <SpecialQuestionsRules config={tournament.config.specialBets} />
    </>);
};

export default ScoresRules;