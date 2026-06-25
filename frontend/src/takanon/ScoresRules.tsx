import React from 'react';
import { useTranslation } from 'react-i18next';
import GroupStageRules from './groupStandings/GroupStageRulesProvider';
import MatchBetRules from './matches/MatchBetRulesProvider';
import SpecialQuestionsRules from './specialQuestions/SpecialQuestionsRules';


function ScoresRules() {
    const { t } = useTranslation('takanon');
    return (<>
            <h3 className='LB-TitleText' style={{marginBottom: 20}}>{t('scores.heading')}</h3>
            <MatchBetRules />
            <GroupStageRules />
            <SpecialQuestionsRules />
    </>);
};

export default ScoresRules
