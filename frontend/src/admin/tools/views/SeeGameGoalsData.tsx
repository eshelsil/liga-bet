import React, { useEffect } from 'react'
import { Button } from '@mui/material'
import useGoTo from '../../../hooks/useGoTo'
import { GamesWithGoalsDataSelector, TournamentIdSelector } from '../../../_selectors'
import { useSelector } from 'react-redux'
import { valuesOf } from '../../../utils'
import GameScorersList from './GameScorersList'
import { useDispatch } from 'react-redux'
import { fetchAndStoreAllPlayers } from '../../../_actions/players'
import { AppDispatch } from '../../../_helpers/store'
import { orderBy } from 'lodash'




function AdminSeeGameGoalsData() {
    const dispatch = useDispatch<AppDispatch>()
    const gamesWithGoalsData = useSelector(GamesWithGoalsDataSelector)
    const tournamentId = useSelector(TournamentIdSelector)
    const { goToAdminIndex } = useGoTo()

    useEffect(() => {
        if (tournamentId) {
            dispatch(fetchAndStoreAllPlayers())
        }
    }, [tournamentId])

    return (
        <div className='LB-AdminSeeTournaments'>
            <h2>מבקיעים ומבשלים</h2>
            {orderBy(valuesOf(gamesWithGoalsData), ['start_time', 'id'], ['desc', 'desc']).map(game => (
                <GameScorersList key={game.id} match={game} />
            ))}
            <div className='goBackButton'>
                <Button
                    variant='outlined'
                    color='primary'
                    onClick={goToAdminIndex}
                >
                    חזור
                </Button>
            </div>
        </div>
    )
}

export default AdminSeeGameGoalsData 
