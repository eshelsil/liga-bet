import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Button, Link, ClickAwayListener, Collapse, Tooltip } from '@mui/material'
import useGoTo from '../../../hooks/useGoTo'
import { AllTournamentsData, NoSelector } from '../../../_selectors'
import { fetchAndStoreAllTournamentsDetails } from '../../../_actions/admin'
import { useSelector } from 'react-redux'
import { BetType, TournamentSummaryData, UtlRole } from '../../../types'
import { valuesOf } from '../../../utils'
import ArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import './SeeTournaments.scss'
import TournamentConfigDialog from './TournamentConfigDialog'
import CongratsAnimationDialog from './CongratsAnimationDialog'


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


function TournamentView({data}: {data: TournamentSummaryData}){
    const { t } = useTranslation('admin')
    const { id, creatorUtlId, contestants, betEntities, config, name} = data
    const creator = contestants.find(utl => utl.id === creatorUtlId)
    const [expand, setExpand] = useState(false)
    const [openConfigDialog, setOpenConfigDialog] = useState(false)
    const [openCongratsDialog, setOpenCongratsDialog] = useState(false)
    const toggleExpand = () => setExpand(!expand)
    return (
        <div className='LB-TournamentView'>
            <div className='TournameView-name'>{name}</div>
            <div className='TournamentView-content'>
                <div className='TournamentView-row'>
                    <div><b>{t('seeTournaments.creator')}</b></div>
                    {creator && (
                        <div>{creator.name}{' '}({creator.email})</div>
                    )}
                </div>
                <div className='TournamentView-row'>
                    <div className='contestantsExpandLink' onClick={toggleExpand}>
                        <b>{t('seeTournaments.participants')}</b>{' '}{contestants.length}
                        <ArrowDownIcon />
                    </div>
                    <Collapse in={expand}>
                        <div>
                        <table className='contestantsTable'>
                            <thead>
                                <tr>
                                    <th>{t('seeTournaments.name')}</th>
                                    <th>{t('seeTournaments.predictions')}</th>
                                    <th>{t('seeTournaments.permissions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contestants.map(utl => (
                                    <tr key={utl.id}>
                                        <td>
                                            <div style={utl.role === UtlRole.Rejected ? {textDecoration: 'line-through', color: 'red'} : {}}>
                                                <ClickableTooltip
                                                    content={utl.name}
                                                    tooltipContent={utl.email}
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            <div className='betsData'>
                                                <div className='betsRow'>
                                                    {t('seeTournaments.specialQuestions')}: {utl.bets[BetType.Question]}/{betEntities[BetType.Question]}
                                                </div>
                                                <div className='betsRow'>
                                                    {t('seeTournaments.groupRankings')}: {utl.bets[BetType.GroupsRank]}/{betEntities[BetType.GroupsRank]}
                                                </div>
                                                <div className='betsRow'>
                                                    {t('seeTournaments.games')}: {utl.bets[BetType.Match]}/{betEntities[BetType.Match]}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            {utl.role}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        </div>
                    </Collapse>
                    <Link onClick={()=> setOpenConfigDialog(true)} style={{ marginTop: 16, display: 'block' }}>
                        {t('seeTournaments.viewScoreConfig')}
                    </Link>
                    <Link onClick={()=> setOpenCongratsDialog(true)} style={{ marginTop: 8, display: 'block' }}>
                        {t('seeTournaments.editCongratsAnimation')}
                    </Link>
                </div>
            </div>
            <TournamentConfigDialog
                name={name}
                config={config.scores}
                open={openConfigDialog}
                onClose={() => {setOpenConfigDialog(false)}}
            />
            <CongratsAnimationDialog
                tournamentId={id}
                name={name}
                config={config.congratsAnimation}
                open={openCongratsDialog}
                onClose={() => {setOpenCongratsDialog(false)}}
            />
        </div>
    )
}


function AdminSeeTournaments({
    fetchAndStoreAllTournamentsDetails,
}) {
    const { t } = useTranslation('admin')
    const tournamentsData = useSelector(AllTournamentsData)
    const { goToAdminIndex } = useGoTo()

    useEffect(()=>{
        fetchAndStoreAllTournamentsDetails();
    }, [])

    return (
        <div className='LB-AdminSeeTournaments'>
            <h2>{t('seeTournaments.title')}</h2>
            {valuesOf(tournamentsData).map(tournament => (
                <TournamentView key={tournament.id} data={tournament} />
            ))}
            <div className='goBackButton'>
                <Button
                    variant='outlined'
                    color='primary'
                    onClick={goToAdminIndex}
                >
                    {t('buttons.back')}
                </Button>
            </div>
        </div>
    )
}

const mapDispatchToProps = {
    fetchAndStoreAllTournamentsDetails
}

export default connect(NoSelector, mapDispatchToProps)(AdminSeeTournaments)
