import React from 'react'
import DropMenuItem from './DropMenuItem'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { connect, useSelector } from 'react-redux'
import { CurrentTournament, NoSelector, TournamentsWithMyUtl, CanCreateNewTournament, CanJoinAnotherTournament } from '../_selectors'
import { selectUtl } from '../_actions/tournamentUser'
import { Button, MenuItem } from '@mui/material'
import TournamentItemLink from './TournamentLink'
import useGoTo from '../hooks/useGoTo';
import { orderBy } from 'lodash';

interface Props {
    selectUtl: (id: number) => void
    itemClickCallback?: () => void
}

function TournamentsDropdownMenu({
    selectUtl,
    itemClickCallback,
}: Props) {
    const { goToJoinTournament, goToCreateTournament } = useGoTo()
    const tournamentsById = useSelector(TournamentsWithMyUtl);
    const selectedTournament = useSelector(CurrentTournament);
    const canJoinAnotherTournament = useSelector(CanJoinAnotherTournament);
    const canCreateNewTournament = useSelector(CanCreateNewTournament);
    const tournaments = Object.values(tournamentsById);
    const sortedTournaments = orderBy(tournaments, t => t.linkedUtl.createdAt)

    const onTournamentItemClick = (utlId: number) => {
        selectUtl(utlId)
        itemClickCallback && itemClickCallback()
    }
    const joinTournament = () => {
        itemClickCallback && itemClickCallback()
        goToJoinTournament()
    }
    const createTournament = () => {
        itemClickCallback && itemClickCallback()
        goToCreateTournament()
    }
    
    return (
        <DropMenuItem
            anchorContent={
                <div className='flexRow'>
                    <div>
                        טורנירים
                    </div>
                    <ArrowDropDownIcon />
                </div>
            }
            classes={{list: 'tournamentsMenu'}}
        >
            {sortedTournaments.map(tournament => (
                <TournamentItemLink
                    key={tournament.id}
                    tournament={tournament}
                    selected={tournament.id === selectedTournament.id}
                    onClick={() => onTournamentItemClick(tournament.linkedUtl.id)}
                />
            ))}
            {canJoinAnotherTournament && (
                <MenuItem
                    className={`buttonLink`}
                    onClick={joinTournament}
                >
                    <Button variant='contained' color='primary'>
                        הצטרף לטורניר נוסף
                    </Button>
                </MenuItem>
            )}
            {canCreateNewTournament && (
                <MenuItem
                    className={`buttonLink`}
                    onClick={createTournament}
                >
                    <Button variant='contained' color='primary'>
                            צור טורניר חדש
                    </Button>
                </MenuItem>
            )}
        </DropMenuItem>
    )
}

const mapDispatchToProps = {
    selectUtl,
};

export default connect(NoSelector, mapDispatchToProps)(TournamentsDropdownMenu)
