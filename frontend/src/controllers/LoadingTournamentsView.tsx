import React from 'react'
import { CircularProgress } from '@mui/material'
import { useTranslation } from 'react-i18next'

function LoadingTournamentsView() {
    const { t } = useTranslation('controllers')

    return (
        <>
            <h2>
                {t('loadingTournaments.title')}
            </h2>
            <CircularProgress
                size={60}
                thickness={5}
                sx={{animationDuration: '700ms'}}
            />
        </>
    )
}

export default LoadingTournamentsView
