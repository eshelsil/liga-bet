import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
    Button,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material'
import {
    BracketSide,
    BracketSpecialBets,
    BracketTeam,
    GameSubType,
} from '../types'
import { CurrentTournamentId, Teams } from '../_selectors'
import { findBracketTeam, gamesForSide, getTeamSide } from '../utils'
import { LoadingButton } from '../widgets/Buttons'
import {
    useBracket,
    useBracketSpecialBets,
    useSubmitWinnerAndRunnerUp,
} from './useBracket'
import { useBracketTeams } from './useBracketTeams'
import { FinalistSides, readFinalistSides, writeFinalistSides } from './finalistSidesStore'
import { BracketTreeProvider } from './BracketTreeContext'
import BracketTree from './BracketTree'
import BracketGamesList from './BracketGamesList'
import BracketPodium from './BracketPodium'
import FinalistPickerDialog from './FinalistPickerDialog'
import WinnerPickerDialog from './WinnerPickerDialog'
import GroupsOverview from './GroupsOverview'
import GroupStandingsDialog from './GroupStandingsDialog'
import ThirdPlaceInfoDialog from './ThirdPlaceInfoDialog'
import './Bracket.scss'

interface Parsed {
    left: number | null
    right: number | null
    winnerSide: BracketSide | null
    complete: boolean
}

const opposite = (side: BracketSide): BracketSide => (side === 'left' ? 'right' : 'left')

// Map the user's saved Winner/Runner-Up onto the two side inputs. A team's side is taken
// from the bracket when known; otherwise from the persisted left/right memory (`stored`);
// otherwise the winner defaults to the inline-start side. This keeps the order stable on
// refresh instead of flipping for teams whose bracket side isn't determined yet.
function parseInitial(
    games,
    special: BracketSpecialBets,
    stored: FinalistSides,
    inlineStart: BracketSide,
): Parsed {
    const w = special.winner.teamId
    const r = special.runnerUp.teamId
    const sideOf = (teamId: number | null): BracketSide | null => {
        if (teamId == null) return null
        const bracketSide = getTeamSide(games, teamId)
        if (bracketSide) return bracketSide
        if (stored.left === teamId) return 'left'
        if (stored.right === teamId) return 'right'
        return null
    }

    let left: number | null = null
    let right: number | null = null
    let winnerSide: BracketSide | null = null

    if (w != null && r != null) {
        let wS = sideOf(w)
        let rS = sideOf(r)
        if (wS && rS && wS === rS) rS = opposite(wS) // stale memory conflict
        else if (wS && !rS) rS = opposite(wS)
        else if (!wS && rS) wS = opposite(rS)
        else if (!wS && !rS) {
            wS = inlineStart
            rS = opposite(inlineStart)
        }
        if (wS === 'left') {
            left = w
            right = r
        } else {
            left = r
            right = w
        }
        winnerSide = wS
    } else if (w != null) {
        const s = sideOf(w) ?? inlineStart
        if (s === 'left') left = w
        else right = w
        winnerSide = s
    } else if (r != null) {
        const s = sideOf(r) ?? inlineStart
        if (s === 'left') left = r
        else right = r
    }
    return { left, right, winnerSide, complete: left != null && right != null }
}

function BracketWinnerFlow() {
    const { t, i18n } = useTranslation('knockout_bracket')
    const { config, games } = useBracket()
    const { groups, unseeded, seeded, unqualified } = useBracketTeams()
    const special = useBracketSpecialBets()
    const submitWinnerAndRunnerUp = useSubmitWinnerAndRunnerUp()
    const teamsById = useSelector(Teams)
    const tournamentId = useSelector(CurrentTournamentId)

    // Persisted left/right memory + the default side for the winner (start of the line).
    const stored = readFinalistSides(tournamentId)
    const inlineStart: BracketSide = i18n.dir() === 'rtl' ? 'right' : 'left'

    const initial = parseInitial(games, special, stored, inlineStart)
    const [left, setLeft] = useState<number | null>(initial.left)
    const [right, setRight] = useState<number | null>(initial.right)
    const [winnerSide, setWinnerSide] = useState<BracketSide | null>(
        initial.winnerSide
    )
    // The editor (bracket) is expanded until there's a complete pick; never when locked.
    const [expanded, setExpanded] = useState<boolean>(
        !special.locked && !initial.complete
    )
    const [pickingSide, setPickingSide] = useState<BracketSide | null>(null) // open finalist picker
    const [dialogGroupId, setDialogGroupId] = useState<number | null>(null)
    const [dialogPosition, setDialogPosition] = useState<number | null>(null)
    const [thirdPlaceOpen, setThirdPlaceOpen] = useState(false)
    const [resetConfirmOpen, setResetConfirmOpen] = useState(false)
    const [winnerEditing, setWinnerEditing] = useState(false)
    const [winnerPickerOpen, setWinnerPickerOpen] = useState(false)
    // Re-seed when the saved data changes (e.g. loads after mount), unless a picker is open.
    const sig = `${special.winner.teamId}-${special.runnerUp.teamId}-${special.locked}-${games.length}`
    const lastSig = useRef<string | null>(null)
    useEffect(() => {
        if (lastSig.current === sig) return
        lastSig.current = sig
        if (pickingSide !== null) return
        const p = parseInitial(games, special, stored, inlineStart)
        setLeft(p.left)
        setRight(p.right)
        setWinnerSide(p.winnerSide)
        setExpanded(!special.locked && !p.complete)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sig])

    // Remember which finalist sits on which side, so the order survives a refresh.
    useEffect(() => {
        if (tournamentId == null) return
        writeFinalistSides(tournamentId, { left, right })
    }, [tournamentId, left, right])

    const resolveTeam = (id: number | null): BracketTeam | null => {
        if (id == null) return null
        const fromBracket = findBracketTeam(games, id)
        if (fromBracket) return fromBracket
        const team = teamsById[id]
        return team
            ? { id: team.id, name: team.name, crest_url: team.crest_url }
            : null
    }

    const sideRounds = config.rounds.filter((r) => r !== GameSubType.Final)

    // Teams on one half of the bracket, in top→bottom order (picker candidates for that side).
    const sideTeams = (side: BracketSide): BracketTeam[] => {
        const seen = new Set<number>()
        const out: BracketTeam[] = []
        for (const g of gamesForSide(games, sideRounds, side)) {
            for (const slot of [g.home_slot, g.away_slot]) {
                if (slot.team && !seen.has(slot.team.id)) {
                    seen.add(slot.team.id)
                    out.push(slot.team)
                }
            }
        }
        return out
    }

    const pickFinalist = (teamId: number) => {
        if (pickingSide === null || special.locked) return
        const side = getTeamSide(games, teamId)
        if (side && side !== pickingSide) return // safety: keep finalists on opposite halves

        let newLeft = left
        let newRight = right
        let newWinner = winnerSide
        if (
            pickingSide === winnerSide &&
            teamId !== (pickingSide === 'left' ? left : right)
        ) {
            newWinner = null
        }
        if (pickingSide === 'left') {
            newLeft = teamId
            if (teamId === right) newRight = null
        } else {
            newRight = teamId
            if (teamId === left) newLeft = null
        }
        if (newLeft == null && newWinner === 'left') newWinner = null
        if (newRight == null && newWinner === 'right') newWinner = null
        setLeft(newLeft)
        setRight(newRight)
        setWinnerSide(newWinner)
        setPickingSide(null)
    }

    const crown = (side: BracketSide) => {
        if (!special.locked) setWinnerSide(side)
    }

    // Choose the champion from the winner-picker dialog (the two finalists).
    const selectWinner = (side: BracketSide) => {
        crown(side)
        setWinnerEditing(false)
        setWinnerPickerOpen(false)
    }

    const onSubmit = async () => {
        if (winnerSide === null || left == null || right == null) return
        const winnerTeamId = winnerSide === 'left' ? left : right
        const runnerUpTeamId = winnerSide === 'left' ? right : left
        await submitWinnerAndRunnerUp(
            special.winner.betId,
            winnerTeamId,
            special.runnerUp.betId,
            runnerUpTeamId
        )
        setPickingSide(null)
        setExpanded(false)
    }

    useEffect(() => {
        if (left != null && right != null && winnerSide === null) {
            setWinnerEditing(true)
        }
    }, [left, right, winnerSide])

    // Collapse the editor back to the podium, discarding unsaved edits.
    const onCancel = () => {
        const p = parseInitial(games, special, stored, inlineStart)
        setLeft(p.left)
        setRight(p.right)
        setWinnerSide(p.winnerSide)
        setPickingSide(null)
        setExpanded(false)
    }

    // Reset (after confirmation): clear the pick and reopen the editor to start over.
    const onReset = () => {
        setResetConfirmOpen(false)
        setLeft(null)
        setRight(null)
        setWinnerSide(null)
        setPickingSide(null)
        setExpanded(true)
    }

    const openGroup = (groupId: number, position: number | null = null) => {
        setDialogGroupId(groupId)
        setDialogPosition(position)
    }
    const closeGroup = () => {
        setDialogGroupId(null)
        setDialogPosition(null)
    }
    const dialogGroup = groups.find((g) => g.id === dialogGroupId) ?? null

    const bothChosen = left != null && right != null
    const canSubmit = bothChosen && winnerSide !== null
    const hasSaved =
        special.winner.teamId != null && special.runnerUp.teamId != null
    // The finalist already chosen on the OTHER side — excluded from this side's picker.
    const otherFinalistId = pickingSide === 'left' ? right : pickingSide === 'right' ? left : null

    const leftTeam = resolveTeam(left)
    const rightTeam = resolveTeam(right)
    const championTeam = winnerSide
        ? resolveTeam(winnerSide === 'left' ? left : right)
        : null

    const interaction = {
        isFinalist: (id: number) => id === left || id === right,
        onOpenGroup: openGroup,
        onOpenThirdPlace: () => setThirdPlaceOpen(true),
    }

    const hint = !bothChosen
        ? t('select.pickFinalists')
        : winnerSide === null
        ? t('select.tapChampion')
        : t('select.readyToSave')

    return (
        <div className="LB-Bracket LB-BracketView-enter">
            {!expanded && (
                <BracketPodium
                    champion={championTeam}
                    leftTeam={leftTeam}
                    rightTeam={rightTeam}
                    winnerSide={winnerSide}
                    locked={special.locked}
                    onEdit={() => setExpanded(true)}
                    onReset={() => setResetConfirmOpen(true)}
                />
            )}

            <Collapse className='w-[calc(100%+24px)]  -translate-x-3 rtl:translate-x-3' in={expanded} unmountOnExit>
                <div className="Bracket-editor">
                    <div className="Bracket-editorHint LB-TitleText">
                        {hint}
                    </div>

                    <BracketTreeProvider value={interaction}>
                        <BracketTree
                            games={games}
                            rounds={sideRounds}
                            leftTeam={leftTeam}
                            rightTeam={rightTeam}
                            winnerSide={winnerSide}
                            winnerEditing={winnerEditing}
                            setWinnerEditing={setWinnerEditing}
                            bothChosen={bothChosen}
                            onOpenFinalistPicker={setPickingSide}
                            onCrown={crown}
                            onOpenWinnerPicker={() => setWinnerPickerOpen(true)}
                            onClose={hasSaved ? onCancel : undefined}
                            footer={
                                <LoadingButton
                                    action={onSubmit}
                                    disabled={!canSubmit}
                                >
                                    {t('final.submit')}
                                </LoadingButton>
                            }
                        />
                    </BracketTreeProvider>

                    <GroupsOverview groups={groups} onOpenGroup={openGroup} />
                </div>
            </Collapse>

            <BracketGamesList />

            <FinalistPickerDialog
                side={pickingSide}
                sideTeams={
                    pickingSide
                        ? sideTeams(pickingSide).filter((tm) => tm.id !== otherFinalistId)
                        : []
                }
                notPlaced={unseeded
                    .filter((s) => !unqualified.has(s.team.id) && s.team.id !== otherFinalistId)
                    .map((s) => s.team)}
                onSelect={pickFinalist}
                onClose={() => setPickingSide(null)}
            />
            <WinnerPickerDialog
                open={winnerPickerOpen && bothChosen}
                leftTeam={leftTeam}
                rightTeam={rightTeam}
                winnerSide={winnerSide}
                onSelect={selectWinner}
                onClose={() => setWinnerPickerOpen(false)}
            />
            <GroupStandingsDialog
                group={dialogGroup}
                highlightPosition={dialogPosition}
                seeded={seeded}
                unqualified={unqualified}
                onClose={closeGroup}
            />
            <ThirdPlaceInfoDialog
                open={thirdPlaceOpen}
                onClose={() => setThirdPlaceOpen(false)}
            />

            <Dialog
                open={resetConfirmOpen}
                onClose={() => setResetConfirmOpen(false)}
                maxWidth="xs"
            >
                <DialogTitle>{t('reset.title')}</DialogTitle>
                <DialogContent>{t('reset.message')}</DialogContent>
                <DialogActions>
                    <Button onClick={() => setResetConfirmOpen(false)}>
                        {t('reset.cancel')}
                    </Button>
                    <Button color="error" variant="contained" onClick={onReset}>
                        {t('reset.confirm')}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default BracketWinnerFlow
