import React from 'react'
import { useTranslation } from 'react-i18next'
import { GameSubType } from '../../types'
import { getStageName } from '../../strings'
import { subTypeToKnockoutStage } from '../../utils'
import { useBracketScores } from '../../bracket/useBracket'

// Canonical round order for display (enum declaration order: R32 → … → 3rd place).
const ROUND_ORDER = Object.values(GameSubType) as GameSubType[]

function BracketScoresRules() {
    const { t } = useTranslation('takanon')
    const scores = useBracketScores()

    // Config-driven: only rounds the tournament actually scores (admin overrides
    // flow straight through). 3rd place has a qualifier score but no advance score.
    const rounds = ROUND_ORDER.filter((round) => (scores.qualifier[round] ?? 0) > 0)

    return (
        <div className="takanonTextSection">
            <h4>{t('bracket.scoresHeading')}</h4>
            <table className="scoresConfigTable">
                <thead>
                    <tr>
                        <th>{t('bracket.roundCol')}</th>
                        <th>{t('bracket.qualifierCol')}</th>
                        <th>{t('bracket.advanceCol')}</th>
                    </tr>
                </thead>
                <tbody>
                    {rounds.map((round) => {
                        const advance = scores.specialAdvance[round]
                        return (
                            <tr key={round} className="">
                                <td className="scoreRuleLabel">
                                    {getStageName(subTypeToKnockoutStage(round))}
                                </td>
                                <td>{scores.qualifier[round]}</td>
                                <td>{advance != null ? advance : '—'}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <ul className="mt-2">
                <li>{t('bracket.noteBoth')}</li>
                <li>{t('bracket.noteNotInGame')}</li>
                {rounds.includes(GameSubType.ThirdPlace) && (
                    <li>{t('bracket.noteThirdPlace')}</li>
                )}
            </ul>
        </div>
    )
}

export default BracketScoresRules
