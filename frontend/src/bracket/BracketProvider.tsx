import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { CircularProgress } from '@mui/material'
import {
    CurrentTournamentId,
    IsCurrentTournamentKnockoutBracket,
} from '../_selectors'
import { useAppDispatch } from '../_helpers/store'
import { fetchAndStoreBracket } from '../_actions/bracket'
import RedirectToDefaultPage from '../appContent/RedirectToDefaultPage'
import BracketWinnerFlow from './BracketWinnerFlow'
import { MatchBetUpdatePayload } from '@/api/bets'
import { WinnerSide } from '@/types/match'
import { sendBetAndStore, SendMatchBetParams } from '../_actions/bets'
import { BetType } from '@/types/bet'
import { useTranslation } from 'react-i18next'

function BracketProvider() {
    const isKnockoutBracket = useSelector(IsCurrentTournamentKnockoutBracket)
    const tournamentId = useSelector(CurrentTournamentId)
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState(true)
    const { t } = useTranslation('open_matches')

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

    async function sendMatchBet({
        matchId,
        homeScore,
        awayScore,
        koWinner,
    }: {
        matchId: number
        homeScore: string
        awayScore: string
        koWinner: WinnerSide
    }) {
        const valid_input_vals = [...Array(21).keys()]
        if (
            homeScore === '' ||
            valid_input_vals.indexOf(Number(homeScore)) === -1
        ) {
            window['toastr']['error'](
                t('errors.invalidHomeScore', { value: homeScore })
            )
            throw new Error('INVALINVALID_SCORE_INPUTID_SCORE_INPUT')
        }
        if (
            awayScore === '' ||
            valid_input_vals.indexOf(Number(awayScore)) === -1
        ) {
            window['toastr']['error'](
                t('errors.invalidAwayScore', { value: awayScore })
            )
            throw new Error('INVALINVALID_SCORE_INPUTID_SCORE_INPUT')
        }
        const payload: MatchBetUpdatePayload = {
            'result-home': Number(homeScore),
            'result-away': Number(awayScore),
        }
        if (homeScore == awayScore) {
            payload.winner_side = koWinner
            if (!koWinner) {
                window['toastr']['error'](t('errors.qualifierRequiredTie'))
                throw new Error('NO_QUALIFIER')
            }
        }
        return await dispatch(
            sendBetAndStore({
                betType: BetType.Match,
                type_id: matchId,
                payload,
            })
        )
    }

    if (!isKnockoutBracket) {
        return <RedirectToDefaultPage />
    }
    if (loading) {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    padding: 40,
                }}
            >
                <CircularProgress />
            </div>
        )
    }
    return <BracketWinnerFlow sendMatchBet={sendMatchBet} />
}

export default BracketProvider
