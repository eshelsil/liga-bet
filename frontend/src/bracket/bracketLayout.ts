import { BracketGame, BracketSide, BracketSlotInfo, GameSubType } from '../types'

// Responsive geometry for the thin bracket. The structure (games per side/round) is
// fixed; sizes and gaps adapt to the container width. Coordinates are computed
// deterministically (no DOM measurement here) from a resolved LayoutConfig.

export const MAX_CANVAS = 600 // the bracket canvas never grows wider than this

export const TOP_PAD = 6
const INTRA = 0 // gap between the home/away blocks within a tie
const FINAL_GAP = 10 // gap between the two finalist slots
// The decider sits in the bottom-central gap, stacked top→bottom: semis point DOWN to
// the finalists, finalists point DOWN to the winner. Both drops clear the frame padding
// (~23px) so the titled "Final"/"Winner" frames never overlap.
const SF_TO_FINAL = 40 // drop from the semi-finals' bottom to the finalist row
const FINAL_TO_WINNER = 40 // drop from the finalists to the winner

// Padding of the titled "Final" / "Winner" frames around their slots.
const FRAME_PAD_X = 8
const FRAME_PAD_TOP = 15 // extra room so the title legend clears the slots
const FRAME_PAD_BOTTOM = 8

// Minimum gaps — grown to fill the container width (up to MAX_CANVAS).
const COL_GAP_MIN = 10
const SIDE_GAP_MIN = 40

interface SizeTier {
    block: number
    finalist: number
    winner: number
    round1Gap: number // vertical gap between adjacent first-round ties
}
const SMALL: SizeTier = { block: 30, finalist: 42, winner: 54, round1Gap: 12 }
const LARGE: SizeTier = { block: 40, finalist: 54, winner: 72, round1Gap: 16 }
const TIERS = [LARGE, SMALL] // widest first; pick the largest tier that fits

export interface LayoutConfig {
    block: number
    finalist: number
    winner: number
    round1Gap: number
    colGap: number
    sideGap: number
    flagSize: number
    finalistFlag: number
    winnerFlag: number
    trophyFont: number
    tokenFont: number
}

// Narrowest width a tier can render at (every gap at its minimum).
function tierMinWidth(tier: SizeTier, R: number): number {
    return 2 * R * tier.block + (2 * R - 2) * COL_GAP_MIN + SIDE_GAP_MIN
}

// Resolve sizes + gaps for the available container width. A wider container crosses a
// breakpoint into the larger slot tier; any spare width is spread evenly across every
// gap so the bracket fills the container (never exceeding MAX_CANVAS).
export function resolveLayoutConfig(containerWidth: number, R: number): LayoutConfig {
    const target = Math.min(Math.max(containerWidth, 0), MAX_CANVAS)
    const tier = TIERS.find((t) => tierMinWidth(t, R) <= target) ?? SMALL

    const minWidth = tierMinWidth(tier, R)
    const gapSlots = 2 * R - 1 // (2R-2) column gaps + 1 centre gap
    const extra = Math.max(0, target - minWidth)
    const perGap = extra / gapSlots

    return {
        block: tier.block,
        finalist: tier.finalist,
        winner: tier.winner,
        round1Gap: tier.round1Gap,
        colGap: COL_GAP_MIN + perGap,
        sideGap: SIDE_GAP_MIN + perGap,
        flagSize: Math.round(tier.block * 0.84),
        finalistFlag: Math.round(tier.finalist * 0.72),
        winnerFlag: Math.round(tier.winner * 0.7),
        trophyFont: Math.round(tier.winner * 0.62),
        tokenFont: tier.block >= 38 ? 14 : 12,  
    }
}

export interface BlockPos {
    key: string
    x: number
    y: number
    side: BracketSide
    round: GameSubType
    slot: BracketSlotInfo
}

export interface Connector {
    key: string
    d: string
}

export interface SlotAnchor {
    side: BracketSide
    x: number // left edge
    y: number // top edge
}

export interface BracketLayout {
    width: number
    height: number
    centerX: number
    block: number
    finalist: number
    winner: number
    flagSize: number
    finalistFlag: number
    winnerFlag: number
    trophyFont: number
    tokenFont: number
    blocks: BlockPos[]
    connectors: Connector[]
    finalists: SlotAnchor[]
    winnerPos: { x: number; y: number }
    finalFrame: { x: number; y: number; width: number; height: number }
    winnerFrame: { x: number; y: number; width: number; height: number }
}

// Side rounds, outer → inner (Final already excluded by the caller).
export function computeBracketLayout(
    games: BracketGame[],
    rounds: GameSubType[],
    config: LayoutConfig,
): BracketLayout {
    const { block: BLOCK, finalist: FINALIST, winner: WINNER, round1Gap, colGap, sideGap } = config
    const TIE_H = 2 * BLOCK + INTRA
    const COL_PITCH = BLOCK + colGap

    const R = rounds.length
    const width = 2 * R * BLOCK + (2 * R - 2) * colGap + sideGap

    const colX = (side: BracketSide, r: number) =>
        side === 'left' ? r * COL_PITCH : width - BLOCK - r * COL_PITCH

    const blocks: BlockPos[] = []
    const connectors: Connector[] = []

    // Per-side vertical centres, computed by recursion: an inner tie sits at the
    // midpoint of the two ties that feed it.
    const sideData: Record<BracketSide, { perRound: BracketGame[][]; centers: number[][] }> = {
        left: { perRound: [], centers: [] },
        right: { perRound: [], centers: [] },
    }

    const sides: BracketSide[] = ['left', 'right']
    for (const side of sides) {
        const perRound = rounds.map((round) => games.filter((g) => g.side === side && g.round === round))
        const centers: number[][] = []
        for (let r = 0; r < R; r++) {
            if (r === 0) {
                centers[r] = perRound[0].map((_, i) => TOP_PAD + TIE_H / 2 + i * (TIE_H + round1Gap))
            } else {
                centers[r] = perRound[r].map((_, j) => {
                    const a = centers[r - 1][2 * j] ?? 0
                    const b = centers[r - 1][2 * j + 1] ?? a
                    return (a + b) / 2
                })
            }
        }
        sideData[side] = { perRound, centers }

        // Blocks (two per tie: home on top, away below).
        perRound.forEach((ties, r) => {
            ties.forEach((tie, i) => {
                const cy = centers[r][i]
                const x = colX(side, r)
                blocks.push({
                    key: `${side}-${tie.bracket_game_id}-h`,
                    x,
                    y: cy - TIE_H / 2,
                    side,
                    round: tie.round,
                    slot: tie.home_slot,
                })
                blocks.push({
                    key: `${side}-${tie.bracket_game_id}-a`,
                    x,
                    y: cy - TIE_H / 2 + BLOCK + INTRA,
                    side,
                    round: tie.round,
                    slot: tie.away_slot,
                })
            })
        })

        // Incoming connectors: each inner-round slot is fed by one outer-round tie.
        // Feeder 2j (upper) → home slot, feeder 2j+1 (lower) → away slot. "-|_" elbow.
        for (let r = 1; r < R; r++) {
            perRound[r].forEach((_, j) => {
                const targetCy = centers[r][j]
                const targetX = colX(side, r)
                const inX = side === 'left' ? targetX : targetX + BLOCK // outward edge
                const feederX = colX(side, r - 1)
                const outX = side === 'left' ? feederX + BLOCK : feederX // inward edge
                const midX = (outX + inX) / 2
                const draw = (feederIdx: number, slotCy: number, tag: string) => {
                    const fy = centers[r - 1][feederIdx]
                    if (fy == null) return
                    connectors.push({
                        key: `${side}-c-${r}-${j}-${tag}`,
                        d: `M ${outX} ${fy} H ${midX} V ${slotCy} H ${inX}`,
                    })
                }
                draw(2 * j, targetCy - (BLOCK + INTRA) / 2, 'h')
                draw(2 * j + 1, targetCy + (BLOCK + INTRA) / 2, 'a')
            })
        }
    }

    // ── Bottom final area (in the empty central gap below the semi-finals) ──
    const centerX = width / 2
    const treeBottom = Math.max(
        ...sides.map((side) => {
            const c0 = sideData[side].centers[0] ?? []
            const last = c0.length ? c0[c0.length - 1] : 0
            return last + TIE_H / 2
        }),
    )

    const sfCenterY = (side: BracketSide) => {
        const inner = sideData[side].centers[R - 1] ?? []
        return inner.length ? inner[0] : treeBottom / 2
    }
    const sfBottom = Math.max(sfCenterY('left'), sfCenterY('right')) + TIE_H / 2

    const finalY = sfBottom + SF_TO_FINAL
    const leftFinalX = centerX - FINAL_GAP / 2 - FINALIST
    const rightFinalX = centerX + FINAL_GAP / 2
    const finalists: SlotAnchor[] = [
        { side: 'left', x: leftFinalX, y: finalY },
        { side: 'right', x: rightFinalX, y: finalY },
    ]

    const winnerY = finalY + FINALIST + FINAL_TO_WINNER
    const winnerPos = { x: centerX - WINNER / 2, y: winnerY }

    // Titled frames wrapping the finalist pair ("Final") and the champion ("Winner").
    const finalFrame = {
        x: leftFinalX - FRAME_PAD_X,
        y: finalY - FRAME_PAD_TOP,
        width: rightFinalX + FINALIST - leftFinalX + 2 * FRAME_PAD_X,
        height: FINALIST + FRAME_PAD_TOP + FRAME_PAD_BOTTOM,
    }
    const winnerFrame = {
        x: winnerPos.x - FRAME_PAD_X,
        y: winnerY - FRAME_PAD_TOP,
        width: WINNER + 2 * FRAME_PAD_X,
        height: WINNER + FRAME_PAD_TOP + FRAME_PAD_BOTTOM,
    }

    // Semi-final → finalist (points down), then finalists → winner.
    for (const side of sides) {
        const sfX = colX(side, R - 1) + BLOCK / 2
        const sy = sfCenterY(side) + TIE_H / 2
        const fx = (side === 'left' ? leftFinalX : rightFinalX) + FINALIST / 2
        const midY = (sy + finalY) / 2
        connectors.push({ key: `${side}-sf-final`, d: `M ${sfX} ${sy} V ${midY} H ${fx} V ${finalY}` })

        const fbY = finalY + FINALIST
        const midY2 = (fbY + winnerY) / 2
        connectors.push({ key: `${side}-final-winner`, d: `M ${fx} ${fbY} V ${midY2} H ${centerX} V ${winnerY}` })
    }

    const framesBottom = Math.max(
        finalFrame.y + finalFrame.height,
        winnerFrame.y + winnerFrame.height,
    )
    const height = Math.max(treeBottom, winnerY + WINNER, framesBottom) + TOP_PAD

    return {
        width,
        height,
        centerX,
        block: BLOCK,
        finalist: FINALIST,
        winner: WINNER,
        flagSize: config.flagSize,
        finalistFlag: config.finalistFlag,
        winnerFlag: config.winnerFlag,
        trophyFont: config.trophyFont,
        tokenFont: config.tokenFont,
        blocks,
        connectors,
        finalists,
        winnerPos,
        finalFrame,
        winnerFrame,
    }
}
