import React, { HTMLAttributes, useEffect, useRef, useState } from 'react';
import { Tooltip } from '@mui/material';
import './EllipsisTooltip.scss';


interface Props extends HTMLAttributes<HTMLDivElement> {
	text: string,
}

function EllipsisTooltip({
	children,
    ...props
}: HTMLAttributes<HTMLDivElement>){
    const { className, ...restProps} = props
    const textElementRef = useRef<HTMLDivElement>();
    const [isOverflowed, setIsOverflow] = useState(false);

    useEffect(() => {
        setIsOverflow(textElementRef.current.scrollWidth > textElementRef.current.clientWidth);
    }, []);

	return (
        <Tooltip
                arrow
                disableHoverListener={!isOverflowed}
                placement='top'
                title={children}
                classes={{tooltip: 'LigaBet-EllipsisTooltip-Tooltip'}}
            >
            <div
                className={`EllipsisTooltip-text ${className ?? ''}`}
                {...restProps}
                ref={textElementRef}
            >
                {children}
            </div>
        </Tooltip>
	);
}


export default EllipsisTooltip;