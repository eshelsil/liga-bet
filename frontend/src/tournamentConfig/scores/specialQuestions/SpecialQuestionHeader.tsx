import React, { ReactNode } from 'react';
import { Switch } from '@mui/material';
import InfoIconWithTooltip from '../../../widgets/inputs/InfoIconWithTooltip/InfoIconWithTooltip';


interface Props {
    title: string,
    tooltipContent: ReactNode,
    switchProps: {
        checked: boolean,
        onChange: any,
        disabled?: boolean,
    },
}

function SpecialQuestionHeader({
    title,
    tooltipContent,
    switchProps,
} : Props) {
	return (
		<div className='ScoresConfig-SpecialQuestionHeader'>
            <Switch {...switchProps} />
            <h5>{title}</h5>
            <InfoIconWithTooltip
                tooltipContent={tooltipContent}
            />
        </div>
	);
}


export default SpecialQuestionHeader;


