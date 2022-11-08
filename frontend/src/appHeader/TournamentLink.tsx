import React from 'react'
import { TournamentWithLinkedUtl } from '../types'
import MenuItem from '@mui/material/MenuItem'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { Badge } from '@mui/material';


interface Props {
    tournament: TournamentWithLinkedUtl
    selected: boolean
    onClick: () => void
    notifications?: number
}

function TournamentItemLink({
    tournament,
    selected,
    onClick,
    notifications,
}: Props) {
    const hasNotifications = notifications > 0

    return (
        <MenuItem
            className={`LigaBet-TournamentItemLink ${selected ? 'selectedTournament' : ''}`}
            onClick={onClick}
        >
            <div className='wrapper'>
                {hasNotifications && (
                    <Badge
                        color="error"
                        badgeContent={notifications}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    />
                )}
                <div className='tournamentRow'>
                    <div className='tournamentName'>
                        {tournament.name}
                    </div>
                </div>
                <div className='utlRow'>
                    <PersonOutlineIcon fill='#fff' />
                    <div className='utlName'>{tournament.linkedUtl.name}</div>
                </div>
            </div>
        </MenuItem>
    )
}

export default TournamentItemLink
