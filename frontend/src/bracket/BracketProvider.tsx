import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { CircularProgress } from '@mui/material'
import { CurrentTournamentId, IsCurrentTournamentKnockoutBracket } from '../_selectors'
import { useAppDispatch } from '../_helpers/store'
import { fetchAndStoreBracket } from '../_actions/bracket'
import RedirectToDefaultPage from '../appContent/RedirectToDefaultPage'
import BracketWinnerFlow from './BracketWinnerFlow'

function BracketProvider() {
    const isKnockoutBracket = useSelector(IsCurrentTournamentKnockoutBracket)
    const tournamentId = useSelector(CurrentTournamentId)
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!isKnockoutBracket) {
            setLoading(false)
            return
        }
        setLoading(true)
        dispatch(fetchAndStoreBracket())
            .catch((e) => console.log('FAILED to fetch bracket', e))
            .finally(() => setLoading(false))
    }, [dispatch, isKnockoutBracket, tournamentId])

    if (!isKnockoutBracket) {
        return <RedirectToDefaultPage />
    }
    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
                <CircularProgress />
            </div>
        )
    }
    return <BracketWinnerFlow />
}

export default BracketProvider
