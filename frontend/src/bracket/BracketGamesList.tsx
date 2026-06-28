import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { BetType, BracketGame, WinnerSide } from '../types'
import {
    IsCurrentTournamentIncludesBetOnResult,
    MissingGameBetsIds,
    MyGameBetsById,
} from '../_selectors'
import { useAppDispatch } from '../_helpers/store'
import { sendBracketQualifierBetAndStore, sendBetAndStore } from '../_actions/bets'
import { bracketSpecialRole, bracketTeamToTeam, getWinnerSide, knockoutStageToSubType, subTypeToKnockoutStage } from '../utils'
import { useBracket, useBracketSpecialBets } from './useBracket'
import BracketGameCard from './BracketGameCard'
import OpenMatchBetView from '../open_matches/MatchBetView'

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
function BracketGamesList({
    sendMatchBet,
}: {
    sendMatchBet: (args: {
        matchId: number
        homeScore: string
        awayScore: string
        koWinner: WinnerSide
    }) => Promise<void>
}) {
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

    // Result tournaments submit an exact score via the normal game-bet API (sendBetAndStore),
    // always including winner_side (the bracket qualifier tie-break, required by the backend).
    const submitResult = async ({ matchId, homeScore, awayScore, koWinner }) => {
        await sendMatchBet({
            matchId,
            homeScore,
            awayScore,
            koWinner,
        })
    }

    // No open ties yet → a floating placeholder panel (no "Open games" heading).
    if (visible.length === 0) {
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
                const myBet = game.id != null ? myBets[game.id] : undefined

                if (isResultsBetOn) {
                    // Reuse the classic game-bet card (score entry), with the bracket
                    // Winner/Runner-Up roles driving its badge + betting-against alert.
                    const match = {
                        id: game.id,
                        start_time: (game.start_time ?? 0) * 1000,
                        home_team: bracketTeamToTeam(game.home_team),
                        away_team: bracketTeamToTeam(game.away_team),
                        subType: subTypeToKnockoutStage(game.round),
                        is_knockout: true,
                        isTwoLeggedTie: false,
                        isFirstLeg: false,
                        bet: myBet,
                    } as any
                    return (
                        <OpenMatchBetView
                            key={game.bracket_game_id}
                            match={match}
                            sendBet={submitResult}
                            isKnockoutBracketGame={true}
                            homeRole={roleOf(game.home_team?.id)}
                            awayRole={roleOf(game.away_team?.id)}
                        />
                    )
                }

                const userSide =
                    (myBet?.winner_side as WinnerSide | undefined) ??
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
