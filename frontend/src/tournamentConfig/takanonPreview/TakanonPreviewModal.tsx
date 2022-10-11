import React, { useState } from 'react';
import { Dialog, Link } from '@mui/material';


function TakanonPreviewModal({children}){
	const [modalOpen, setModalOpen] = useState(false);
	const openModal = () => setModalOpen(true);
	const closeModal = () => setModalOpen(false);
	return (
		
		<div className='LigaBet-TakanonPreviewModal'>
			<Link className={'openTakanonDemoLink'} onClick={openModal}>איך זה יראה בתקנון</Link>
			<Dialog
				open={modalOpen}
				onClose={closeModal}
				classes={{root: 'LigaBet-TakanonPreviewSection-Dialog'}}
			>
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