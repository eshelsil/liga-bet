import React from 'react'
import { useTranslation } from 'react-i18next'
import { EachGoalBet } from '../../types'

interface Props {
    scoreConfig: EachGoalBet
}

function MostAssistsRules({ scoreConfig }: Props) {
    const { t } = useTranslation('takanon')
    const { correct, eachGoal } = scoreConfig
    const hasEachGoalBet = eachGoal > 0
    return (
        <>
            <h5 className="underlined">{t('mostAssists.heading')}</h5>
            <h5>{t('mostAssists.description')}</h5>
            {hasEachGoalBet  && (
                <table className='scoresConfigTable'>
                    <thead>
                        <tr>
                            <th></th>
                            <th>{t('mostAssists.scoreHeader')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className='scoreRuleLabel'>{t('mostAssists.eachGoalLabel')}</td>
                            <td>{scoreConfig.eachGoal}</td>
                        </tr>
                        <tr>
                            <td className='scoreRuleLabel'>{t('mostAssists.titleWinLabel')}</td>
                            <td>{scoreConfig.correct}</td>
                        </tr>
                    </tbody>
                </table>
            )}
            {!hasEachGoalBet  && (
                <h5>{t('mostAssists.points', { score: correct })}</h5>
            )}
            <ul style={{ marginTop: 4 }}>
                <li>
                    {t('mostAssists.noSwap')}
                </li>
                <li>
                    {t('mostAssists.tie', { score: scoreConfig.correct })}
                </li>
            </ul>
        </>
    )
}

export default MostAssistsRules
