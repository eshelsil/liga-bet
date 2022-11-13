import React, { useEffect, useState } from 'react'
import { useTournamentThemeClass } from '../hooks/useTournamentTheme'
import { MatchWithABet, WinnerSide } from '../types'
import { DEFAULT_DATE_FORMAT, DEFAULT_TIME_FORMAT } from '../utils/index'
import TeamWithFlag from '../widgets/TeamFlag/TeamWithFlag'
import CurrentBetView from './CurrentBetView'
import EditMatchBetView from './EditMatchBetView'
import dayjs from 'dayjs'
import useCancelEdit from '../hooks/useCancelEdit'
import { useSelector } from 'react-redux'
import { IsMultiBetDefaultForAll, MyOtherBettableUTLs } from '../_selectors'
import { Switch } from '@mui/material'
import '../styles/openBets/EditableBetView.scss'



function OpenMatchBetView({
    match,
    sendBet,
}: {
    match: MatchWithABet
    sendBet: (...args: any) => Promise<void>
}) {
    const { id, start_time, home_team, away_team, is_knockout, bet } = match

    const otherTournaments = useSelector(MyOtherBettableUTLs);
    const hasOtherTournaments = otherTournaments.length > 0;
    const isMultiBetDefault = useSelector(IsMultiBetDefaultForAll)
    const tournamentClass = useTournamentThemeClass()
    const [edit, setEdit] = useState(false)
    const [forAllTournaments, setForAllTournaments] = useState(isMultiBetDefault)
    const { getLastEditTs, cancelEdit } = useCancelEdit({edit, setEdit})
    const [editOpener, setEditOpener] = useState(null)
    const hasBet = bet?.result_away === undefined
    const showEdit = edit || hasBet

    const saveBet = async ({ homeScore, awayScore, koWinner }) => {
        const ts = getLastEditTs()
        await sendBet({
            matchId: id,
            is_knockout,
            homeScore,
            awayScore,
            koWinner,
            forAllTournaments,
        })
        .then(function (data) {
            let text = 'ההימור נשלח'
            if (forAllTournaments){
                text += ` עבור ${otherTournaments.length + 1} טורנירים`
            }
            window['toastr']['success'](text)
            cancelEdit(ts)
        })
        .catch(function (error) {
            console.log('FAILED updating bet', error)
        })
    }

    const goToEditMode = (opener?: WinnerSide) => {
        setEditOpener(opener ?? null)
        setEdit(true)
    }

    const exitEditMode = () => {
        setEditOpener(null)
        setEdit(false)
    }

    useEffect(()=> {
        setForAllTournaments(isMultiBetDefault)
    }, [edit, isMultiBetDefault, setForAllTournaments])


    // const isHomeKoWinner = winnerSide === WinnerSide.Home
    // const isAwayKoWinner = winnerSide === WinnerSide.Away

    return (
        <div className={`LB-OpenMatchBet LB-EditableBetView  ${tournamentClass} ${(showEdit && forAllTournaments) ? 'sendingforAllTournaments' : ''}`}>
            <div className={`EditableBetView-header`}>
                <div className='dateLabel'>{dayjs(start_time).format(DEFAULT_DATE_FORMAT)}</div>
                <div className='timeLabel'>{dayjs(start_time).format(DEFAULT_TIME_FORMAT)}</div>
                {showEdit && hasOtherTournaments && (
                    <Switch
                        className='forAllTournamentsInput'
                        checked={forAllTournaments}
                        onChange={(e, value) => setForAllTournaments(value)}
                    />
                )}
            </div>
            <div className='OpenMatchBet-body'>
                <TeamWithFlag name={home_team.name} size={50} classes={{root: 'verticalTeam sideRight', name: 'verticalTeamName'}}/>
                <div className='scoreForm'>
                    {showEdit && (
                        <EditMatchBetView
                            bet={bet}
                            onClose={exitEditMode}
                            onSave={saveBet}
                            opener={editOpener}
                        />
                    )}
                    {!showEdit && (
                        <CurrentBetView bet={bet} onEdit={goToEditMode} />
                    )}
                </div>
                <TeamWithFlag name={away_team.name} size={50} classes={{root: 'verticalTeam sideLeft', name: 'verticalTeamName'}}/>
            </div>
        </div>
    )
}

export default OpenMatchBetView
