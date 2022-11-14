import React from 'react'
import { sortBy, sum } from 'lodash'
import { getHebCompetitionStageName } from '../../strings'
import { CompetitionStageName, EnumRecord } from '../../types'


function sortAchivementStage ([name, score]: [name: CompetitionStageName, score: number]) {
    const stagesOrder = [
        CompetitionStageName.QuarterFinal,
        CompetitionStageName.SemiFinal,
        CompetitionStageName.Final,
        CompetitionStageName.Winning,
    ]
    return stagesOrder.indexOf(name)
}
interface Props {
    label: string
    scoreConfig: EnumRecord<CompetitionStageName, number>
    isRunnerUp?: boolean
}

function TeamAchivementRules({ label, scoreConfig, isRunnerUp = false }: Props) {
    const maxScore = sum(Object.values(scoreConfig).map(val => Number(val)))
    return (
        <>
            <h5 className="underlined">{label}</h5>
            <p>כל העפלת שלב תזכה את המנחש במספר נקודות</p>
            <table className='scoresConfigTable'>
                <thead>
                    <tr>
                        <th>הישג</th>
                        <th>נקודות</th>
                    </tr>
                </thead>
                <tbody>
                        {sortBy(Object.entries(scoreConfig), sortAchivementStage).map(([name, score]) => (
                            score > 0
                            ? (
                                <tr key={name}>
                                    <td className='alignToRight'>{getHebCompetitionStageName(name as CompetitionStageName)}</td>
                                    <td>{score}</td>
                                </tr>
                            ) : null
                        ))}
                </tbody>
            </table>
            <h5>מקסימום נקודות - {maxScore}</h5>
            {isRunnerUp && (
                <ul style={{ marginTop: 4 }}>
                    <li>
                        לא ניתן לבחור אותה קבוצה גם כ"סגנית" וגם כ"זוכה"
                    </li>
                </ul>
            )}
        </>
    )
}

export default TeamAchivementRules
