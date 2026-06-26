import React from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { CurrentTournament, CurrentTournamentOwner } from '../_selectors'

function TournamentNotOpenedForBets() {
    const { t } = useTranslation('controllers')
    const tournament = useSelector(CurrentTournament)
    const owner = useSelector(CurrentTournamentOwner)
    return (
        <div>
            <h2>{tournament?.name}</h2>
            <h4 style={{ marginTop: 24 }}>{t('notOpenedForBets.waitingForOwner', { owner: owner?.name })}</h4>
        </div>
    )
}

export default TournamentNotOpenedForBets
