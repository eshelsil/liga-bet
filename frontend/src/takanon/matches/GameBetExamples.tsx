import React from 'react';
import { MatchRuleType, GameBetScoreConfig, Team, WinnerSide } from '../../types';
import { getWinnerSide, matchRuleToString } from '../../utils';
import { getExtraTimeString, getFullTimeString, getPenaltiesString, getQualifier } from './utils';
import TeamAndSymbol from '../../widgets/TeamWithFlag';


interface GameExample {
    bet: number[]
    qualifier?: WinnerSide
    game: {
        fullTime: number[]
        extraTime?: number[]
        penalties?: number[]
        homeTeam: Team
        awayTeam: Team
    }
}

const qualifierString = '(מעפילה)'

function Example({
    example: {
        bet,
        qualifier,
        game: { fullTime, extraTime, penalties, homeTeam, awayTeam },
    },
    scoresConfig,
}: {
    example: GameExample
    scoresConfig: GameBetScoreConfig
}) {
    const betWinnerSide = getWinnerSide(bet[0], bet[1])
    const actualWinnerSide = getWinnerSide(fullTime[0], fullTime[1])

    const hasQualifierBet = !!scoresConfig.qualifier
    const betQualifier = qualifier ?? betWinnerSide

    const hitResult = bet[0] === fullTime[0] && bet[1] === fullTime[1]
    const hitWinnerSide = betWinnerSide === actualWinnerSide
    const hitQualifier =
        hasQualifierBet &&
        betQualifier === getQualifier(fullTime, extraTime, penalties)

    const resultScore = hitResult ? scoresConfig.result : 0
    const winnerSideScore = hitWinnerSide ? scoresConfig.winnerSide : 0
    const qualifierScore = hitQualifier ? scoresConfig.qualifier : 0

    const totalScore = qualifierScore + winnerSideScore + resultScore

    return (
        <tr>
            <td style={{ padding: 8 }}>
                <div style={{ display: 'flex' }}>
                    <TeamAndSymbol {...homeTeam} />
                    <span style={{ marginRight: 5 }}> - {bet[0]}</span>
                    {qualifier === WinnerSide.Home && (
                        <span style={{ marginRight: 5 }}>
                            {qualifierString}
                        </span>
                    )}
                </div>
                <div style={{ display: 'flex' }}>
                    <TeamAndSymbol {...awayTeam} />
                    <span style={{ marginRight: 5 }}> - {bet[1]}</span>
                    {qualifier === WinnerSide.Away && (
                        <span style={{ marginRight: 5 }}>
                            {qualifierString}
                        </span>
                    )}
                </div>
            </td>
            <td style={{ padding: 8 }}>
                <div>
                    {getFullTimeString(fullTime, homeTeam.name, awayTeam.name)}
                </div>
                <div>
                    {extraTime &&
                        getExtraTimeString(
                            extraTime,
                            homeTeam.name,
                            awayTeam.name
                        )}
                </div>
                <div>
                    {penalties &&
                        getPenaltiesString(
                            penalties,
                            homeTeam.name,
                            awayTeam.name
                        )}
                </div>
            </td>
            <td style={{ padding: 8 }}>{totalScore}</td>
            <td style={{ padding: 8 }}>
                <div>
                    {`${
                        matchRuleToString[MatchRuleType.WinnerSide]
                    } - ${winnerSideScore} נק'`}
                </div>
                <div>
                    {`${
                        matchRuleToString[MatchRuleType.Result]
                    } - ${resultScore} נק'`}
                </div>
                {hasQualifierBet && (
                    <div>
                        {`${
                            matchRuleToString[MatchRuleType.Qualifier]
                        } - ${qualifierScore} נק'`}
                    </div>
                )}
            </td>
        </tr>
    )
}

function GameBetExamples({
    examples,
    scoresConfig,
}: {
    examples: GameExample[]
    scoresConfig: GameBetScoreConfig
}) {
    return (
        <>
            <h5 className="underlined">דוגמאות</h5>
            <table>
                <thead>
                    <tr>
                        <th>הימור</th>
                        <th>תוצאה בפועל</th>
                        <th>ניקוד</th>
                        <th>הסבר</th>
                    </tr>
                </thead>
                <tbody>
                    {examples.map((example, index) => (
                        <Example
                            key={index}
                            example={example}
                            scoresConfig={scoresConfig}
                        />
                    ))}
                </tbody>
            </table>
        </>
    )
}

export default GameBetExamples
