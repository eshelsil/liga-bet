import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, Link } from '@mui/material';
import CloseIcon from '@mui/icons-material/CloseRounded'
import { cn } from '@/utils';



function TakanonPreviewModal({children, label, className}: {children: any, label?: string, className?: string}){
	const { t } = useTranslation('tournamentConfig');
	const [modalOpen, setModalOpen] = useState(false);
	const openModal = () => setModalOpen(true);
	const closeModal = () => setModalOpen(false);
	return (
		
		<div className={cn('LigaBet-TakanonPreviewModal', className)}>
			<Link className={'openTakanonDemoLink'} onClick={openModal}>{label ?? t('takanonPreview.howItLooks')}</Link>
			<Dialog
				open={modalOpen}
				onClose={closeModal}
				classes={{root: 'LigaBet-TakanonPreviewSection-Dialog'}}
			>
				<div className='closeButtonContainer'>
					<CloseIcon onClick={closeModal}/>
				</div>
				<div className='dialogContent'>
					<div className='takanonDemo'>
						{children}
					</div>
				</div>

			</Dialog>
		</div>
	);
}


export default TakanonPreviewModal;