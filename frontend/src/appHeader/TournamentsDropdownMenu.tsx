import React, { useState } from 'react'
import DropMenuItem from './DropMenuItem'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import HistoryIcon from '@mui/icons-material/History';
import RedoIcon from '@mui/icons-material/Redo';
import { connect, useSelector } from 'react-redux'
import { CurrentTournament, NoSelector, CanCreateNewTournament, CanJoinAnotherTournament, Notifications, HasNotificationsOnOtherTournaments, OldUTLsByCompetitionId, LiveUTLsByCompetitionId, HasOpenCompetitions } from '../_selectors'
import { selectUtl } from '../_actions/tournamentUser'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import TournamentItemLink from './TournamentLink'
import useGoTo from '../hooks/useGoTo';
import EmojiEventsOutlined from '@mui/icons-material/EmojiEventsOutlined'
import { orderBy } from 'lodash';
import { Badge } from '@mui/material';
import { keysOf, valuesOf } from '../utils';


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

    const oldUtlsByCompId = useSelector(OldUTLsByCompetitionId);
    const liveUtlsByCompId = useSelector(LiveUTLsByCompetitionId);
    const selectedTournament = useSelector(CurrentTournament);
    const notificaitons = useSelector(Notifications);
    const hasOpenCompetitions = useSelector(HasOpenCompetitions);
    const hasNotificationsOnOtherTournaments = useSelector(HasNotificationsOnOtherTournaments)
    const canJoinAnotherTournament = useSelector(CanJoinAnotherTournament);
    const canCreateNewTournament = useSelector(CanCreateNewTournament);

    const [isLive, setIsLive] = useState(true)
    const utlsByCompId = isLive ? liveUtlsByCompId : oldUtlsByCompId
    const hasOldBets = keysOf(oldUtlsByCompId).length > 0
    const showHistoryButton = isLive && hasOldBets
    const showLiveButton = !isLive

    const competitions = valuesOf(utlsByCompId).map(utls => utls[0].tournament.competition);
    const sortedCompetitions = orderBy(competitions, comp => comp.startTime, 'desc');
    

    const showNotifciations = isLive && hasNotificationsOnOtherTournaments

    

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
    const toggleHistoryMode = () => {
        setIsLive(!isLive)
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
            {sortedCompetitions.map(competition => (
                <div key={competition.id} className="TournamentMenu-Competition">
                    <div onClick={(e) => e.stopPropagation()} className="TournamentMenu-CompetitionTitle">{competition.name}</div>
                    {orderBy(utlsByCompId[competition.id], 'createdAt').map(utl => (
                        <TournamentItemLink
                            key={utl.tournament.id}
                            tournament={{...utl.tournament, linkedUtl: utl}}
                            selected={utl.tournament.id === selectedTournament.id}
                            onClick={() => onTournamentItemClick(utl.id)}
                            notifications={showNotifciations ? notificaitons[utl.tournament.id] : 0}
                        />
                    ))}
                </div>
            ))}
            {showHistoryButton && (
                <div
                    className={`buttonLink`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className='changeLiveMode' onClick={toggleHistoryMode}>
                        <HistoryIcon />
                        Show history
                    </div>
                </div>
            )}
            {showLiveButton && (
                <div
                    className={`buttonLink`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className='changeLiveMode' onClick={toggleHistoryMode}>
                        <RedoIcon />
                        Show Live
                    </div>
                </div>
            )}
            {isLive && (<div>
                {canJoinAnotherTournament && hasOpenCompetitions && (
                    <MenuItem
                        className={`buttonLink`}
                        onClick={joinTournament}
                    >
                        <Button variant='contained' color='primary'>
                            הצטרף לטורניר נוסף
                        </Button>
                    </MenuItem>
                )}
                {canCreateNewTournament && hasOpenCompetitions && (
                    <MenuItem
                        className={`buttonLink`}
                        onClick={createTournament}
                    >
                        <Button variant='contained' color='primary'>
                                צור טורניר חדש
                        </Button>
                    </MenuItem>
                )}
            </div>)}
        </DropMenuItem>
    )
}

const mapDispatchToProps = {
    selectUtl,
};

export default connect(NoSelector, mapDispatchToProps)(TournamentsDropdownMenu)
