import React from 'react'
import { BracketSlotInfo } from '../types'
import { bracketSlotLabel, bracketTeamToTeam } from '../utils'
import TeamFlag from '../widgets/TeamFlag/TeamFlag'
import { useBracketTree } from './BracketTreeContext'

// One square block of a tie — CONTEXT only. A resolved team → just its circle flag
// (chosen finalists are highlighted; never clickable). A first-round source token
// ("1A" / "3RD place") is tappable to open that group's standings. Later-round / undrawn
// slots are blank boxes. Sizing is driven by the responsive layout.
function BracketSlotView({
    slot,
    flagSize,
    tokenFont,
    result = null,
    pos = null,
}: {
    slot: BracketSlotInfo
    flagSize: number
    tokenFont: number
    result?: 'win' | 'loss' | null // this slot's tie outcome for its team (decided ties only)
    pos?: 'top' | 'bottom' | null // which side of the tie this slot sits on
}) {
    const ctx = useBracketTree()
    const team = slot.team

    if (team) {
        const finalist = ctx.isFinalist(team.id)
        const won = result === 'win'
        const lost = result === 'loss'
        // A lost tie: my pick → red ✕ (knocked out here); any other team → just greyed out.
        const eliminatedPick = finalist && lost
        const out = lost && !finalist
        return (
            <div
                className={[
                    'LB-BracketSlot',
                    'BracketSlot-team',
                    pos === 'top' ? 'BracketSlot-top' : '',
                    pos === 'bottom' ? 'BracketSlot-bottom' : '',
                    finalist ? 'BracketSlot-finalist' : '',
                    eliminatedPick ? 'BracketSlot-eliminated' : '',
                    out ? 'BracketSlot-out' : '',
                    won ? 'team-won' : '',
                ].join(' ')}
                title={team.name}
            >
                <TeamFlag team={bracketTeamToTeam(team)} size={flagSize} />
                {eliminatedPick && <span className="Slot-elimX">✕</span>}
                {won && <span className="Slot-advanceCheck">✓</span>}
            </div>
        )
    }

    const text = bracketSlotLabel(slot)
    if (text) {
        const onClick = slot.is_third_place
            ? ctx.onOpenThirdPlace
            : slot.group_id != null
              ? () => ctx.onOpenGroup(slot.group_id as number, slot.position)
              : undefined
        return (
            <div
                className={['LB-BracketSlot', 'BracketSlot-token', onClick ? 'BracketSlot-clickable' : ''].join(' ')}
                onClick={onClick}
                role={onClick ? 'button' : undefined}
            >
                <span className="BracketSlot-tokenText" style={{ fontSize: tokenFont }}>
                    {text}
                </span>
            </div>
        )
    }

    return <div className="LB-BracketSlot BracketSlot-empty" />
}

export default BracketSlotView
