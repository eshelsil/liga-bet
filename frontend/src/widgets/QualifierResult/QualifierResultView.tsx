import React from 'react'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import TeamFlag from '../TeamFlag/TeamFlag'
import { Team, WinnerSide } from '../../types'
import { BracketSpecialRole, cn } from '../../utils'
import SpecialRoleBadge from '../SpecialRoleBadge/SpecialRoleBadge'
import AutoBetBadge from '../AutoBetBadge/AutoBetBadge'
import './QualifierResult.scss'

interface QualifierSideData {
    team: Team
    role?: BracketSpecialRole
}

interface QualifierResultProps {
    home: QualifierSideData
    away: QualifierSideData
    // The advancing side: a picked qualifier (bet view) or the actual qualifier (result view).
    qualifier?: WinnerSide | null
    isAutoBet?: boolean
    // Fade the side that did not advance. On for the result-like outcome view,
    // off for the bet view (which only highlights the pick).
    dimNonQualifier?: boolean
}

// Qualifier-only display (no scores): the advancing team is marked with a
// check/advance icon. In the result view the eliminated team is also dimmed.
// Used for both the contestant's pick and the actual outcome in knockout
// result-bet-OFF tournaments.
function QualifierResultView({ home, away, qualifier, isAutoBet, dimNonQualifier = true }: QualifierResultProps) {
    const side = (data: QualifierSideData, sideKey: WinnerSide) => {
        const qualified = qualifier === sideKey
        // Once a qualifier is known, fade the side that did not advance.
        const dimmed = dimNonQualifier && !!qualifier && !qualified
        return (
            <div className={cn('QualifierResult-side', { 'is-dimmed': dimmed })}>
                <TeamFlag size={32} team={data.team} />
                {data.role && <SpecialRoleBadge role={data.role} />}
                {qualified && (
                    <CheckCircleOutlineIcon className="QualifierResult-advance" sx={{ fontSize: 18 }} />
                )}
            </div>
        )
    }

    return (
        <div className={cn('LB-QualifierResult', { 'GameBetsTable-autoBet': isAutoBet })}>
            <div className="QualifierResult-content">
                {side(home, WinnerSide.Home)}
                <div className="QualifierResult-delimiter">-</div>
                {side(away, WinnerSide.Away)}
                {isAutoBet && (
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-2">
                        <AutoBetBadge />
                    </div>
                )}
            </div>
        </div>
    )
}

export default QualifierResultView
