import React from 'react';
import { useTranslation } from 'react-i18next';

function TakanonPreviewSection({children}){
	const { t } = useTranslation('tournamentConfig');
	return (
		<div className='LigaBet-TakanonPreviewSection'>
			<h4 className='takanonDemoTitle'>{t('takanonPreview.howItLooksTitle')}</h4>
			<div>
				{children}
			</div>
		</div>
	);
}


export default TakanonPreviewSection;
