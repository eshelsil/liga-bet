import React, { ReactNode } from 'react'
import MenuItem from '@mui/material/MenuItem'
import { Menu } from '@mui/material'

interface Props {
    label: string | ReactNode
    children: ReactNode
    className?: string
}

const DropMenuItem = ({ label, children, className }: Props) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    return (
        <MenuItem
            id="menu-button"
            className="LigaBet-DropMenuItem"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            classes={{ root: className || '' }}
        >
            <div onClick={handleClick} className="labelWrapper">
                {label}
            </div>
            <Menu
                anchorEl={anchorEl}
                open={!!anchorEl}
                onClose={handleClose}
                id="basic-menu"
                MenuListProps={{
                    'aria-labelledby': 'menu-button',
                    className: 'LigaBet-Menu',
                    onClick: handleClose,
                }}
            >
                {children}
            </Menu>
        </MenuItem>
    )
}

export default DropMenuItem
