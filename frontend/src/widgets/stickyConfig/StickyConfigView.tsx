import React, { ReactNode } from 'react'
import { IconButton } from '@mui/material'
import PinnedIcon from '@mui/icons-material/PushPin'
import UnPinnedIcon from '@mui/icons-material/PushPinOutlined'
import './StickyConfig.scss'


interface Props {
    pinned: boolean
    setPinned: (val: boolean) => void
    children?: ReactNode
    header?: ReactNode
    className?: string
}

function StickyConfigView({
    pinned,
    setPinned,
    children,
    header,
    className,
}: Props) {
    const pinClass = pinned ? 'StickyConfig-pinned' : ''
    const togglePinned = () => setPinned(!pinned)


    return (
        <div className={`LB-StickyConfig ${className ?? ''} ${pinClass}`}>
            <div className='StickyConfig-content'>
                <div className='StickyConfig-headerWrapper'>
                    <IconButton className='StickyConfig-pinIcon' onClick={togglePinned}>
                        {pinned ? <PinnedIcon /> : <UnPinnedIcon />}
                    </IconButton>
                    <div className='StickyConfig-header'>
                        {header}
                    </div>
                </div>
                <div className='StickyConfig-form'>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default StickyConfigView
