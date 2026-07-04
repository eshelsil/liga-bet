import React from 'react'
import { useTranslation } from 'react-i18next'
import { BracketSpecialRole, cn } from '../../utils'
import './SpecialRoleBadge.scss'

// The 🏆/🥈 chip marking a team the contestant picked as Winner / Runner-Up.
// Reuses the knockout_bracket card.* copy shared with the bracket card.
function SpecialRoleBadge({
    role,
    className,
}: {
    role: BracketSpecialRole
    className?: string
}) {
    const { t } = useTranslation('knockout_bracket')
    if (!role) {
        return null
    }
    return (
        <div
            className={cn('LB-SpecialRoleBadge', className)}
            title={t(
                role === 'winner' ? 'card.winnerBadge' : 'card.runnerUpBadge'
            )}
        >
            <span>
                {t(
                    role === 'winner'
                        ? 'card.winnerBadgeSmall'
                        : 'card.runnerUpBadgeSmall'
                )}
            </span>
        </div>
    )
}

export default SpecialRoleBadge
