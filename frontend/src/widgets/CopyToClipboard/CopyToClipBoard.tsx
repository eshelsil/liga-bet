import { Tooltip, TooltipProps } from '@mui/material';
import React, { ReactElement, ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'


interface Props {
    renderChildren: ({copy}: {copy: (content: string) => void}) => ReactElement<any, any>
    title?: string
}

function CopyToClipboard({renderChildren, title}: Props){
    const { t } = useTranslation('widgets')
    const [ttOpen, setTtOpen] = useState(false)

    const onTooltipClose = () => {
        setTtOpen(false)
    }

    const copy = (content: string) => {
        navigator.clipboard.writeText(content)
        setTtOpen(true)
    }

    return (
        <Tooltip
            open={ttOpen}
            title={title ?? t('copyToClipboard.copied')}
            leaveDelay={1500}
            onClose={onTooltipClose}
        >
            {renderChildren({copy})}
        </Tooltip>
    );
}

export default CopyToClipboard;
