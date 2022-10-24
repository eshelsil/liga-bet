import React from 'react'

interface Props {
    scoreConfig: {
        correct: number
        eachGoal: number
    }
}

function TopScorerRules({ scoreConfig }: Props) {
    return (
        <>
            <h5 className="underlined">מלך שערים</h5>
            <table>
                <thead>
                    <tr>
                        <th>הימור</th>
                        <th>ניקוד</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>לכל גול</td>
                        <td>{scoreConfig.eachGoal}</td>
                    </tr>
                    <tr>
                        <td>זכייה בתואר</td>
                        <td>{scoreConfig.correct}</td>
                    </tr>
                </tbody>
            </table>
            <ul style={{ marginTop: 8 }}>
                <li>
                    לא ניתן להחליף מלך שערים במהלך הטורניר (גם אם שחקן נפצע)
                </li>
                <li>
                    במידה ויש תיקו במלך שערים - כל הימור על אחד מהשחקנים יזכה את
                    המהמר ב{scoreConfig.correct} הנק' על זכייה בתואר
                </li>
            </ul>
        </>
    )
}

export default TopScorerRules
