import React from 'react'
import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import { useTranslation } from 'react-i18next'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import { BracketSide, BracketTeam } from '../types'
import { bracketTeamToTeam } from '../utils'
import TeamWithFlag from '../widgets/TeamFlag/TeamWithFlag'

interface Props {
    open: boolean
    leftTeam: BracketTeam | null
    rightTeam: BracketTeam | null
    winnerSide: BracketSide | null // currently crowned side (highlighted), if any
    onSelect: (side: BracketSide) => void
    onClose: () => void
}

// Select the champion from the two finalists. Opened by tapping the trophy slot — the
// only options are the two chosen finalists (the winner must be one of them).
function WinnerPickerDialog({ open, leftTeam, rightTeam, winnerSide, onSelect, onClose }: Props) {
    const { t } = useTranslation('knockout_bracket')

    const row = (team: BracketTeam | null, side: BracketSide) => {
        if (!team) return null
        return (
            <div
                key={side}
                className={`FinalistPicker-item ${winnerSide === side ? 'is-champion' : ''}`}
                role="button"
                onClick={() => onSelect(side)}
            >
                <TeamWithFlag team={bracketTeamToTeam(team)} size={28} />
                {winnerSide === side && (
                    <EmojiEventsIcon className="WinnerPicker-trophy" fontSize="small" />
                )}
            </div>
        )
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle className="FinalistPicker-title">
                {t('final.prompt')}
            </DialogTitle>
            <DialogContent className="LB-FinalistPicker">
                {row(leftTeam, 'left')}
                {row(rightTeam, 'right')}
            </DialogContent>
        </Dialog>
    )
}

export default WinnerPickerDialog
