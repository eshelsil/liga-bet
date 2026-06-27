import { IsCurrentTournamentIncludesBetOnResult } from '@/_selectors/base/singleModel'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux/es/hooks/useSelector'

// Bracket-specific rules (KNOCKOUT_BRACKET_PLAN §Frontend spec): what users bet
// on, Winner/Runner-Up mechanics, auto-lock, lazy removal, auto-fill, start.
function BracketBettingRules() {
    const { t } = useTranslation('takanon')
    const isResultBetOn = useSelector(IsCurrentTournamentIncludesBetOnResult)
    const rules: string[] = [
        isResultBetOn ? t('bracket.ruleQualifierAndScore') : t('bracket.ruleQualifiersOnly'),
        t('bracket.ruleWinnerRunnerUp'),
        t('bracket.ruleAutoLock'),
        t('bracket.ruleStart'),
    ]
    return (
        <div className="takanonTextSection">
            <h4>{t('bracket.rulesHeading')}</h4>
            <ul>
                {rules.map((rule, i) => (
                    <li key={i}>{rule}</li>
                ))}
            </ul>
        </div>
    )
}

export default BracketBettingRules
