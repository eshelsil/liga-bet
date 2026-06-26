import React from 'react';
import { useTranslation } from 'react-i18next';


function TopScorerExplanation(){
	const { t } = useTranslation('tournamentConfig')
	return (
		<div className='LB-ScoreConfigSection'>
            <ul>
                <li>
                    {t('topScorer.explanation.line1')}
                </li>
                <li>
                    {t('topScorer.explanation.line2')}
                </li>
                <li>
                    {t('topScorer.explanation.line3')}
                </li>
            </ul>
		</div>
	);
}


export default TopScorerExplanation;
