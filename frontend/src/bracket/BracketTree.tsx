import React, { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import EditIcon from '@mui/icons-material/Edit'
import PlusIcon from '@mui/icons-material/AddRounded'
import CloseIcon from '@mui/icons-material/Close'
import { BracketGame, BracketSide, BracketTeam, GameSubType } from '../types'
import { bracketTeamToTeam } from '../utils'
import TeamFlag from '../widgets/TeamFlag/TeamFlag'
import BracketSlotView from './BracketSlotView'
import { computeBracketLayout, resolveLayoutConfig } from './bracketLayout'

export interface FinalAreaProps {
    leftTeam: BracketTeam | null
    rightTeam: BracketTeam | null
    winnerSide: BracketSide | null
    bothChosen: boolean
    onOpenFinalistPicker: (side: BracketSide) => void
    onCrown: (side: BracketSide) => void
}

interface Props extends FinalAreaProps {
    games: BracketGame[]
    rounds: GameSubType[] // side rounds, outer → inner (Final excluded)
    footer?: React.ReactNode // floated at the bottom-centre of the bracket (the Submit button)
    onClose?: () => void // shown as an "X" at the top-centre of the bracket
    winnerEditing: boolean
    setWinnerEditing: (editing: boolean) => void
}

// Track the available width of an element (drives the responsive sizing/gaps).
function useElementWidth() {
    const ref = useRef<HTMLDivElement>(null)
    const [width, setWidth] = useState(0)
    useLayoutEffect(() => {
        const el = ref.current
        if (!el) return
        const measure = () => setWidth(el.clientWidth)
        measure()
        const ro = new ResizeObserver(measure)
        ro.observe(el)
        return () => ro.disconnect()
    }, [])
    return [ref, width] as const
}

// Thin "road to the final": mirrored halves of square blocks meeting in the centre,
// with the decider (two finalist slots → champion) sitting in the bottom-centre gap.
// Sizes and gaps adapt to the container width (see bracketLayout); coordinates are
// computed deterministically.
function BracketTree({
    games,
    rounds,
    leftTeam,
    rightTeam,
    winnerSide,
    bothChosen,
    onOpenFinalistPicker,
    onCrown,
    footer,
    onClose,
    winnerEditing,
    setWinnerEditing,
}: Props) {
    const { t } = useTranslation('knockout_bracket')
    const [scrollRef, scrollWidth] = useElementWidth()

    const layout = useMemo(() => {
        const usable = Math.max(0, scrollWidth - 8) // minus .Bracket-scroll padding
        const config = resolveLayoutConfig(usable, rounds.length)
        return computeBracketLayout(games, rounds, config)
    }, [games, rounds, scrollWidth])

    const teamOf = (side: BracketSide) =>
        side === 'left' ? leftTeam : rightTeam
    const winnerTeam = winnerSide ? teamOf(winnerSide) : null

    const onFinalistTap = (side: BracketSide) => {
        if (winnerEditing) {
            if (teamOf(side)) {
                onCrown(side)
                setWinnerEditing(false)
            }
            return
        }
        onOpenFinalistPicker(side) // normal mode: choose / change this side's finalist
    }

    const onWinnerTap = () => {
        if (winnerEditing) setWinnerEditing(false)
        else if (bothChosen) setWinnerEditing(true)
    }

    return (
        <div className="w-full py-2 px-1 flex justify-center">
            <div className="Bracket-scroll" ref={scrollRef}>
                {onClose && (
                    <button
                        className="Bracket-closeX"
                        onClick={onClose}
                        aria-label={t('final.back')}
                    >
                        <CloseIcon fontSize="small" />
                    </button>
                )}

                <div
                    className="Bracket-canvas"
                    style={{ width: layout.width, height: layout.height }}
                >
                    <svg
                        className="Bracket-lines"
                        width={layout.width}
                        height={layout.height}
                    >
                        {layout.connectors.map((c) => (
                            <path key={c.key} d={c.d} />
                        ))}
                    </svg>

                    {layout.blocks.map((b) => (
                        <div
                            key={b.key}
                            className="Bracket-blockPos"
                            style={{
                                left: b.x,
                                top: b.y,
                                width: layout.block,
                                height: layout.block,
                            }}
                        >
                            <BracketSlotView
                                slot={b.slot}
                                flagSize={layout.flagSize}
                                tokenFont={layout.tokenFont}
                            />
                        </div>
                    ))}

                    {/* ── Bottom final area: titled frames + finalist slots → champion ── */}
                    <div
                        className="LB-BracketFrame"
                        style={{
                            left: layout.finalFrame.x,
                            top: layout.finalFrame.y,
                            width: layout.finalFrame.width,
                            height: layout.finalFrame.height,
                        }}
                    >
                        <span className="BracketFrame-title">
                            {t('final.title')}
                        </span>
                    </div>
                    <div
                        className="LB-BracketFrame BracketFrame-winner"
                        style={{
                            left: layout.winnerFrame.x,
                            top: layout.winnerFrame.y,
                            width: layout.winnerFrame.width,
                            height: layout.winnerFrame.height,
                        }}
                    >
                        <span className="BracketFrame-title">
                            {t('special.winner')}
                        </span>
                    </div>

                    {layout.finalists.map((f) => {
                        const team = teamOf(f.side)
                        const choosing = winnerEditing && !!team // shining target while picking the winner
                        return (
                            <div
                                key={`final-${f.side}`}
                                className={[
                                    'LB-FinalistSlot',
                                    team ? 'is-selected' : '',
                                    choosing ? 'is-choosing' : '',
                                ].join(' ')}
                                style={{
                                    left: f.x,
                                    top: f.y,
                                    width: layout.finalist,
                                    height: layout.finalist,
                                }}
                                role="button"
                                onClick={() => onFinalistTap(f.side)}
                            >
                                {team ? (
                                    <TeamFlag
                                        team={bracketTeamToTeam(team)}
                                        size={layout.finalistFlag}
                                    />
                                ) : (
                                    <div className="FinalistSlot-empty flex items-center justify-center">
                                        <PlusIcon
                                            style={{
                                                width: 16,
                                                height: 16,
                                                fill: 'rgb(0 0 0 / 20%)',
                                                stroke: 'rgb(0 0 0 / 20%)',
                                            }}
                                        />
                                    </div>
                                )}
                                {team && !winnerEditing && (
                                    <button
                                        className="FinalistSlot-change"
                                        aria-label={t('select.edit')}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onOpenFinalistPicker(f.side)
                                        }}
                                    >
                                        <EditIcon
                                            style={{
                                                fontSize: Math.round(
                                                    layout.finalist * 0.24
                                                ),
                                            }}
                                        />
                                    </button>
                                )}
                            </div>
                        )
                    })}

                    <div
                        className={[
                            'LB-WinnerSlot',
                            winnerTeam ? 'is-filled' : '',
                            bothChosen ? 'is-actionable' : '',
                        ].join(' ')}
                        style={{
                            left: layout.winnerPos.x,
                            top: layout.winnerPos.y,
                            width: layout.winner,
                            height: layout.winner,
                        }}
                        role={bothChosen ? 'button' : undefined}
                        onClick={bothChosen ? onWinnerTap : undefined}
                    >
                        <EmojiEventsIcon
                            className="WinnerSlot-trophy"
                            style={{ fontSize: layout.trophyFont }}
                        />
                        {winnerTeam && !winnerEditing && (
                            <span className="WinnerSlot-flag">
                                <TeamFlag
                                    team={bracketTeamToTeam(winnerTeam)}
                                    size={layout.winnerFlag}
                                />
                            </span>
                        )}
                        {bothChosen && !winnerEditing && (
                            <span className="WinnerSlot-edit">
                                <EditIcon
                                    style={{
                                        fontSize: Math.round(
                                            layout.winner * 0.2
                                        ),
                                    }}
                                />
                            </span>
                        )}
                    </div>
                </div>

                {footer && <div className="Bracket-submitFloat">{footer}</div>}
            </div>
        </div>
    )
}

export default BracketTree
