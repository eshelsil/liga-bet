import React from 'react'
import { useTranslation } from 'react-i18next'

function AutoBetExplanation() {
    const { t } = useTranslation('takanon')
    return (
        <>
            <h3 className='LB-TitleText' style={{ marginBottom: 20 }}>{t('autoBet.heading')}</h3>
            <div className="takanonTextSection">
                <p>
                    {t('autoBet.intro')}
                </p>
                <p>
                    {t('autoBet.chooseMode')}
                </p>
                <ul>
                    <li>
                        <span style={{fontWeight: 700}}>{t('autoBet.defaultModeLabel')}</span>{t('autoBet.defaultModeText')}
                    </li>
                    <li>
                        <span style={{fontWeight: 700}}>{t('autoBet.randomModeLabel')}</span>{t('autoBet.randomModeText')}
                    </li>
                </ul>
            </div>
        </>
    )
}

export default AutoBetExplanation
