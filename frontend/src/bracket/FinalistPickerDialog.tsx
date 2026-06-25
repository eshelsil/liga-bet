import React from 'react'
import { Dialog, DialogContent, DialogTitle, Divider } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { BracketSide, BracketTeam, Team } from '../types'
import { bracketTeamToTeam } from '../utils'
import TeamWithFlag from '../widgets/TeamFlag/TeamWithFlag'

interface Props {
    side: BracketSide | null // open when non-null
    sideTeams: BracketTeam[] // teams on this half of the bracket (ordered by position)
    notPlaced: Team[] // teams not yet placed in the bracket — allowed on either side
    onSelect: (teamId: number) => void
    onClose: () => void
}

// Team menu opened by tapping a finalist slot. Only teams the finalist could legally be
// appear: this side's teams + teams not yet placed (undetermined). The other side's teams
// are intentionally absent (Winner & Runner-Up come from opposite halves).
function FinalistPickerDialog({ side, sideTeams, notPlaced, onSelect, onClose }: Props) {
    const { t } = useTranslation('knockout_bracket')

    const row = (team: Team, key: string) => (
        <div key={key} className="FinalistPicker-item" role="button" onClick={() => onSelect(team.id)}>
            <TeamWithFlag team={team} size={28} />
        </div>
    )

    return (
        <Dialog open={side != null} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle className="FinalistPicker-title">
                {side === 'right' ? t('picker.titleRight') : t('picker.titleLeft')}
            </DialogTitle>
            <DialogContent className="LB-FinalistPicker">
                {sideTeams.map((team) => row(bracketTeamToTeam(team), `s-${team.id}`))}
                {notPlaced.length > 0 && (
                    <>
                        <Divider className="FinalistPicker-divider" textAlign="left">
                            {t('select.otherTeams')}
                        </Divider>
                        {notPlaced.map((team) => row(team, `n-${team.id}`))}
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default FinalistPickerDialog
