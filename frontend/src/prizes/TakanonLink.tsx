import React from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { HasCurrentUtl } from '../_selectors'
import useGoTo from '../hooks/useGoTo'
import './TakanonLink.scss'

function TakanonLink() {
    const { t } = useTranslation('appHeader')
    const hasCurrentUtl = useSelector(HasCurrentUtl)
    const { goToTakanon } = useGoTo()
    const { pathname } = useLocation()

    // Hide when there's no tournament context, or when already on the takanon page.
    if (!hasCurrentUtl || pathname.startsWith('/takanon')) return null

    return (
        <div className="LB-TakanonLink">
            <div className="TakanonLink-container">
                <button
                    type="button"
                    className="TakanonLink-btn"
                    onClick={goToTakanon}
                >
                    {t('routes.takanon')}
                </button>
            </div>
        </div>
    )
}

export default TakanonLink
