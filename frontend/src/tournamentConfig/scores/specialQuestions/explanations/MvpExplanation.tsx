import React from 'react';
import { useTranslation } from 'react-i18next';


function MvpExplanation(){
	const { t } = useTranslation('tournamentConfig')
	return (
		<div className='LB-ScoreConfigSection'>
            <ul>
                <li>
                    {t('mvp.explanation')}
                </li>
            </ul>
		</div>
	);
}


export default MvpExplanation;
