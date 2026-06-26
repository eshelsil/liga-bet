import React from 'react';
import { useTranslation } from 'react-i18next';


function OffensiveTeamExplanation(){
	const { t } = useTranslation('tournamentConfig')
	return (
		<div className='LB-ScoreConfigSection'>
            <ul>
                <li>
                    {t('offensiveTeam.explanation')}
                </li>
            </ul>
		</div>
	);
}


export default OffensiveTeamExplanation;
