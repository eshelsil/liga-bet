import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { BracketGame, WinnerSide } from '../types'
import {
    IsCurrentTournamentIncludesBetOnResult,
    MissingGameBetsIds,
    MyGameBetsById,
} from '../_selectors'
import { useAppDispatch } from '../_helpers/store'
import { sendBracketQualifierBetAndStore } from '../_actions/bets'
import { bracketSpecialRole } from '../utils'
import { useBracket, useBracketSpecialBets } from './useBracket'
import BracketGameCard from './BracketGameCard'

// A bettable tie is shown when both teams are known and it isn't finished, and it's
// either open for a pick OR auto-locked by the user's Winner/Runner-Up (plan D1/D3):
// kicked-off, unresolved ties live on the Closed Bets page, not here.
function shouldShow(g: BracketGame, isSpecial: boolean): boolean {
    return (
        !!g.home_team &&
        !!g.away_team &&
        !g.is_done &&
        (g.bettable || g.locked || isSpecial)
    )
}

// The "Open games" list on the bracket's Open Guesses page: per-tie qualifier-only
// betting. Each card is either an open tap-a-team picker or a locked special-answer.
function BracketGamesList() {
    const { t } = useTranslation('knockout_bracket')
    const { config, games } = useBracket()
    const { winner, runnerUp } = useBracketSpecialBets()
    const isResultsBetOn = useSelector(IsCurrentTournamentIncludesBetOnResult)
    const myBets = useSelector(MyGameBetsById)
    const missingGameBetsIds = useSelector(MissingGameBetsIds)
    const dispatch = useAppDispatch()

    const roleOf = (teamId: number | null | undefined) =>
        bracketSpecialRole(teamId, winner.teamId, runnerUp.teamId)

    const order = new Map(config.rounds.map((r, i) => [r, i]))
    const visible = games
        .filter((g) =>
            shouldShow(
                g,
                !!(roleOf(g.home_team?.id) || roleOf(g.away_team?.id))
            )
        )
        .sort((a, b) => {
            const r = (order.get(a.round) ?? 99) - (order.get(b.round) ?? 99)
            return r !== 0 ? r : (a.start_time ?? 0) - (b.start_time ?? 0)
        })

    const onPick = async (game: BracketGame, side: WinnerSide) => {
        if (game.id == null) return
        try {
            await dispatch(sendBracketQualifierBetAndStore(game.id, side))
            window['toastr']['success'](t('bet.saved'))
        } catch (e) {
            console.log('FAILED to save qualifier', e)
            window['toastr']['error'](t('bet.failed'))
        }
    }

    // No open ties yet → a floating placeholder panel (no "Open games" heading).
    // if (true) { // for now always return this view
    if (visible.length === 0 || isResultsBetOn) {
        return (
            <div className="LB-BracketGamesList">
                <div className="BracketGamesList-emptyPanel">
                    {t('openGames.empty')}
                </div>
            </div>
        )
    }

    return (
        <div className="LB-BracketGamesList">
            <h4 className="BracketGamesList-title LB-TitleText">
                {t('openGames.title')}
            </h4>
            {visible.map((game) => {
                const myPick = game.id != null ? myBets[game.id] : undefined
                const userSide =
                    (myPick?.winner_side as WinnerSide | undefined) ??
                    game.user_qualifier_side
                const pick = async (side: WinnerSide) => await onPick(game, side);
                return (
                    <BracketGameCard
                        key={game.bracket_game_id}
                        game={game}
                        userSide={userSide ?? null}
                        homeRole={roleOf(game.home_team?.id)}
                        awayRole={roleOf(game.away_team?.id)}
                        onPick={pick}
                        hasNotification={missingGameBetsIds.includes(game.id)}
                    />
                )
            })}
        </div>
    )
}

export default BracketGamesList
