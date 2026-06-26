import React from 'react'
import { useTranslation } from 'react-i18next'
import LockIcon from '@mui/icons-material/LockOutlined'
import CheckIcon from '@mui/icons-material/CheckCircle'
import { BracketGame, BracketTeam, WinnerSide } from '../types'
import { bracketTeamToTeam, formatBracketKickoff, subTypeToKnockoutStage } from '../utils'
import { getStageName } from '../strings/stages'
import TeamWithFlag from '../widgets/TeamFlag/TeamWithFlag'

type SpecialRole = 'winner' | 'runnerUp' | null

interface Props {
    game: BracketGame
    // The user's current qualifier pick for this tie (from their submitted Game bet),
    // or null if not picked yet.
    userSide: WinnerSide | null
    // Which special role (if any) each side's team holds for this user.
    homeRole: SpecialRole
    awayRole: SpecialRole
    onPick: (side: WinnerSide) => void
    submitting: boolean
}

// One bettable knockout tie, bet by QUALIFIER only (who advances) — no score.
// Two states (open list shows only bettable ties, per plan D1):
//   • Locked / special-answer: one of the teams is the user's Winner/Runner-Up pick
//     (or the backend marked the tie `locked`). The qualifier is auto-committed to
//     that team advancing — read-only, with a 🏆/🥈 badge + explanation.
//   • Open: tap a team to pick who qualifies; submits a contract-E Game bet.
function BracketGameCard({ game, userSide, homeRole, awayRole, onPick, submitting }: Props) {
    const { t } = useTranslation('knockout_bracket')

    const isSpecial = !!(homeRole || awayRole)
    const locked = game.locked || isSpecial

    // When locked, the qualifier is the team the user already committed to advancing:
    // prefer the backend's auto-set side; otherwise the Winner pick advances, else the
    // Runner-Up pick (W beats everyone; RU advances until it meets W).
    const specialSide: WinnerSide | null =
        homeRole === 'winner' || awayRole === 'winner'
            ? homeRole === 'winner'
                ? WinnerSide.Home
                : WinnerSide.Away
            : homeRole
              ? WinnerSide.Home
              : awayRole
                ? WinnerSide.Away
                : null
    const effectiveSide: WinnerSide | null = locked
        ? game.user_qualifier_side ?? specialSide
        : userSide

    const stage = getStageName(subTypeToKnockoutStage(game.round))
    const kickoff = formatBracketKickoff(game.start_time)

    const badge = (role: SpecialRole) =>
        role === 'winner'
            ? t('card.winnerBadge')
            : role === 'runnerUp'
              ? t('card.runnerUpBadge')
              : null

    const teamRow = (team: BracketTeam | null, side: WinnerSide, role: SpecialRole) => {
        const picked = effectiveSide === side
        const clickable = !locked && !submitting
        return (
            <button
                type="button"
                className={`BGC-side ${picked ? 'is-picked' : ''} ${clickable ? 'is-clickable' : ''}`}
                onClick={clickable ? () => onPick(side) : undefined}
                disabled={!clickable}
            >
                {team ? (
                    <TeamWithFlag team={bracketTeamToTeam(team)} size={34} />
                ) : (
                    <span className="BGC-tbd">{t('slot.tbd')}</span>
                )}
                {badge(role) && <span className="BGC-badge">{badge(role)}</span>}
                {picked && <CheckIcon className="BGC-check" fontSize="small" />}
            </button>
        )
    }

    return (
        <div className={`LB-BracketGameCard ${locked ? 'is-locked' : ''}`}>
            <div className="BGC-head">
                <span className="BGC-stage">{stage}</span>
                {kickoff && <span className="BGC-kickoff">{kickoff}</span>}
            </div>
            <div className="BGC-body">
                {teamRow(game.home_team, WinnerSide.Home, homeRole)}
                <span className="BGC-vs">{t('closed.vs')}</span>
                {teamRow(game.away_team, WinnerSide.Away, awayRole)}
            </div>
            <div className="BGC-foot">
                {locked ? (
                    <span className="BGC-lockedNote">
                        <LockIcon fontSize="inherit" /> {t('card.locked')}
                    </span>
                ) : (
                    <span className="BGC-prompt">{t('bet.pickPrompt')}</span>
                )}
            </div>
        </div>
    )
}

export default BracketGameCard
