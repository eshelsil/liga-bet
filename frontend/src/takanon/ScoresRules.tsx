import React from 'react';
import GroupStageRules from './groupStandings/GroupStageRulesProvider';
import MatchBetRules from './matches/MatchBetRulesProvider';
import SpecialQuestionsRules from './specialQuestions/SpecialQuestionsRules';


function ScoresRules() {
    return (<>
            <h3 className='LB-TitleText' style={{marginBottom: 20}}>ניקוד</h3>
            <MatchBetRules />
            <GroupStageRules />
            <SpecialQuestionsRules />
    </>);
};

export default ScoresRules
