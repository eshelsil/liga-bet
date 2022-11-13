import React from 'react'
import { EachGoalBet } from '../../types'

interface Props {
    scoreConfig: EachGoalBet
}

function MostAssistsRules({ scoreConfig }: Props) {
    const { correct, eachGoal } = scoreConfig
    const hasEachGoalBet = eachGoal > 0
    return (
        <>
            <h5 className="underlined">מלך בישולים</h5>
            <h5>השחקן שסיים את הטורניר עם הכי הרבה בישולים</h5>
            {hasEachGoalBet  && (
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
                            <td className='scoreRuleLabel'>זכייה בתואר "מלך הבישולים"</td>
                            <td>{scoreConfig.correct}</td>
                        </tr>
                    </tbody>
                </table>
            )}
            {!hasEachGoalBet  && (
                <h5>{correct} נקודות</h5>
            )}
            <ul style={{ marginTop: 4 }}>
                <li>
                    לא ניתן להחליף מלך בישולים במהלך הטורניר (גם אם שחקן נפצע)
                </li>
                <li>
                    במקרה של תיקו - כל הימור על אחד מהשחקנים יזכה את
                    המהמר ב{scoreConfig.correct} הנקודות על זכייה בתואר
                </li>
            </ul>
        </>
    )
}

export default MostAssistsRules
