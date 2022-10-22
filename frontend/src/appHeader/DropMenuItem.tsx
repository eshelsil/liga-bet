import React from 'react'
import MenuItem from '@mui/material/MenuItem'
import PopupMenu, { PopupMenuProps } from '../widgets/Menu'
import useActivePath from '../hooks/useActivePath'

interface Props extends PopupMenuProps {
    pathes?: string[]
    isActive?: boolean
}

function DropMenuItem({
    pathes,
    ...popupMenuProps
}: Props) {
    const isActive = useActivePath(pathes ?? [])
    return (
        <MenuItem className={`LigaBet-DropMenuItem ${isActive ? 'LB-ActivePathItem': ''}`}>
            <PopupMenu {...popupMenuProps} />
        </MenuItem>
    )
}

export default DropMenuItem
