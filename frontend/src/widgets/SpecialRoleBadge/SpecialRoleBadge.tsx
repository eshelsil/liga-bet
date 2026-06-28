import React from 'react'
import { useTranslation } from 'react-i18next'
import { BracketSpecialRole } from '../../utils'
import './SpecialRoleBadge.scss'

// The 🏆/🥈 chip marking a team the contestant picked as Winner / Runner-Up.
// Reuses the knockout_bracket card.* copy shared with the bracket card.
function SpecialRoleBadge({ role }: { role: BracketSpecialRole }) {
    const { t } = useTranslation('knockout_bracket')
    if (!role) {
        return null
    }
    return (
        <span className="LB-SpecialRoleBadge" title={t(role === 'winner' ? 'card.winnerBadge' : 'card.runnerUpBadge')}>
            {t(role === 'winner' ? 'card.winnerBadgeSmall' : 'card.runnerUpBadgeSmall')}
        </span>
    )
}

export default SpecialRoleBadge
