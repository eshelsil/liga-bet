import React from 'react';
import { useTranslation } from 'react-i18next';


function MatchBetsExplanation(){
	const { t } = useTranslation('tournamentConfig')
	return (
		<div className='LigaBet-MatchBetsExplanation LB-ScoreConfigSection'>
            <ul>
                <li>
                    {t('matchBets.explanation.line1')}
                </li>
                <li>
                    {t('matchBets.explanation.line2')}
                </li>
                <li>
                    {t('matchBets.explanation.line3')}
                </li>
                <li>
                    {t('matchBets.explanation.line4')}
                </li>
                <li>
                    {t('matchBets.explanation.line5')}
                </li>
            </ul>
		</div>
	);
}


export default MatchBetsExplanation;
