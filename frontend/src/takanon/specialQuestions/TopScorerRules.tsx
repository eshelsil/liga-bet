import React from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
    scoreConfig: {
        correct: number
        eachGoal: number
    }
}

function TopScorerRules({ scoreConfig }: Props) {
    const { t } = useTranslation('takanon')
    const { correct, eachGoal } = scoreConfig
    const hasEachGoalBet = eachGoal > 0
    return (
        <>
            <h5 className="underlined">{t('topScorer.heading')}</h5>
            <h5>{t('topScorer.description')}</h5>
            {hasEachGoalBet && (
                <table className='scoresConfigTable'>
                    <thead>
                        <tr>
                            <th></th>
                            <th>{t('topScorer.scoreHeader')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className='scoreRuleLabel'>{t('topScorer.eachGoalLabel')}</td>
                            <td>{scoreConfig.eachGoal}</td>
                        </tr>
                        <tr>
                            <td className='scoreRuleLabel'>{t('topScorer.titleWinLabel')}</td>
                            <td>{scoreConfig.correct}</td>
                        </tr>
                    </tbody>
                </table>
            )}
            {!hasEachGoalBet && (
                <h5>{t('topScorer.points', { score: correct })}</h5>
            )}
            <ul style={{ marginTop: 4 }}>
                <li>
                    {t('topScorer.noSwap')}
                </li>
                <li>
                    {t('topScorer.tie', { score: scoreConfig.correct })}
                </li>
            </ul>
        </>
    )
}

export default TopScorerRules
