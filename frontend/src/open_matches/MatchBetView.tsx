import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTournamentThemeClass } from '../hooks/useThemeClass'
import { MatchWithABet, WinnerSide } from '../types'
import { DEFAULT_DATE_FORMAT, DEFAULT_TIME_FORMAT, ENG_DATE_FORMAT, isFinalGame, knockoutStageToSubType, subTypeToKnockoutStage } from '../utils/index'
import TeamWithFlag from '../widgets/TeamFlag/TeamWithFlag'
import CurrentBetView from './CurrentBetView'
import EditMatchBetView from './EditMatchBetView'
import dayjs from 'dayjs'
import useCancelEdit from '../hooks/useCancelEdit'
import { useSelector } from 'react-redux'
import { IsCurrentTournamentKnockoutBracket, IsMultiBetDefaultForAll, IsOurTournament, MyOtherBettableUTLs } from '../_selectors'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Switch } from '@mui/material'
import DaShubi from './DaShubi'
import { cn, getWinnerSide } from '@/utils'
import InfoIcon from '@mui/icons-material/InfoOutlined';
import WarningIcon from '@mui/icons-material/WarningAmberRounded';
import { useAppDispatch } from '@/_helpers/store'
import { openDialog } from '@/_actions/dialogs'
import { DialogName } from '@/dialogs/types'
import useOpenDialog from '@/hooks/useOpenDialog'
import './MatchBetView.scss'
import '../styles/openBets/EditableBetView.scss'
import BracketGameScoreInfoDialog from '@/bracket/BracketGameScoreInfoDialog'
import { useBracketScores } from '@/bracket/useBracket'



type SpecialRole = 'winner' | 'runnerUp' | null

function OpenMatchBetView({
    match,
    sendBet,
    isKnockoutBracketGame = false,
    homeRole = null,
    awayRole = null,
}: {
    match: MatchWithABet
    sendBet: (...args: any) => Promise<void>
    // Optional (bracket only): the pre-selected Winner/Runner-Up role of each side. Drives the
    // winner badge + the "betting against your pick" alert. Absent ⇒ plain classic card.
    isKnockoutBracketGame?: boolean
    homeRole?: SpecialRole
    awayRole?: SpecialRole
}) {
    const { id, start_time, home_team, away_team, is_knockout, bet, isFirstLeg, isTwoLeggedTie, subType } = match

    const { t, i18n } = useTranslation('open_matches')
    const { t: tBracket } = useTranslation('knockout_bracket')
    const openInfoDialog = useOpenDialog(DialogName.GameScoreInfo)
    const [bracketInfoDialogOpen, setBracketInfoDialogOpen] = useState(false)


    const otherTournaments = useSelector(MyOtherBettableUTLs);
    const hasOtherTournaments = otherTournaments.length > 0;
    const isMultiBetDefault = useSelector(IsMultiBetDefaultForAll)
    const tournamentClass = useTournamentThemeClass()
    const [edit, setEdit] = useState(false)
    // const [forAllTournaments, setForAllTournaments] = useState(isMultiBetDefault)
    const forAllTournaments = false; // multi-bets deprecated
    const { getLastEditTs, cancelEdit } = useCancelEdit({edit, setEdit})
    const [editOpener, setEditOpener] = useState(null)
    const hasNoBet = [undefined, null].includes(bet?.result_away)
    const showEdit = edit || hasNoBet

    const isBracketSpecial = !!(homeRole || awayRole)
    const [live, setLive] = useState<{ homeScore: any; awayScore: any; koWinner: WinnerSide | null } | null>(null)
    const [againstOpen, setAgainstOpen] = useState(false)

    const scores = useBracketScores()
    const knockoutRound = knockoutStageToSubType(subType)
    console.log('knockoutRound', knockoutRound, {subType})
    const qualifierPts = scores.qualifier?.[knockoutRound] ?? 0
    const advancePts = scores.specialAdvance?.[knockoutRound] ?? 0
    const resultPts = scores.result?.[knockoutRound] ?? 0
    const bonusRole: SpecialRole =
        homeRole === 'winner' || awayRole === 'winner'
            ? 'winner'
            : homeRole ?? awayRole

    // Who the current bet has advancing — from the unsaved edit values while editing, else the saved
    // bet. Lets us flag (live) when the result bets against a pre-selected Winner/Runner-Up.
    const effHome = showEdit ? live?.homeScore : bet?.result_home
    const effAway = showEdit ? live?.awayScore : bet?.result_away
    const effKo = showEdit ? live?.koWinner : bet?.winner_side
    const filled = effHome !== '' && effHome != null && effAway !== '' && effAway != null
    const qualifier = filled
        ? getWinnerSide(Number(effHome), Number(effAway), effKo ?? undefined)
        : null
    const againstRole: SpecialRole =
        qualifier === WinnerSide.Away && homeRole
            ? homeRole
            : qualifier === WinnerSide.Home && awayRole
            ? awayRole
            : null
    const roleBadge = (role: SpecialRole) =>
        role === 'winner'
            ? tBracket('card.winnerBadgeSmall')
            : role === 'runnerUp'
            ? tBracket('card.runnerUpBadgeSmall')
            : null
    const againstLabel =
        againstRole === 'winner' ? tBracket('special.winner') : tBracket('special.runnerUp')

    const saveBet = async ({ homeScore, awayScore, koWinner }) => {
        const ts = getLastEditTs()
        await sendBet({
            matchId: id,
            is_knockout,
            isTwoLeggedTie,
            isFirstLeg,
            homeScore,
            awayScore,
            koWinner,
            forAllTournaments,
        })
        .then(function (data) {
            const text = forAllTournaments
                ? t('toasts.betSentForTournaments', { count: otherTournaments.length + 1 })
                : t('toasts.betSent')
            window['toastr']['success'](text)
            cancelEdit(ts)
        })
        .catch(function (error) {
            console.log('FAILED updating bet', error)
        })
    }

    const goToEditMode = (opener?: WinnerSide) => {
        setEditOpener(opener ?? null)
        setEdit(true)
    }

    const exitEditMode = () => {
        setEditOpener(null)
        setEdit(false)
    }



    // const isHomeKoWinner = winnerSide === WinnerSide.Home
    // const isAwayKoWinner = winnerSide === WinnerSide.Away

    return (
        <div className={`
            LB-OpenMatchBet LB-EditableBetView ${tournamentClass}
            ${is_knockout ? 'OpenMatchBet-knockout' : ''}
            ${showEdit ? 'OpenMatchBet-edit' : ''}
            ${isTwoLeggedTie ? 'OpenMatchBet-twoLegsKo' : ''}
        `}>
            <div className={`EditableBetView-header`}>
                <div className='dateLabel'>{dayjs(start_time).format(i18n.language === 'he' ? DEFAULT_DATE_FORMAT : ENG_DATE_FORMAT)}</div>
                <div className='timeLabel'>{dayjs(start_time).format(DEFAULT_TIME_FORMAT)}</div>
                <div className={cn("absolute top-0 end-0 flex items-center h-full")}>
                    {againstRole && (
                        <WarningIcon
                            role="button"
                            aria-label={tBracket('card.against.alert')}
                            onClick={() => setAgainstOpen(true)}
                            className={cn("me-1 text-amber-400 cursor-pointer")}
                        />
                    )}
                    <InfoIcon onClick={isKnockoutBracketGame ? () => setBracketInfoDialogOpen(true) : ()=>openInfoDialog({gameId:id})} className={cn("me-2 text-white/80 cursor-pointer")} />
                </div>
            </div>
            <div className='OpenMatchBet-body'>
                <TeamWithFlag team={home_team} size={50} classes={{root: 'verticalTeam sideRight', name: 'verticalTeamName'}}
                    badge={homeRole ? (<div className="OpenMatchBet-badge">{roleBadge(homeRole)}</div>) : undefined}
                />
                <div className='scoreForm'>
                    {showEdit && (
                        <EditMatchBetView
                            bet={bet}
                            isKnockout={is_knockout}
                            isTwoLegsKo={isTwoLeggedTie}
                            isFirstLeg={isFirstLeg}
                            onClose={exitEditMode}
                            onSave={saveBet}
                            opener={editOpener}
                            onChange={isBracketSpecial ? setLive : undefined}
                        />
                    )}
                    {!showEdit && (
                        <CurrentBetView bet={bet} onEdit={goToEditMode} />
                    )}
                </div>
                <TeamWithFlag team={away_team} size={50} classes={{root: 'verticalTeam sideLeft', name: 'verticalTeamName'}}
                    badge={awayRole ? (<div className="OpenMatchBet-badge">{roleBadge(awayRole)}</div>) : undefined}
                />
            </div>
            {isBracketSpecial && (
                <Dialog open={againstOpen} onClose={() => setAgainstOpen(false)} maxWidth="xs" fullWidth>
                    <DialogTitle>{tBracket('card.against.title')}</DialogTitle>
                    <DialogContent>{tBracket('card.against.body', { role: againstLabel })}</DialogContent>
                    <DialogActions>
                        <Button variant="contained" onClick={() => setAgainstOpen(false)}>
                            {tBracket('card.against.ok')}
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
            {isKnockoutBracketGame && (
                <BracketGameScoreInfoDialog
                open={bracketInfoDialogOpen}
                onClose={() => setBracketInfoDialogOpen(false)}
                qualifierPoints={qualifierPts}
                advancePoints={advancePts}
                resultPoints={resultPts}
                role={bonusRole}
            />
            )}
        </div>
    )
}

export default OpenMatchBetView
