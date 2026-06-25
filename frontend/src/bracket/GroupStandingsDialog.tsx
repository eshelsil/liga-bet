import React from 'react'
import { Dialog, DialogContent } from '@mui/material'
import BracketGroupStandings from './BracketGroupStandings'
import { GroupStanding } from './useBracketTeams'

interface Props {
    group: GroupStanding | null
    highlightPosition?: number | null // mark the target rank the bracket slot resolves from
    seeded: Set<number>
    unqualified: Set<number>
    onClose: () => void
}

// Full standings for one group: stats table with qualified (green) / out (red) teams,
// and the bracket slot's target position highlighted.
function GroupStandingsDialog({ group, highlightPosition, seeded, unqualified, onClose }: Props) {
    return (
        <Dialog className="LB-GroupDialog" open={!!group} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogContent>
                {group && (
                    <BracketGroupStandings
                        group={group}
                        seeded={seeded}
                        unqualified={unqualified}
                        highlightPosition={highlightPosition}
                    />
                )}
            </DialogContent>
        </Dialog>
    )
}

export default GroupStandingsDialog
