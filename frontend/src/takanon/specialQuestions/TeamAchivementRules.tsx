import React from 'react'
import { sum } from 'lodash'

interface Props {
    label: string
    scoreConfig: Record<string, number>
}

function TeamAchivementRules({ label, scoreConfig }: Props) {
    const maxScore = sum(Object.values(scoreConfig).map(val => Number(val)))
    return (
        <>
            <h5 className="underlined">{label}</h5>
            <h5>מקסימום נקודות - {maxScore}</h5>
            <p>כל העפלת שלב תזכה את המהמר במספר נקודות</p>
            <table>
                <thead>
                    <tr>
                        <th>הגעה לשלב</th>
                        {Object.entries(scoreConfig).map(([name, score]) => (
                            <th key={name}>{name}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="bold">נקודות</td>
                        {Object.entries(scoreConfig).map(([name, score]) => (
                            <td key={name}>{score}</td>
                        ))}
                    </tr>
                </tbody>
            </table>
            <br />
        </>
    )
}

export default TeamAchivementRules
