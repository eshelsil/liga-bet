import React from 'react';
import { useTranslation } from 'react-i18next';


function TopAssistsExplanation(){
	const { t } = useTranslation('tournamentConfig')
	return (
		<div className='LB-ScoreConfigSection'>
            <ul>
                <li>
                    {t('topAssists.explanation.line1')}
                </li>
                <li>
                    {t('topAssists.explanation.line2')}
                </li>
                <li>
                    {t('topAssists.explanation.line3')}
                </li>
            </ul>
		</div>
	);
}


export default TopAssistsExplanation;
