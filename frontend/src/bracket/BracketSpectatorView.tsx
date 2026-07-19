import React from 'react'
import { useSelector } from 'react-redux'
import { BracketSide, BracketTeam, GameSubType, WinnerSide } from '../types'
import { findBracketTeam, getTeamSide } from '../utils'
import { Teams } from '../_selectors'
import { useBracket, useBracketSpecialBets } from './useBracket'
import { useBracketTeams } from './useBracketTeams'
import { BracketTreeProvider } from './BracketTreeContext'
import BracketTree from './BracketTree'

const noop = () => undefined
const opposite = (s: BracketSide): BracketSide => (s === 'left' ? 'right' : 'left')

// Read-only bracket shown in the post-start modal. It renders the USER's own picks: their
// Winner/Runner-Up sit in the bottom final area (Winner crowned) and are highlighted along
// their path in the side trees — no picking, no edit affordances, no shine animation. A pick
// that's been knocked out (or missed qualification) is shown with the eliminated treatment.
// `onClose` wires the bracket's own top-centre X.
function BracketSpectatorView({ onClose }: { onClose?: () => void }) {
    const { config, games } = useBracket()
    const { winner, runnerUp } = useBracketSpecialBets()
    const { unqualified } = useBracketTeams()
    const teamsById = useSelector(Teams)
    const sideRounds = config.rounds.filter((r) => r !== GameSubType.Final)

    const winnerId = winner.teamId
    const runnerUpId = runnerUp.teamId

    const resolveTeam = (id: number | null): BracketTeam | null => {
        if (id == null) return null
        const fromBracket = findBracketTeam(games, id)
        if (fromBracket) return fromBracket
        const team = teamsById[id]
        return team ? { id: team.id, name: team.name, crest_url: team.crest_url } : null
    }

    // A pick is "out" if it lost a finished knockout tie it played, or its group left it
    // below a qualifying position.
    const isEliminated = (id: number | null): boolean => {
        if (id == null) return false
        if (unqualified.has(id)) return true
        for (const g of games) {
            if (!g.is_done || !g.actual_qualifier_side) continue
            const side =
                g.home_team?.id === id
                    ? WinnerSide.Home
                    : g.away_team?.id === id
                    ? WinnerSide.Away
                    : null
            if (side && g.actual_qualifier_side !== side) return true
        }
        return false
    }

    // Winner & Runner-Up sit on opposite halves — keep each on its real bracket side when known,
    // else default the Winner to the left.
    let winnerB: BracketSide = getTeamSide(games, winnerId) ?? 'left'
    let ruB: BracketSide = getTeamSide(games, runnerUpId) ?? opposite(winnerB)
    if (ruB === winnerB) ruB = opposite(winnerB)

    const winnerTeam = resolveTeam(winnerId)
    const runnerUpTeam = resolveTeam(runnerUpId)
    const leftTeam = winnerB === 'left' ? winnerTeam : runnerUpTeam
    const rightTeam = winnerB === 'left' ? runnerUpTeam : winnerTeam
    const championSide: BracketSide | null = winnerId != null ? winnerB : null

    // The ACTUAL final (mirrored at the top): the two teams that really reached the final and,
    // once played, the real champion. Each finalist is placed on its own bracket half so the
    // top mirror lines up with the tree; the champion side is derived from the final's result.
    const actualFinal = React.useMemo(() => {
        const finalGame = games.find((g) => g.round === GameSubType.Final)
        const home = finalGame?.home_team ?? null
        const away = finalGame?.away_team ?? null
        if (!home || !away) return null
        const homeSide: BracketSide = getTeamSide(games, home.id) ?? 'left'
        let awaySide: BracketSide = getTeamSide(games, away.id) ?? opposite(homeSide)
        if (awaySide === homeSide) awaySide = opposite(homeSide)
        const actualLeft = homeSide === 'left' ? home : away
        const actualRight = homeSide === 'left' ? away : home
        let actualChampionSide: BracketSide | null = null
        if (finalGame?.is_done && finalGame.actual_qualifier_side) {
            const champ =
                finalGame.actual_qualifier_side === WinnerSide.Home ? home : away
            actualChampionSide = champ.id === actualLeft.id ? 'left' : 'right'
        }
        return { leftTeam: actualLeft, rightTeam: actualRight, championSide: actualChampionSide }
    }, [games])

    const interaction = {
        isFinalist: (id: number) => id === winnerId || id === runnerUpId,
        isEliminated: (id: number) => isEliminated(id),
        onOpenGroup: noop,
        onOpenThirdPlace: noop,
    }

    return (
        <BracketTreeProvider value={interaction}>
            <BracketTree
                spectator
                games={games}
                rounds={sideRounds}
                leftTeam={leftTeam}
                rightTeam={rightTeam}
                winnerSide={championSide}
                actualFinal={actualFinal}
                bothChosen={leftTeam != null && rightTeam != null}
                winnerEditing={false}
                setWinnerEditing={noop}
                onOpenFinalistPicker={noop}
                onCrown={noop}
                onOpenWinnerPicker={noop}
                onClose={onClose}
                className={'container-wrapper'}
            />
        </BracketTreeProvider>
    )
}

export default BracketSpectatorView
