import React from 'react'
import Menu from '@mui/material/Menu'
import { PopupMenuProps } from './types'
import './PopupMenu.scss'
import { cn } from '@/utils/tailwind'

function PopupMenu({
    anchorContent,
    children,
    classes,
    onClose,
    anchorClassName,
}: PopupMenuProps) {
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement>(null)
    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
        onClose && onClose()
    }

    return (
        <div className="LigaBet-PopupMenu">
            <div
                onClick={handleClick}
                className={cn('clickableWrapper', anchorClassName)}
            >
                {anchorContent}
            </div>
            <Menu
                anchorEl={anchorEl}
                open={!!anchorEl}
                onClose={handleClose}
                classes={{
                    ...classes,
                    root: `LigaBet-PopupMenu-root ${classes?.root ?? ''}`,
                    list: `LigaBet-PopupMenu-list ${classes?.list ?? ''}`,
                }}
                MenuListProps={{
                    onClick: handleClose,
                }}
            >
                {children}
            </Menu>
        </div>
    )
}

export default PopupMenu
