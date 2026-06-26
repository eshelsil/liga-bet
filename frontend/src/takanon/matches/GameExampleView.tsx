import React from 'react';
import { useTranslation } from 'react-i18next';
import { MatchRuleType, GameBetScoreConfig, Team, WinnerSide } from '../../types';
import { getWinnerSide, matchRuleToString } from '../../utils';
import { getQualifier } from './utils';
import MatchResultView from '../../widgets/MatchResult/MatchResultView';
import { GameExample } from './types';


function GameExampleView({
    example: {
        bet,
        qualifier,
        game:   { fullTime, extraTime, penalties, homeTeam, awayTeam, isKnockout = false },
    },
    scoresConfig,
}: {
    example: GameExample
    scoresConfig: GameBetScoreConfig
}) {
    const { t } = useTranslation('takanon')
    const betWinnerSide = getWinnerSide(bet[0], bet[1])
    const actualWinnerSide = getWinnerSide(fullTime[0], fullTime[1])

    const hasQualifierBet = !!scoresConfig.qualifier
    const betQualifier = qualifier ?? betWinnerSide
    const actualQualifier = isKnockout ? getQualifier(fullTime, extraTime, penalties) : undefined

    const hitResult = bet[0] === fullTime[0] && bet[1] === fullTime[1]
    const hitWinnerSide = betWinnerSide === actualWinnerSide
    const hitQualifier =
        hasQualifierBet &&
        betQualifier === actualQualifier

    const resultScore = hitResult ? scoresConfig.result : 0
    const winnerSideScore = hitWinnerSide ? scoresConfig.winnerSide : 0
    const qualifierScore = hitQualifier ? scoresConfig.qualifier : 0


    const totalScore = qualifierScore + winnerSideScore + resultScore

    return (
        <div className='LB-GameExampleView'>
            <div className='GameExampleView-results'>
                <div className='resultWrapper'>
                    <MatchResultView
                        title={t('matches.betTitle')}
                        home={{
                            team: homeTeam,
                            score: bet[0],
                        }}
                        away={{
                            team: awayTeam,
                            score: bet[1],
                        }}
                        isKnockout={isKnockout}
                        qualifier={hasQualifierBet ? qualifier : undefined}
                    />
                </div>
                <div className='resultWrapper'>
                    
                    <MatchResultView
                        title={t('matches.actualResultTitle')}
                        home={{
                            team: homeTeam,
                            score: fullTime[0],
                            fullScore: extraTime ? extraTime[0] : undefined,
                        }}
                        away={{
                            team: awayTeam,
                            score: fullTime[1],
                            fullScore: extraTime ? extraTime[1] : undefined,
                        }}
                        isKnockout={isKnockout}
                        qualifier={actualQualifier}
                    />
                </div>
            </div>
            <div className='totalScore'>
                {t('matches.totalPoints')}{' '}<b>{totalScore}</b>
            </div>
            <div className='explanationSection'>
                <div className='explanationTitle'>
                    {t('matches.details')}
                </div>
                <div>
                    {t('matches.ruleScore', {
                        rule: matchRuleToString[MatchRuleType.WinnerSide],
                        score: winnerSideScore,
                    })}
                </div>
                <div>
                    {t('matches.ruleScore', {
                        rule: matchRuleToString[MatchRuleType.Result],
                        score: resultScore,
                    })}
                </div>
                {hasQualifierBet && (
                    <div>
                        {t('matches.ruleScore', {
                            rule: matchRuleToString[MatchRuleType.Qualifier],
                            score: qualifierScore,
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default GameExampleView
