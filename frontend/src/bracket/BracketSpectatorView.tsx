import React from 'react'
import { BracketSide, BracketTeam, GameSubType, WinnerSide } from '../types'
import { getTeamSide } from '../utils'
import { useBracket } from './useBracket'
import BracketTree from './BracketTree'

const noop = () => undefined

// Read-only bracket shown in the post-start modal: the side trees already render the
// ACTUAL qualified teams; here we feed the real Final teams/winner into the bottom area
// and render the whole thing through BracketTree's `spectator` mode (no picking, no edits).
function BracketSpectatorView() {
    const { config, games } = useBracket()
    const sideRounds = config.rounds.filter((r) => r !== GameSubType.Final)

    const finalGame = games.find((g) => g.round === GameSubType.Final)
    const homeTeam = finalGame?.home_team ?? finalGame?.home_slot.team ?? null
    const awayTeam = finalGame?.away_team ?? finalGame?.away_slot.team ?? null

    // Place each finalist on the half it actually came from (fallback: home→left, away→right),
    // so the connectors flowing in from each side line up with the real teams.
    let leftTeam: BracketTeam | null = null
    let rightTeam: BracketTeam | null = null
    for (const team of [homeTeam, awayTeam]) {
        if (!team) continue
        const side = getTeamSide(games, team.id)
        if (side === 'left' && !leftTeam) leftTeam = team
        else if (side === 'right' && !rightTeam) rightTeam = team
        else if (!leftTeam) leftTeam = team
        else rightTeam = team
    }

    // The champion, once the final is decided.
    let winnerSide: BracketSide | null = null
    if (finalGame?.is_done && finalGame.actual_qualifier_side) {
        const winTeam =
            finalGame.actual_qualifier_side === WinnerSide.Home
                ? homeTeam
                : awayTeam
        if (winTeam?.id === leftTeam?.id) winnerSide = 'left'
        else if (winTeam?.id === rightTeam?.id) winnerSide = 'right'
    }

    return (
        <BracketTree
            spectator
            games={games}
            rounds={sideRounds}
            leftTeam={leftTeam}
            rightTeam={rightTeam}
            winnerSide={winnerSide}
            bothChosen={leftTeam != null && rightTeam != null}
            winnerEditing={false}
            setWinnerEditing={noop}
            onOpenFinalistPicker={noop}
            onCrown={noop}
            onOpenWinnerPicker={noop}
        />
    )
}

export default BracketSpectatorView
