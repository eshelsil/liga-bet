import React from 'react';
import { keysOf, matchRuleToString, valuesOf } from '../../utils';
import { GameBetBonusesScoreConfig, GameBetScoreConfig } from '../../types';
import { getHebStageName } from '../../strings';
import { getKoScoreSums, getTotalScore } from './utils';
import { useSelector } from 'react-redux';
import { IsUCL } from '../../_selectors';


function GameBetScore({
    scoreConfig,
    gamesCount,
    bonuses = {},
    isKo = false,
}: {
    scoreConfig: GameBetScoreConfig
    gamesCount: number
    bonuses?: GameBetBonusesScoreConfig
    isKo?: boolean
}) {
    const isUcl = useSelector(IsUCL)
    const bonusKeys = keysOf(bonuses).reverse()
    const bonusValues = valuesOf(bonuses).reverse()

    const {
        maxScore,
        baseGameScore = 0,
        qualifier = 0,
    } = isKo ? getKoScoreSums({scoreConfig, bonuses, isUcl, gamesCount}) : {maxScore: getTotalScore(scoreConfig) * gamesCount, baseGameScore: getTotalScore(scoreConfig)}    

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
                        <td style={{whiteSpace:'pre-line'}}>
                            {(isUcl && qualifier > 0)
                            ? (<>
                                <span>{baseGameScore}</span>
                                <span style={{display: 'block',  textAlign: 'center', fontSize: 11}}>
                                    ({qualifier}+)
                                </span>
                            </>)
                            : baseGameScore}
                        </td>
                        {bonusValues.map((scoreConfig, index) => {
                            const {qualifier: qualifierBonus = 0, ...basicBonuses} = scoreConfig;
                            const score = getTotalScore(basicBonuses) + baseGameScore
                            const qualifierBonusScore = Number(qualifierBonus) + qualifier;
                            return (
                                <td key={index}  style={{whiteSpace:'pre-line'}}>
                                    {(isUcl && qualifierBonusScore > 0)
                                    ? (<>
                                        <span>{score}</span>
                                        <span style={{display: 'block', textAlign: 'center', fontSize: 11}}>
                                            ({qualifierBonusScore}+)
                                        </span>
                                    </>)
                                    : (score + qualifierBonusScore)}
                                </td>
                            )
                        })}
                    </tr>
                </tbody>
            </table>
            <h5>מקסימום נקודות - {maxScore}</h5>
        </>
    )
}

export default GameBetScore
