import React from 'react';
import { sumBy } from 'lodash';
import { keysOf, matchRuleToString, valuesOf } from '../../utils';
import { GameBetBonusesScoreConfig, GameBetScoreConfig, KnockoutStage } from '../../types';
import { getHebStageName } from '../../strings';
import { getBonusMaxScore, getTotalScore } from './utils';


function GameBetScore({
    scoreConfig,
    gamesCount,
    bonuses = {},
}: {
    scoreConfig: GameBetScoreConfig
    gamesCount: number
    bonuses?: GameBetBonusesScoreConfig
}) {
    const bonusKeys = keysOf(bonuses).reverse()
    const bonusValues = valuesOf(bonuses).reverse()


    const totalScore = getTotalScore(scoreConfig)
    const maxBonusesScore = sumBy(
        Object.entries(bonuses),
        ([stage, config]) => getBonusMaxScore(stage as KnockoutStage, config)
    )
    const maxScore = totalScore * gamesCount + maxBonusesScore

    return (
        <>
            <table className='scoresConfigTable'>
                <thead>
                    <tr>
                        <th></th>
                        <th>ניקוד</th>
                        {bonusKeys.map(stageName => (
                            <th key={stageName}>{getHebStageName(stageName)}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(scoreConfig).map(([rule, score]) => (
                        score > 0
                        ? (
                            <tr key={rule}>
                                <td className='scoreRuleLabel'>{matchRuleToString[rule]}</td>
                                <td>{score}</td>
                                {bonusValues.map((scoreConfig, index) => (
                                    <td key={index}>{score + scoreConfig[rule]}</td>
                                ))}
                            </tr>
                        ) : null
                    ))}
                    <tr className="divide">
                        <td className='scoreRuleLabel'>סכום למשחק</td>
                        <td>{totalScore}</td>
                        {bonusValues.map((scoreConfig, index) => (
                            <td key={index}>{totalScore + getTotalScore(scoreConfig)}</td>
                        ))}
                    </tr>
                </tbody>
            </table>
            <h5>מקסימום נקודות - {maxScore}</h5>
        </>
    )
}

export default GameBetScore
