import React, { useEffect, useState } from 'react'
import { useTournamentThemeClass } from '../hooks/useTournamentTheme'
import { MatchWithABet, WinnerSide } from '../types'
import { DEFAULT_DATE_FORMAT, DEFAULT_TIME_FORMAT } from '../utils/index'
import TeamWithFlag from '../widgets/TeamFlag/TeamWithFlag'
import { isEmpty } from 'lodash'
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
    const [edit, setEdit] = useState(bet?.result_away === undefined)
    const [editOpener, setEditOpener] = useState(null)

    const saveBet = async ({ homeScore, awayScore, koWinner }) => {
        return await sendBet({
            matchId: id,
            is_knockout,
            homeScore,
            awayScore,
            koWinner,
        })
    }

    const goToEditMode = (opener?: WinnerSide) => {
        setEditOpener(opener ?? null)
        setEdit(true)
    }

    const exitEditMode = (opener?: WinnerSide) => {
        setEditOpener(null)
        setEdit(false)
    }

    useEffect(()=> {
        if (!isEmpty(bet)){
            setEdit(false)
        }
    }, [bet])


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
                    {edit && (
                        <EditMatchBetView
                            bet={bet}
                            onClose={exitEditMode}
                            onSave={saveBet}
                            opener={editOpener}
                        />
                    )}
                    {!edit && (
                        <CurrentBetView bet={bet} onEdit={goToEditMode} />
                    )}
                </div>
                <TeamWithFlag name={away_team.name} size={50} classes={{root: 'verticalTeam sideLeft', name: 'verticalTeamName'}}/>
            </div>
        </div>
    )
}

export default OpenMatchBetView
