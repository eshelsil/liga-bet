import React from 'react';
import { useTranslation } from 'react-i18next';


function RoadToFinalExplanation(){
	const { t } = useTranslation('tournamentConfig')
	return (
		<div className='LB-ScoreConfigSection'>
            <ul>
                <li>
                    {t('roadToFinal.explanation.line1')}
                </li>
                <li>
                    {t('roadToFinal.explanation.line2')}
                </li>
            </ul>
		</div>
	);
}


export default RoadToFinalExplanation;
