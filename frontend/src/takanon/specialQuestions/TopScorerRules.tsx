import React from 'react'

interface Props {
    scoreConfig: {
        correct: number
        eachGoal: number
    }
}

function TopScorerRules({ scoreConfig }: Props) {
    const { correct, eachGoal } = scoreConfig
    const hasEachGoalBet = eachGoal > 0
    return (
        <>
            <h5 className="underlined">מלך שערים</h5>
            <h5>השחקן שסיים את הטורניר עם הכי הרבה שערים</h5>
            {hasEachGoalBet && (
                <table className='scoresConfigTable'>
                    <thead>
                        <tr>
                            <th></th>
                            <th>ניקוד</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className='scoreRuleLabel'>לכל גול</td>
                            <td>{scoreConfig.eachGoal}</td>
                        </tr>
                        <tr>
                            <td className='scoreRuleLabel'>זכייה בתואר "מלך השערים"</td>
                            <td>{scoreConfig.correct}</td>
                        </tr>
                    </tbody>
                </table>
            )}
            {!hasEachGoalBet && (
                <h5>{correct} נקודות</h5>
            )}
            <ul style={{ marginTop: 4 }}>
                <li>
                    לא ניתן להחליף מלך שערים במהלך הטורניר (גם אם שחקן נפצע)
                </li>
                <li>
                    במידה ויש תיקו במלך השערים - כל ניחוש על אחד מהשחקנים יזכה את
                    המנחש ב{scoreConfig.correct} הנק' על זכייה בתואר
                </li>
            </ul>
        </>
    )
}

export default TopScorerRules
