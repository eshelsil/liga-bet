import React from 'react'
import { matchRuleToString } from '../../utils'
import { GameBetScoreConfig } from './types'
import { sum } from 'lodash'

function GameBetScore({
    scoreConfig,
    gamesCount,
}: {
    scoreConfig: GameBetScoreConfig
    gamesCount: number
}) {
    const totalScore = sum(Object.values(scoreConfig))
    const maxScore = totalScore * gamesCount
    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th>הימור</th>
                        <th>ניקוד</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(scoreConfig).map(([rule, score]) => (
                        <tr key={rule} className="bold">
                            <td>{matchRuleToString[rule]}</td>
                            <td>{score}</td>
                        </tr>
                    ))}
                    <tr className="divide">
                        <td>סכום למשחק</td>
                        <td>{totalScore}</td>
                    </tr>
                </tbody>
            </table>
            <h5>מקסימום נקודות - {maxScore}</h5>
        </>
    )
}

export default GameBetScore
