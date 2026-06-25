import React from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
    score: number
}

function MvpRules({ score }: Props) {
    const { t } = useTranslation('takanon')
    return (
        <>
            <h5 className="underlined">{t('mvp.heading')}</h5>
            <h5>{t('mvp.description')}</h5>
            <h5>{t('mvp.points', { score })}</h5>
        </>
    )
}

export default MvpRules
