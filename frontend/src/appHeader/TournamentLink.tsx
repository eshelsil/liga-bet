import React from 'react'
import { TournamentWithLinkedUtl } from '../types'
import MenuItem from '@mui/material/MenuItem'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';


interface Props {
    tournament: TournamentWithLinkedUtl
    selected: boolean
    onClick: () => void
}

function TournamentItemLink({
    tournament,
    selected,
    onClick,
}: Props) {

    return (
        <MenuItem
            className={`LigaBet-TournamentItemLink ${selected ? 'selectedTournament' : ''}`}
            onClick={onClick}
        >
            <div className='wrapper'>
                <div className='tournamentRow'>
                    {tournament.name}
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
