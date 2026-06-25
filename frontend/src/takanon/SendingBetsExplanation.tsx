import React from 'react'
import { useTranslation } from 'react-i18next'

function MatchBetsExplanation() {
    const { t } = useTranslation('takanon')
    return (
        <>
            <div className="takanonTextSection">
                <h4>{t('sendingBets.matchBetsTitle')}</h4>
                <p>
                    {t('sendingBets.matchBetsText1')}
                    <br />
                    {t('sendingBets.matchBetsText2')}
                </p>
            </div>
        </>
    )
}

function PrimalBetsExplanation() {
    const { t } = useTranslation('takanon')
    return (
        <>
            <div className="takanonTextSection">
                <h4>{t('sendingBets.primalBetsTitle')}</h4>
                <p>
                    {t('sendingBets.primalBetsText1')}
                    <br />
                    {t('sendingBets.primalBetsText2')}
                </p>
            </div>
        </>
    )
}

function SendingBetsExplanation() {
    const { t } = useTranslation('takanon')
    return (
        <>
            <h3 className='LB-TitleText' style={{ marginBottom: 20 }}>{t('sendingBets.heading')}</h3>
            <MatchBetsExplanation />
            <PrimalBetsExplanation />
        </>
    )
}

export default SendingBetsExplanation
