import React from 'react'
import DropMenuItem from './DropMenuItem'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { connect, useSelector } from 'react-redux'
import { CurrentTournament, NoSelector, TournamentsWithMyUtl, CanCreateNewTournament, CanJoinAnotherTournament, Notifications, HasNotificationsOnOtherTournaments } from '../_selectors'
import { selectUtl } from '../_actions/tournamentUser'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import TournamentItemLink from './TournamentLink'
import useGoTo from '../hooks/useGoTo';
import EmojiEventsOutlined from '@mui/icons-material/EmojiEventsOutlined'
import { orderBy } from 'lodash';
import { Badge } from '@mui/material';
import { isTournamentStarted } from '../utils';


function IconWithNotification({hasNotifications}: {hasNotifications: boolean}){
    return (<>
        {hasNotifications && (
            <Badge color='error' overlap='circular' variant='dot' badgeContent=' '>
                <EmojiEventsOutlined />
            </Badge>
        )}
        {!hasNotifications && (
            <EmojiEventsOutlined />
        )}
    </>)
}

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
    const notificaitons = useSelector(Notifications);
    const hasNotificationsOnOtherTournaments = useSelector(HasNotificationsOnOtherTournaments)
    const canJoinAnotherTournament = useSelector(CanJoinAnotherTournament);
    const canCreateNewTournament = useSelector(CanCreateNewTournament);

    const tournaments = Object.values(tournamentsById);
    const sortedTournaments = orderBy(tournaments, t => t.linkedUtl.createdAt)
    const hasOnlyOneTournamnet = tournaments.length === 1
    const showNotifciations = !hasOnlyOneTournamnet && hasNotificationsOnOtherTournaments

    const tournamentStarted = isTournamentStarted(selectedTournament)
    

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
                    <ArrowDropDownIcon />
                    <IconWithNotification hasNotifications={showNotifciations} />
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
                    notifications={showNotifciations ? notificaitons[tournament.id] : 0}
                />
            ))}
            {canJoinAnotherTournament && !tournamentStarted && (
                <MenuItem
                    className={`buttonLink`}
                    onClick={joinTournament}
                >
                    <Button variant='contained' color='primary'>
                        הצטרף לטורניר נוסף
                    </Button>
                </MenuItem>
            )}
            {canCreateNewTournament && !tournamentStarted && (
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
