import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import LockIcon from '@mui/icons-material/LockOutlined'
import CheckIcon from '@mui/icons-material/CheckCircle'
import CircularProgress from '@mui/material/CircularProgress'
import InfoIcon from '@mui/icons-material/InfoOutlined'
import WarningIcon from '@mui/icons-material/WarningAmberRounded'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material'
import { BracketGame, BracketTeam, WinnerSide } from '../types'
import {
    bracketTeamToTeam,
    cn,
    DEFAULT_DATE_FORMAT,
    ENG_DATE_FORMAT,
    isBetAgainstAllowedRound,
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
    // Which special role (if any) each side's team holds for this user. Already adjusted
    // for the round (a Runner-Up on the Final is passed as null — see roleForRound).
    homeRole: SpecialRole
    awayRole: SpecialRole
    onPick: (side: WinnerSide) => Promise<void>
    hasNotification: boolean
}

// One bettable knockout tie, bet by QUALIFIER only (who advances) — no score.
// Behaviour when the tie contains the user's Winner/Runner-Up pick ("special"):
//   • Up to the Round of 16: auto-committed & read-only (🏆/🥈 badge + explanation).
//   • From the Quarter-Finals on (isBetAgainstAllowedRound): editable, soft-defaulted to
//     the pre-selected team, but the user may bet AGAINST it — pick the other team to
//     advance. That asks for confirmation, then shows a persistent warning that this
//     game's qualifier points are forfeited.
// A plain (non-special) tie is always a simple tap-a-team picker.
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
    // A pick that bets against a pre-selected team, awaiting confirmation.
    const [confirmSide, setConfirmSide] = useState<WinnerSide | null>(null)
    // The "you're betting against your pick" explanation dialog (from the warning icon).
    const [againstOpen, setAgainstOpen] = useState(false)
    const [infoOpen, setInfoOpen] = useState(false)

    const submitPick = async (side: WinnerSide) => {
        if (pendingSide !== null) return
        setPendingSide(side)
        try {
            await onPick(side)
        } finally {
            setPendingSide(null)
        }
    }

    const isSpecial = !!(homeRole || awayRole)
    const betAgainstAllowed = isBetAgainstAllowedRound(game.round)
    // A special tie stays locked only up to the Round of 16; from the QF on it's editable.
    const locked = game.locked || (isSpecial && !betAgainstAllowed)

    // The side of the user's pre-selected team in this tie. W beats RU, but the two only ever
    // meet in the final — where RU is passed as null — so at most one side is special here.
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
    // When locked, the committed side is the pre-selected team. When editable, the user's
    // explicit pick, else a soft default to the pre-selected team (mirrors kickoff auto-fill).
    const effectiveSide: WinnerSide | null = locked
        ? game.user_qualifier_side ?? specialSide
        : userSide ?? (isSpecial ? specialSide : null)

    // The pre-selected role sitting on the OTHER side of a given pick — i.e. the role that
    // pick bets against. Null unless that other team is the user's Winner/Runner-Up.
    const roleAgainst = (side: WinnerSide): SpecialRole =>
        side === WinnerSide.Home ? awayRole : homeRole
    // The role the current pick is betting against (drives the persistent warning icon).
    const againstRole: SpecialRole =
        effectiveSide != null ? roleAgainst(effectiveSide) : null

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

    const roleLabel = (role: SpecialRole) =>
        role === 'winner'
            ? t('special.winner')
            : role === 'runnerUp'
            ? t('special.runnerUp')
            : ''

    // Tapping a team: if it bets against a pre-selected team, confirm first; else submit.
    const onTap = (side: WinnerSide) => {
        if (roleAgainst(side)) {
            setConfirmSide(side)
        } else {
            submitPick(side)
        }
    }

    const confirmRole = confirmSide != null ? roleAgainst(confirmSide) : null

    const teamRow = (
        team: BracketTeam | null,
        side: WinnerSide,
        role: SpecialRole
    ) => {
        const picked = effectiveSide === side
        const loading = pendingSide === side
        const clickable = !locked && !picked && pendingSide === null
        return (
            <button
                type="button"
                className={cn('BGC-side', {
                    'is-picked': picked,
                    'is-clickable': clickable,
                })}
                onClick={() => {
                    onTap(side)
                }}
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
        <div
            className={cn('LB-BracketGameCard', {
                'is-locked': locked,
                'border-solid border-[3px] border-red-600': hasNotification,
            })}
        >
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
                    {againstRole && (
                        <WarningIcon
                            className="BGC-againstIcon text-amber-400 cursor-pointer"
                            fontSize="small"
                            role="button"
                            aria-label={t('card.against.alert')}
                            onClick={() => setAgainstOpen(true)}
                        />
                    )}
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

            {/* Confirm before committing a bet against the user's Winner/Runner-Up pick. */}
            <Dialog
                open={confirmSide != null}
                onClose={() => setConfirmSide(null)}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>{t('card.against.title')}</DialogTitle>
                <DialogContent>
                    {t('card.against.bodyOnlyQualifier', { role: roleLabel(confirmRole) })}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmSide(null)}>
                        {t('card.against.cancel')}
                    </Button>
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={() => {
                            const side = confirmSide
                            setConfirmSide(null)
                            if (side != null) submitPick(side)
                        }}
                    >
                        {t('card.against.confirm')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Persistent "you're betting against your pick" explanation (warning icon). */}
            <Dialog
                open={againstOpen}
                onClose={() => setAgainstOpen(false)}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>{t('card.against.title')}</DialogTitle>
                <DialogContent>
                    {t('card.against.bodyOnlyQualifier', { role: roleLabel(againstRole) })}
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        onClick={() => setAgainstOpen(false)}
                    >
                        {t('card.against.ok')}
                    </Button>
                </DialogActions>
            </Dialog>

            <BracketGameScoreInfoDialog
                open={infoOpen}
                onClose={() => setInfoOpen(false)}
                qualifierPoints={qualifierPts}
                advancePoints={advancePts}
                role={bonusRole}
                isBettingAgainst={!!againstRole}
            />
        </div>
    )
}

export default BracketGameCard
