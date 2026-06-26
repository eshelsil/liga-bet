import React from 'react'
import { useTranslation } from 'react-i18next'

function GeneralRules() {
    const { t } = useTranslation('takanon')
    return (
        <>
            <h3 style={{ marginBottom: 20, marginTop: 8}}>{t('generalRules.heading')}</h3>
            <ul style={{ marginTop: 8 }}>
                <li>{t('generalRules.questions')}</li>
                <li>
                    {t('generalRules.exceptional')}
                </li>
            </ul>
        </>
    )
}

export default GeneralRules
