import React, { ReactNode, useState } from 'react';
import { Dialog, Link, Modal } from '@mui/material';
import InfoIconWithTooltip from '../../widgets/inputs/InfoIconWithTooltip/InfoIconWithTooltip';


interface Props {
    title: string,
    tooltipContent: ReactNode,
}

function SectionTitle({
    title,
    tooltipContent
}: Props){
	return (
		<div className='ScoreConfig-SectionTitle'>
            <h4>{title}</h4>
            <InfoIconWithTooltip
                tooltipContent={tooltipContent}
            />
        </div>
	);
}


export default SectionTitle;


