import { Tooltip, TooltipProps } from '@mui/material';
import React, { ReactElement, ReactNode, useState } from 'react'


interface Props {
    renderChildren: ({copy}: {copy: (content: string) => void}) => ReactElement<any, any>
}

function CopyToClipboard({renderChildren}: Props){
    const [ttOpen, setTtOpen] = useState(false)

    const onTooltipClose = () => {
        setTtOpen(false)
    }

    const copy = (content: string) => {
        navigator.clipboard.writeText(content)
        setTtOpen(true)
    }
    console.log(ttOpen)

    return (
        <Tooltip
            open={ttOpen}
            title={"הועתק ✓"}
            leaveDelay={1500}
            onClose={onTooltipClose}
        >
            {renderChildren({copy})}
        </Tooltip>
    );
}

export default CopyToClipboard;
