import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import LockIcon from '@mui/icons-material/LockOutlined'
import CheckIcon from '@mui/icons-material/CheckCircle'
import CircularProgress from '@mui/material/CircularProgress'
import InfoIcon from '@mui/icons-material/InfoOutlined'
import { BracketGame, BracketTeam, WinnerSide } from '../types'
import {
    bracketTeamToTeam,
    DEFAULT_DATE_FORMAT,
    ENG_DATE_FORMAT,
    subTypeToKnockoutStage,
} from '../utils'
import { getStageName } from '../strings/stages'
import TeamWithFlag from '../widgets/TeamFlag/TeamWithFlag'
import BracketGameScoreInfoDialog from './BracketGameScoreInfoDialog'
import { useBracketScores } from './useBracket'
import dayjs from 'dayjs'
import Badge from '@mui/material/Badge/Badge'

type SpecialRole = 'winner' | 'runnerUp' | null

interface Props {
    game: BracketGame
    // The user's current qualifier pick for this tie (from their submitted Game bet),
    // or null if not picked yet.
    userSide: WinnerSide | null
    // Which special role (if any) each side's team holds for this user.
    homeRole: SpecialRole
    awayRole: SpecialRole
    onPick: (side: WinnerSide) => Promise<void>
    hasNotification: boolean
}

// One bettable knockout tie, bet by QUALIFIER only (who advances) — no score.
// Two states (open list shows only bettable ties, per plan D1):
//   • Locked / special-answer: one of the teams is the user's Winner/Runner-Up pick
//     (or the backend marked the tie `locked`). The qualifier is auto-committed to
//     that team advancing — read-only, with a 🏆/🥈 badge + explanation.
//   • Open: tap a team to pick who qualifies; submits a contract-E Game bet.
function BracketGameCard({
    game,
    userSide,
    homeRole,
    awayRole,
    onPick,
    hasNotification,
}: Props) {
    const { t, i18n } = useTranslation('knockout_bracket')

    // The side currently being submitted — drives the inline loader on the tapped team.
    const [pendingSide, setPendingSide] = useState<WinnerSide | null>(null)
    const [submitting, setSubmitting] = useState(false)

    const submitPick = async (side: WinnerSide) => {
        if (submitting) return
        setSubmitting(true)
        try {
            await onPick(side)
        } finally {
            setSubmitting(false)
            setPendingSide(null)
        }
    }

    const [infoOpen, setInfoOpen] = useState(false)

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

    // Scoring info for this tie: qualifier points for the round, plus the advance bonus
    // when one of the user's pre-selected teams (Winner/Runner-Up) plays here.
    const scores = useBracketScores()
    const qualifierPts = scores.qualifier[game.round] ?? 0
    const advancePts = scores.specialAdvance[game.round] ?? 0
    // A pre-selected team (Winner/Runner-Up) playing here earns the advance bonus too.
    const bonusRole: SpecialRole =
        homeRole === 'winner' || awayRole === 'winner'
            ? 'winner'
            : homeRole ?? awayRole

    const badge = (role: SpecialRole) =>
        role === 'winner'
            ? t('card.winnerBadge')
            : role === 'runnerUp'
            ? t('card.runnerUpBadge')
            : null

    const teamRow = (
        team: BracketTeam | null,
        side: WinnerSide,
        role: SpecialRole
    ) => {
        const picked = effectiveSide === side
        const clickable = !locked && !submitting
        const loading = submitting && pendingSide === side
        return (
            <button
                type="button"
                className={`BGC-side ${picked ? 'is-picked' : ''} ${
                    clickable ? 'is-clickable' : ''
                }`}
                onClick={
                    clickable
                        ? () => {
                              setPendingSide(side)
                              submitPick(side)
                          }
                        : undefined
                }
                disabled={!clickable}
            >
                {team ? (
                    <TeamWithFlag team={bracketTeamToTeam(team)} size={34} />
                ) : (
                    <span className="BGC-tbd">{t('slot.tbd')}</span>
                )}
                {badge(role) && (
                    <span className="BGC-badge">{badge(role)}</span>
                )}
                {loading ? (
                    <CircularProgress className="BGC-spinner" size={12} />
                ) : (
                    picked && (
                        <CheckIcon className="BGC-check" fontSize="small" />
                    )
                )}
            </button>
        )
    }

    return (
        <div className={`LB-BracketGameCard ${locked ? 'is-locked' : ''}`}>
            {hasNotification && (
                <Badge
                    className="BGC-notification"
                    color="error"
                    overlap="circular"
                    variant="dot"
                    badgeContent=" "
                />
            )}
            <div className="BGC-head">
                <span className="BGC-stage">
                    {stage}
                    <InfoIcon
                        className="BGC-infoIcon"
                        color="primary"
                        fontSize="small"
                        role="button"
                        aria-label={t('card.info.title')}
                        onClick={() => setInfoOpen(true)}
                    />
                </span>
                <span className="BGC-kickoff">
                    {dayjs
                        .unix(game.start_time)
                        .format(
                            `${
                                i18n.language === 'he'
                                    ? DEFAULT_DATE_FORMAT
                                    : ENG_DATE_FORMAT
                            }  HH:mm`
                        )}
                </span>
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

            <BracketGameScoreInfoDialog
                open={infoOpen}
                onClose={() => setInfoOpen(false)}
                qualifierPoints={qualifierPts}
                advancePoints={advancePts}
                role={bonusRole}
            />
        </div>
    )
}

export default BracketGameCard
