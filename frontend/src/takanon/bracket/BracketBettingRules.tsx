import React from 'react'
import { useTranslation } from 'react-i18next'

// Bracket-specific rules (KNOCKOUT_BRACKET_PLAN §Frontend spec): what users bet
// on, Winner/Runner-Up mechanics, auto-lock, lazy removal, auto-fill, start.
function BracketBettingRules() {
    const { t } = useTranslation('takanon')
    const rules: string[] = [
        t('bracket.ruleQualifiersOnly'),
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
