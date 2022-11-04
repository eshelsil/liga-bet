import React, { useRef, useState } from 'react'
import { useTournamentThemeClass } from '../hooks/useTournamentTheme'
import { MatchWithABet, WinnerSide } from '../types'
import { DEFAULT_DATE_FORMAT, DEFAULT_TIME_FORMAT } from '../utils/index'
import TeamWithFlag from '../widgets/TeamFlag/TeamWithFlag'
import CurrentBetView from './CurrentBetView'
import EditMatchBetView from './EditMatchBetView'
import moment from 'moment'



function OpenMatchBetView({
    match,
    sendBet,
}: {
    match: MatchWithABet
    sendBet: (...args: any) => Promise<void>
}) {
    const { id, start_time, home_team, away_team, is_knockout, bet } = match
    const tournamentClass = useTournamentThemeClass()
    const lastEditOpen = useRef(Number(new Date()))
    const [edit, setEdit] = useState(false)
    const [editOpener, setEditOpener] = useState(null)
    const hasBet = bet?.result_away === undefined
    const showEdit = edit || hasBet

    const saveBet = async ({ homeScore, awayScore, koWinner }) => {
        const ts = lastEditOpen.current
        await sendBet({
            matchId: id,
            is_knockout,
            homeScore,
            awayScore,
            koWinner,
        })
        if (ts === lastEditOpen.current){
            exitEditMode()
        }
    }

    const goToEditMode = (opener?: WinnerSide) => {
        lastEditOpen.current = Number(new Date())
        setEditOpener(opener ?? null)
        setEdit(true)
    }

    const exitEditMode = () => {
        setEditOpener(null)
        setEdit(false)
    }


    // const isHomeKoWinner = winnerSide === WinnerSide.Home
    // const isAwayKoWinner = winnerSide === WinnerSide.Away

    return (
        <div className='LB-OpenMatchBet'>
            <div className={`headerRow ${tournamentClass}`}>
                <div className='dateLabel'>{moment(start_time).format(DEFAULT_DATE_FORMAT)}</div>
                <div className='timeLabel'>{moment(start_time).format(DEFAULT_TIME_FORMAT)}</div>
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
