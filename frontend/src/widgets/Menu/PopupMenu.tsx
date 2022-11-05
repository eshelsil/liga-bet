import React from 'react'
import Menu from '@mui/material/Menu'
import { PopupMenuProps } from './types'
import './PopupMenu.scss'



function PopupMenu({ anchorContent, children, classes }: PopupMenuProps) {
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement>(null)
    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    return (
        <div className="LigaBet-PopupMenu">
            <div onClick={handleClick} className="clickableWrapper">
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
