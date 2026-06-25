import React, { useEffect } from 'react'
import { Button } from '@mui/material'
import useGoTo from '../../../hooks/useGoTo'
import { GamesWithGoalsDataSelector, LiveGamesWithGoalsDataSelector, TournamentIdSelector } from '../../../_selectors'
import { useSelector } from 'react-redux'
import { valuesOf } from '../../../utils'
import GameScorersList from './GameScorersList'
import { useDispatch } from 'react-redux'
import { fetchAndStoreAllPlayers } from '../../../_actions/players'
import { AppDispatch } from '../../../_helpers/store'
import { orderBy } from 'lodash'
import { useTranslation } from 'react-i18next'




function AdminSeeGameGoalsData() {
    const { t } = useTranslation('admin')
    const dispatch = useDispatch<AppDispatch>()
    const gamesWithGoalsData = useSelector(GamesWithGoalsDataSelector)
    const liveGamesWithGoalsData = useSelector(LiveGamesWithGoalsDataSelector)
    const hasLiveGames = Object.keys(liveGamesWithGoalsData).length > 0
    const tournamentId = useSelector(TournamentIdSelector)
    const { goToAdminIndex } = useGoTo()

    useEffect(() => {
        if (tournamentId) {
            dispatch(fetchAndStoreAllPlayers())
        }
    }, [tournamentId])

    return (
        <div className='LB-AdminSeeTournaments'>
            <h2>{t('scorers.title')}</h2>
            {hasLiveGames && (<>
                <h3>{t('scorers.liveGames')}</h3>
                {orderBy(valuesOf(liveGamesWithGoalsData), ['start_time', 'id'], ['desc', 'desc']).map(game => (
                    <GameScorersList key={game.id} match={game} />
                ))}
            </>)}
            <h3>{t('scorers.finishedGames')}</h3>
            {orderBy(valuesOf(gamesWithGoalsData), ['start_time', 'id'], ['desc', 'desc']).map(game => (
                <GameScorersList key={game.id} match={game} />
            ))}
            <div className='goBackButton'>
                <Button
                    variant='outlined'
                    color='primary'
                    onClick={goToAdminIndex}
                >
                    {t('buttons.back')}
                </Button>
            </div>
        </div>
    )
}

export default AdminSeeGameGoalsData 
