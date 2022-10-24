import React from 'react';
import { TournamentScoreConfig } from '../types';
import GroupStageRules from './groupStandings/GroupStageRulesProvider';
import MatchBetRules from './matches/MatchBetRulesProvider';
import SpecialQuestionsRules from './specialQuestions/SpecialQuestionsRules';


function ScoresRules({
    config,
} : {
    config: TournamentScoreConfig,
}) {
    return (<>
            <h3 style={{marginBottom: 20}}>ניקוד</h3>
            <MatchBetRules 
                scoreConfig={config.gameBets}
            />
            <GroupStageRules
                scoreConfig={config.groupRankBets}
            />
            <SpecialQuestionsRules config={config.specialBets} />
    </>);
};

export default ScoresRules
