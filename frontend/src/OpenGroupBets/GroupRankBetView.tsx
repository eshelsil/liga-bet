import React, { useRef, useState } from 'react'
import DraggableStandings from './DraggableStandings'
import { Grid, IconButton } from '@mui/material'
import { useIsXsScreen } from '../hooks/useMedia'
import { getHebGroupName } from '../strings/groups'
import { useTournamentThemeClass } from '../hooks/useTournamentTheme'
import { AddCircle } from '@mui/icons-material'
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { LoadingButton } from '../widgets/Buttons'


function GroupRankBetView({ groupWithBet, sendGroupRankBet }) {
    const { name, id, bet, teams } = groupWithBet
    const lastEditOpen = useRef<number>()
    const [edit, setEdit] = useState(false)
    const [standingsInput, setStandingsInput] = useState(null)
    const tournamentClass = useTournamentThemeClass();
    const isXsScreen = useIsXsScreen();
    const teamsByRank = bet?.standings || teams
    const groupStandings = standingsInput || teamsByRank
    const hideStandings = !bet && !edit


    const openEditMode = () => {
        lastEditOpen.current = Number(new Date())
        setEdit(true)
    }
    const exitEditMode = () => setEdit(false)
    const sendBet = async () => {
        const ts = lastEditOpen.current
        await sendGroupRankBet({ groupId: id, standings: groupStandings })
        if (ts === lastEditOpen.current) {
            exitEditMode()
        }
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
                                onClick={openEditMode}
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
                                <LoadingButton
                                    action={sendBet}
                                >
                                    שלח
                                </LoadingButton>
                                <IconButton className='iconGoBack' onClick={exitEditMode}>
                                    <CloseIcon />
                                </IconButton>
                            </>)}
                            {!edit && (
                                <IconButton onClick={openEditMode}>
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