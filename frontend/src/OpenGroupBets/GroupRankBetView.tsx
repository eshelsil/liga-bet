import React, { useState } from 'react'
import DraggableStandings from './DraggableStandings'
import { Button, Grid, IconButton } from '@mui/material'
import { useIsXsScreen } from '../hooks/useMedia'
import { getHebGroupName } from '../strings/groups'
import { useTournamentThemeClass } from '../hooks/useTournamentTheme'
import { AddCircle } from '@mui/icons-material'
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';


function GroupRankBetView({ groupWithBet, sendGroupRankBet }) {
    const { name, id, bet, teams } = groupWithBet
    const [edit, setEdit] = useState(false)
    const [standingsInput, setStandingsInput] = useState(null)
    const tournamentClass = useTournamentThemeClass();
    const isXsScreen = useIsXsScreen();
    const teamsByRank = bet?.standings || teams
    const groupStandings = standingsInput || teamsByRank
    const hideStandings = !bet && !edit


    const exitEditMode = () => setEdit(false)
    const sendBet = () => {
        sendGroupRankBet({ groupId: id, standings: groupStandings })
        exitEditMode()
    }
    return (
        <Grid item xs={isXsScreen ? 12 : null}>
            <div className={'LB-GroupRankBetView'}>
                <div className={`GroupRankBetView-header ${tournamentClass}`}>
                    <h4 className="name">{getHebGroupName(name)}</h4>
                </div>
                <div className={`GroupRankBetView-content ${edit ? 'onEdit' : ''}`}>
                    {hideStandings && (
                        <div className="noBet">
                            <AddCircle
                                color='primary'
                                onClick={()=> setEdit(true)}
                                style={{fontSize: 48}}
                            />
                        </div>
                    )}
                    {!hideStandings && (<>
                        <DraggableStandings
                            items={groupStandings}
                            setItems={setStandingsInput}
                            isDisabled={!edit}
                        />
                        <div className={`buttonContainer`}>
                            {edit && (<>
                                <Button
                                    variant='contained'
                                    color='primary'
                                    onClick={sendBet}
                                >
                                    שלח
                                </Button>
                                <IconButton className='iconGoBack' onClick={exitEditMode}>
                                    <CloseIcon />
                                </IconButton>
                            </>)}
                            {!edit && (
                                <IconButton onClick={()=> setEdit(true)}>
                                    <EditIcon />
                                </IconButton>
                            )}
                        </div>
                    </>)}
                </div>
            </div>

        </Grid>
    )
}

export default GroupRankBetView