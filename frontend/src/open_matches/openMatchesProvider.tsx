import React from 'react'
import { connect } from 'react-redux'
import { MyOpenMatchBetsSelector } from '../_selectors/openMatches'
import {
    sendBetAndStore,
    fetchAndStoreBets,
    SendMatchBetParams,
} from '../_actions/bets'
import OpenMatchesView from './openMatchesView'
import { BetType, MatchWithABet, WinnerSide } from '../types'
import { MatchBetUpdatePayload } from '../api/bets'

interface Props {
    matches: MatchWithABet[]
    sendBetAndStore: (params: SendMatchBetParams) => Promise<void>
    fetchAndStoreBets: any
}

const OpenMatchesProvider = ({
    matches,
    sendBetAndStore,
    fetchAndStoreBets,
}: Props) => {
    async function sendMatchBet({
        matchId,
        is_knockout,
        homeScore,
        awayScore,
        koWinner,
    }: {
        matchId: number
        is_knockout: boolean
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
                `כמות שערים לקבוצה חייבת להיות מספר שלם בין 0 ל-20. הערך שהתקבל לקבוצת הבית: ${homeScore}`
            )
            return
        }
        if (
            awayScore === '' ||
            valid_input_vals.indexOf(Number(awayScore)) === -1
        ) {
            window['toastr']['error'](
                `כמות שערים לקבוצה חייבת להיות מספר שלם בין 0 ל-20. הערך שהתקבל לקבוצת החוץ: ${awayScore}`
            )
            return
        }
        const payload: MatchBetUpdatePayload = {
            'result-home': Number(homeScore),
            'result-away': Number(awayScore),
        }
        if (is_knockout && homeScore == awayScore) {
            payload.winner_side = koWinner
            if (!koWinner) {
                window['toastr']['error'](
                    `עלייך לבחור מעפילה (מכיוון שסימנת משחק נוקאאוט שייגמר בתיקו)`
                )
                return
            }
        }
        await sendBetAndStore({
            betType: BetType.Match,
            type_id: matchId,
            payload,
        })
            .then(function (data) {
                window['toastr']['success']('ההימור נשלח')
            })
            .catch(function (error) {
                console.log('FAILED updating bet', error)
            })
    }
    return <OpenMatchesView matches={matches} sendBet={sendMatchBet} />
}

const mapDispatchToProps = {
    sendBetAndStore,
    fetchAndStoreBets,
}

export default connect(
    MyOpenMatchBetsSelector,
    mapDispatchToProps
)(OpenMatchesProvider)
