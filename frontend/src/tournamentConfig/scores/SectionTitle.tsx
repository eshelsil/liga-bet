import React, { ReactNode } from 'react';
import InfoIconWithTooltip from '../../widgets/Tooltips/InfoIconWithTooltip/InfoIconWithTooltip';


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


