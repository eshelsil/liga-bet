import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Button, ClickAwayListener, Collapse, Tooltip } from '@mui/material'
import useGoTo from '../../../hooks/useGoTo'
import { AllTournamentsData, NoSelector } from '../../../_selectors'
import { fetchAndStoreAllTournamentsDetails } from '../../../_actions/admin'
import { useSelector } from 'react-redux'
import { BetType, DetailedTournamentData } from '../../../types'
import { valuesOf } from '../../../utils'
import ArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import './SeeTournaments.scss'


function ClickableTooltip({
	content,
    tooltipContent,
}){
	const [open, setOpen] = useState(false);
	const closeTooltip = () => setOpen(false);
	const toggleTooltip = () => setOpen(!open);
	return (
        <ClickAwayListener onClickAway={closeTooltip}>
            <Tooltip
                arrow
                open={open}
                disableFocusListener
                disableHoverListener
                disableTouchListener
                title={tooltipContent}
                classes={{tooltip: 'LigaBet-InfoIconWithTooltip-Tooltip'}}
            >
                <div 
                    onClick={toggleTooltip}
                >
                    {content}
                </div>
            </Tooltip>
        </ClickAwayListener>
	);
}


function TournamentView({data}: {data: DetailedTournamentData}){
    const { creatorUtlId, contestants, betEntities, config, name} = data
    const creator = contestants.find(utl => utl.id === creatorUtlId)
    const [expand, setExpand] = useState(false)
    const toggleExpand = () => setExpand(!expand)
    return (
        <div className='LB-TournamentView'>
            <div className='TournameView-name'>{name}</div>
            <div className='TournamentView-content'>
                <div className='TournamentView-row'>
                    <div><b>יוצר</b></div>
                    {creator && (
                        <div>{creator.name}{' '}({creator.email})</div>
                    )}
                </div>
                <div className='TournamentView-row'>
                    <div className='contestantsExpandLink' onClick={toggleExpand}>
                        <b>משתתפים:</b>{' '}{contestants.length}
                        <ArrowDownIcon />
                    </div>
                    <Collapse in={expand}>
                        <div>
                        <table className='contestantsTable'>
                            <thead>
                                <th>שם</th>
                                <th>ניחושים</th>
                            </thead>
                            <tbody>
                                {contestants.map(utl => (
                                    <tr key={utl.id}>
                                        <td>
                                            <ClickableTooltip
                                                content={utl.name}
                                                tooltipContent={utl.email}
                                            />
                                        </td>
                                        <td>
                                            <div className='betsData'>
                                                <div className='betsRow'>
                                                    שאלות מיוחדות: {utl.bets[BetType.Question]}/{betEntities[BetType.Question]}
                                                </div>
                                                <div className='betsRow'>
                                                    דירוגי בתים: {utl.bets[BetType.GroupsRank]}/{betEntities[BetType.GroupsRank]}
                                                </div>
                                                <div className='betsRow'>
                                                    משחקים: {utl.bets[BetType.Match]}/{betEntities[BetType.Match]}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        </div>
                    </Collapse>
                </div>
            </div>
        </div>
    )
}


function AdminSeeTournaments({
    fetchAndStoreAllTournamentsDetails,
}) {
    const tournamentsData = useSelector(AllTournamentsData)
    const { goToAdminIndex } = useGoTo()

    useEffect(()=>{
        fetchAndStoreAllTournamentsDetails();
    }, [])

    return (
        <div className='LB-AdminSeeTournaments'>
            <h2>טורנירים רצים</h2>
            {valuesOf(tournamentsData).map(tournament => (
                <TournamentView key={tournament.id} data={tournament} />
            ))}
            <div className='goBackButton'>
                <Button
                    variant='outlined'
                    color='primary'
                    onClick={goToAdminIndex}
                >
                    חזור
                </Button>
            </div>
        </div>
    )
}

const mapDispatchToProps = {
    fetchAndStoreAllTournamentsDetails
}

export default connect(NoSelector, mapDispatchToProps)(AdminSeeTournaments)
