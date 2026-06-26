import React from 'react'
import { useTranslation } from 'react-i18next'
import { sortBy, sum } from 'lodash'
import { getHebCompetitionStageName } from '../../strings'
import { CompetitionStageName, EnumRecord } from '../../types'


function sortAchivementStage ([name, score]: [name: CompetitionStageName, score: number]) {
    const stagesOrder = [
        CompetitionStageName.Last16,
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
    const { t } = useTranslation('takanon')
    const maxScore = sum(Object.values(scoreConfig).map(val => Number(val)))
    return (
        <>
            <h5 className="underlined">{label}</h5>
            <p>{t('teamAchievement.intro')}</p>
            <table className='scoresConfigTable'>
                <thead>
                    <tr>
                        <th>{t('teamAchievement.achievementHeader')}</th>
                        <th>{t('teamAchievement.pointsHeader')}</th>
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
            <h5>{t('teamAchievement.maxScore', { score: maxScore })}</h5>
            {isRunnerUp && (
                <ul style={{ marginTop: 4 }}>
                    <li>
                        {t('teamAchievement.runnerUpNote')}
                    </li>
                </ul>
            )}
        </>
    )
}

export default TeamAchivementRules
