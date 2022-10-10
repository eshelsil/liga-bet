import moment from 'moment'
import React, { EventHandler, useState } from 'react'
import { MatchWithABet, WinnerSide } from '../types'
import { DEFAULT_DATETIME_FORMAT } from '../utils/index'
import KoWinnerInput from '../widgets/koWinnerInput/koWinnerInput'
import TeamAndSymbol from '../widgets/TeamWithFlag'

function EditMatchBet({
    match,
    onCancel,
    onSave,
}: {
    match: MatchWithABet
    onCancel: () => void
    onSave: (...args: any) => void
}) {
    const { id, start_time, home_team, away_team, is_knockout, bet } = match
    const [koWinner, setKoWinner] = useState(bet?.winner_side ?? null)
    const [homeScore, setHomeScore] = useState(bet?.result_home ?? '')
    const [awayScore, setAwayScore] = useState(bet?.result_away ?? '')

    let winnerSide
    const hasHomeScore = homeScore !== ''
    const hasAwayScore = awayScore !== ''
    if (hasHomeScore && hasAwayScore) {
        if (homeScore > awayScore) {
            winnerSide = WinnerSide.Home
        } else if (homeScore < awayScore) {
            winnerSide = WinnerSide.Away
        } else {
            winnerSide = koWinner
        }
    }
    const showKoWinnerInput =
        is_knockout && hasAwayScore && hasHomeScore && homeScore === awayScore
    const koWinnerChange = (value: WinnerSide) => {
        setKoWinner(value)
    }
    const homeScoreChange = (e: any) => {
        const value = parseInt(e.target.value)
        const score = isNaN(value) ? '' : value
        setHomeScore(score >= 0 ? score : 0)
    }
    const awayScoreChange = (e: any) => {
        const value = parseInt(e.target.value)
        const score = isNaN(value) ? '' : value
        setAwayScore(score >= 0 ? score : 0)
    }
    const isHomeWinner = winnerSide === WinnerSide.Home
    const isAwayWinner = winnerSide === WinnerSide.Away

    const saveBet = () => {
        onSave({
            homeScore,
            awayScore,
            koWinner,
        })
    }

    return (
        <tr id={`row_match_${id}`}>
            <td className="admin">{id}</td>
            <td className="v-align-center">
                {moment(start_time).format(DEFAULT_DATETIME_FORMAT)}
            </td>
            <td className="open-match-teams-cell v-align-center">
                <TeamAndSymbol
                    crest_url={home_team.crest_url}
                    name={home_team.name}
                    is_ko_winner={isHomeWinner}
                />
                <br />
                <TeamAndSymbol
                    crest_url={away_team.crest_url}
                    name={away_team.name}
                    is_ko_winner={isAwayWinner}
                />
            </td>
            <td className="open-matches-bet-cell">
                {showKoWinnerInput && (
                    <KoWinnerInput value={koWinner} setValue={koWinnerChange} />
                )}
                <div className="row full-row">
                    <div className="spaced-row">
                        <input
                            onChange={homeScoreChange}
                            className={`form-control open-match-input`}
                            type="number"
                            value={homeScore}
                        />
                    </div>
                    <div
                        className="row full-row"
                        style={{ height: 16, fontSize: 11 }}
                    >
                        <span hidden>מעפילה:</span>
                    </div>
                    <div className="spaced-row">
                        <input
                            onChange={awayScoreChange}
                            className={`form-control open-match-input`}
                            type="number"
                            value={awayScore}
                        />
                    </div>
                </div>
            </td>
            <td className="v-align-center">
                <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                    <button
                        className={`btn btn-sm btn-primary`}
                        onClick={saveBet}
                    >
                        שלח
                    </button>
                    <span style={{ cursor: 'pointer' }} onClick={onCancel}>
                        (X)
                    </span>
                </div>
            </td>
        </tr>
    )
}

export default EditMatchBet
