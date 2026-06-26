import React from 'react';
import { useTranslation } from 'react-i18next';


function QuestionBetExplanation(){
	const { t } = useTranslation('tournamentConfig')
	return (
		<div className='LB-ScoreConfigSection'>
            <ul>
                <li>
                    {t('specialBets.explanation.line1')}
                </li>
                <li>
                    {t('specialBets.explanation.line2')}
                </li>
            </ul>
		</div>
	);
}


export default QuestionBetExplanation;
