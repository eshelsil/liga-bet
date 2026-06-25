import React from 'react';
import { useTranslation } from 'react-i18next';


function GroupRankExplanation(){
	const { t } = useTranslation('tournamentConfig')
	return (
		<div className='LigaBet-GroupRankBetConfig LB-ScoreConfigSection'>
            <ul>
                <li>
                    <b>{t('groupRank.explanation.perfectLabel')}</b> {t('groupRank.explanation.perfectText')}
                </li>
                <li>
                    <b>{t('groupRank.explanation.minorMistakeLabel')}</b> {t('groupRank.explanation.minorMistakeText')}
                </li>
            </ul>
		</div>
	);
}


export default GroupRankExplanation;
