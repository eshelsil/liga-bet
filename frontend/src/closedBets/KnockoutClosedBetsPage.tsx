import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import CheckIcon from '@mui/icons-material/CheckCircle'
import { BracketGame, BracketTeam, WinnerSide } from '../types'
import { bracketSpecialRole, bracketTeamToTeam, subTypeToKnockoutStage } from '../utils'
import { getStageName } from '../strings/stages'
import { MyGameBetsById } from '../_selectors'
import TeamWithFlag from '../widgets/TeamFlag/TeamWithFlag'
import { useAppDispatch } from '../_helpers/store'
import { fetchAndStoreBracket } from '../_actions/bracket'
import { useBracket, useBracketScores, useBracketSpecialBets } from '../bracket/useBracket'
import './ClosedBetsPage.scss'

// The team that actually qualified from a resolved tie.
function qualifyingTeamId(game: BracketGame): number | null {
    if (!game.is_done || !game.actual_qualifier_side) return null
    const team = game.actual_qualifier_side === WinnerSide.Home ? game.home_team : game.away_team
    return team?.id ?? null
}

/**
 * Closed-bets for knockout_bracket tournaments: games view only. Each resolved
 * game shows the points the user earned = qualifier points (correct pick) +
 * specialAdvance bonus (the user's Winner/Runner-Up qualified in this round).
 */
const KnockoutClosedBetsPage = () => {
    const { t } = useTranslation('knockout_bracket')
    const dispatch = useAppDispatch()
    const { config, games } = useBracket()
    const scores = useBracketScores()
    const { winner, runnerUp } = useBracketSpecialBets()
    const myBets = useSelector(MyGameBetsById)

    // Not rendered under BracketProvider, so fetch the bracket here too.
    useEffect(() => {
        dispatch(fetchAndStoreBracket()).catch((e) =>
            console.log('FAILED to fetch bracket', e),
        )
    }, [dispatch])

    const order = config.rounds
    const doneGames = games
        .filter((g) => g.is_done)
        .sort((a, b) => order.indexOf(a.round) - order.indexOf(b.round))

    const specialTeamIds = [winner.teamId, runnerUp.teamId].filter(
        (id): id is number => id != null,
    )

    return (
        <div className='LB-ClosedBetsPage'>
            <h1 className='ClosedBetsPage-title LB-TitleText'>{t('closed.title')}</h1>
            <div className='LB-KnockoutClosedList'>
                {doneGames.length === 0 && (
                    <div className='KnockoutClosed-empty'>{t('closed.empty')}</div>
                )}
                {doneGames.map((game) => {
                    // What the user put: their submitted qualifier pick (falls back to the
                    // bracket's own user_qualifier_side).
                    const userSide =
                        (game.id != null ? (myBets[game.id]?.winner_side as WinnerSide | undefined) : undefined) ??
                        game.user_qualifier_side
                    const correct =
                        !!userSide && userSide === game.actual_qualifier_side
                    const qualifierPoints = correct ? scores.qualifier[game.round] ?? 0 : 0
                    const qualifiedId = qualifyingTeamId(game)
                    const advanceBonus =
                        qualifiedId != null && specialTeamIds.includes(qualifiedId)
                            ? scores.specialAdvance[game.round] ?? 0
                            : 0
                    const total = qualifierPoints + advanceBonus

                    const teamCell = (team: BracketTeam | null, side: WinnerSide) => {
                        if (!team) return null
                        const role = bracketSpecialRole(team.id, winner.teamId, runnerUp.teamId)
                        const isPick = userSide === side
                        return (
                            <span className={`KnockoutClosed-team ${isPick ? 'is-userpick' : ''}`}>
                                <TeamWithFlag team={bracketTeamToTeam(team)} size={22} />
                                {role && (
                                    <span className='KnockoutClosed-badge'>
                                        {role === 'winner' ? t('card.winnerBadge') : t('card.runnerUpBadge')}
                                    </span>
                                )}
                                {isPick && <CheckIcon className='KnockoutClosed-pickCheck' fontSize='small' />}
                            </span>
                        )
                    }

                    return (
                        <div className='KnockoutClosed-row' key={game.bracket_game_id}>
                            <div className='KnockoutClosed-stage'>
                                {getStageName(subTypeToKnockoutStage(game.round))}
                            </div>
                            <div className='KnockoutClosed-teams'>
                                {teamCell(game.home_team, WinnerSide.Home)}
                                <span className='KnockoutClosed-vs'>{t('closed.vs')}</span>
                                {teamCell(game.away_team, WinnerSide.Away)}
                            </div>
                            <div className={`KnockoutClosed-points ${total > 0 ? 'is-correct' : 'is-wrong'}`}>
                                {t('bet.points', { points: total })}
                                {advanceBonus > 0 && (
                                    <span className='KnockoutClosed-bonus'>
                                        {t('closed.advanceBonus', { points: advanceBonus })}
                                    </span>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default KnockoutClosedBetsPage
