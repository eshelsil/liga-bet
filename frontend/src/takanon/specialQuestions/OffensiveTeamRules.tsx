import React from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
    score: number
}

function OffensiveTeamRules({ score }: Props) {
    const { t } = useTranslation('takanon')
    return (
        <>
            <h5 className="underlined">{t('offensiveTeam.heading')}</h5>
            <h5>{t('offensiveTeam.description')}</h5>
            <h5>{t('offensiveTeam.points', { score })}</h5>
            <ul style={{ marginTop: 4 }}>
                <li>
                    {t('offensiveTeam.tie')}
                </li>
            </ul>
        </>
    )
}

export default OffensiveTeamRules
