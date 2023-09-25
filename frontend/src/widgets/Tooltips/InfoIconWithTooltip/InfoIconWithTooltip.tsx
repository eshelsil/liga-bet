import React, { ReactNode, useState } from 'react';
import { ClickAwayListener, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import './InfoIconWithTooltip.scss';


interface Props {
	tooltipContent: ReactNode,
}

function InfoIconWithTooltip({
	tooltipContent
}: Props){
	const [open, setOpen] = useState(false);
	const closeTooltip = () => setOpen(false);
	const toggleTooltip = () => setOpen(!open);
	return (
        <ClickAwayListener onClickAway={closeTooltip}>
            <Tooltip
                arrow
                open={open}
                disableFocusListener
                disableHoverListener
                disableTouchListener
                title={tooltipContent}
                classes={{tooltip: 'LigaBet-InfoIconWithTooltip-Tooltip'}}
            >
                <InfoIcon 
                    className='LigaBet-InfoIconWithTooltip'
                    color='primary'
                    onClick={toggleTooltip}
                />
            </Tooltip>
        </ClickAwayListener>
	);
}


export default InfoIconWithTooltip;