import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import DraggableStandings from './DraggableStandings'
import { Grid, IconButton, Switch } from '@mui/material'
import { useIsXsScreen } from '../hooks/useMedia'
import { getHebGroupName } from '../strings/groups'
import { useTournamentThemeClass } from '../hooks/useTournamentTheme'
import { AddCircle } from '@mui/icons-material'
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { LoadingButton } from '../widgets/Buttons'
import useCancelEdit from '../hooks/useCancelEdit'
import { IsMultiBetDefaultForAll, MyOtherBettableUTLs } from '../_selectors'


function GroupRankBetView({ groupWithBet, sendGroupRankBet }) {    
    const { name, id, bet, teams } = groupWithBet

    const otherTournaments = useSelector(MyOtherBettableUTLs);
    const hasOtherTournaments = otherTournaments.length > 0;
    const isMultiBetDefault = useSelector(IsMultiBetDefaultForAll)
    const [edit, setEdit] = useState(false)
    const [forAllTournaments, setForAllTournaments] = useState(isMultiBetDefault)
    const { getLastEditTs, cancelEdit } = useCancelEdit({edit, setEdit})
    const [standingsInput, setStandingsInput] = useState(null)
    const tournamentClass = useTournamentThemeClass();
    const isXsScreen = useIsXsScreen();
    const teamsByRank = bet?.standings || teams
    const groupStandings = standingsInput || teamsByRank
    const hideStandings = !bet && !edit


    const openEditMode = () => {
        setEdit(true)
    }
    const exitEditMode = () => setEdit(false)
    const sendBet = async () => {
        const ts = getLastEditTs()
        await sendGroupRankBet({ groupId: id, standings: groupStandings, forAllTournaments })
            .then(function (data) {
                let text = 'ההימור נשלח'
                if (forAllTournaments){
                    text += ` עבור ${otherTournaments.length + 1} טורנירים`
                }
                window['toastr']['success'](text)
                cancelEdit(ts)
            })
            .catch(function (error) {
                console.log('FAILED sending bet', error)
            })
    }

    useEffect(()=> {
        if (!edit) {
            setStandingsInput(teamsByRank)
        }
        setForAllTournaments(isMultiBetDefault)
    }, [edit, isMultiBetDefault, setForAllTournaments])

    return (
        <Grid item xs={isXsScreen ? 12 : null}>
            <div className={`LB-GroupRankBetView LB-EditableBetView ${tournamentClass} ${(edit && forAllTournaments) ? 'sendingforAllTournaments' : ''}`}>
                <div className={`EditableBetView-header`}>
                    <h4 className="name">{getHebGroupName(name)}</h4>
                    {edit && hasOtherTournaments && (
                        <Switch
                            className='forAllTournamentsInput'
                            checked={forAllTournaments}
                            onChange={(e, value) => setForAllTournaments(value)}
                        />
                    )}
                </div>
                <div className={`GroupRankBetView-content ${edit ? 'onEdit' : ''}`}>
                    {hideStandings && (
                        <div className="noBet">
                            <AddCircle
                                color={forAllTournaments ? 'secondary' : 'primary'}
                                onClick={openEditMode}
                                style={{fontSize: 48}}
                            />
                        </div>
                    )}
                    {!hideStandings && (<>
                        <DraggableStandings
                            items={edit ? groupStandings : teamsByRank}
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