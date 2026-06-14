import React from 'react'
import { Drawer, List, ListItemButton, ListItemText } from '@mui/material'
import { useHistory } from 'react-router-dom'
import { TournamentNavItem } from './useTournamentNavItems'

interface Props {
    open: boolean
    onClose: () => void
    items: TournamentNavItem[]
}

function AppBottomNavMore({ open, onClose, items }: Props) {
    const history = useHistory()

    const handleItemClick = (item: TournamentNavItem) => {
        if (item.onClick) {
            item.onClick()
        } else {
            history.push(`/${item.route.path}`)
        }
        onClose()
    }

    return (
        <Drawer
            anchor="bottom"
            open={open}
            onClose={onClose}
            className="AppBottomNavMore"
            PaperProps={{ className: 'AppBottomNavMore-paper' }}
        >
            <div className="AppBottomNavMore-handle" />
            <List className="AppBottomNavMore-list">
                {items.map((item) => (
                    <ListItemButton
                        key={item.id}
                        onClick={() => handleItemClick(item)}
                    >
                        <ListItemText primary={item.route.label} />
                    </ListItemButton>
                ))}
            </List>
        </Drawer>
    )
}

export default AppBottomNavMore
