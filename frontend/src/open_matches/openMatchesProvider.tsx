import React from 'react'
import {connect, useSelector} from 'react-redux'
import { MyOpenMatchBetsSelector } from '../_selectors/openMatches'
import {
    sendBetAndStore,
    SendMatchBetParams,
} from '../_actions/bets'
import OpenMatchesView from './openMatchesView'
import { BetType, MatchWithABet, WinnerSide } from '../types'
import { MatchBetUpdatePayload } from '../api/bets'
import { useAllGameBets, useGames } from '../hooks/useFetcher'
import {IsQualifierBetOn} from "../_selectors";

interface Props {
    matches: MatchWithABet[]
    sendBetAndStore: (params: SendMatchBetParams) => Promise<void>
}

const OpenMatchesProvider = ({
    matches,
    sendBetAndStore,
}: Props) => {

    const hasQualifierBet = useSelector(IsQualifierBetOn)

    useGames(true);
    useAllGameBets();

    async function sendMatchBet({
        matchId,
        is_knockout,
        homeScore,
        awayScore,
        koWinner,
        forAllTournaments,
    }: {
        matchId: number
        is_knockout: boolean
        homeScore: string
        awayScore: string
        koWinner: WinnerSide
        forAllTournaments?: boolean
    }) {
        const valid_input_vals = [...Array(21).keys()]
        if (
            homeScore === '' ||
            valid_input_vals.indexOf(Number(homeScore)) === -1
        ) {
            window['toastr']['error'](
                `כמות שערים לקבוצה חייבת להיות מספר שלם בין 0 ל-20. הערך שהתקבל לקבוצת הבית: ${homeScore}`
            )
            throw new Error('INVALINVALID_SCORE_INPUTID_SCORE_INPUT')
        }
        if (
            awayScore === '' ||
            valid_input_vals.indexOf(Number(awayScore)) === -1
        ) {
            window['toastr']['error'](
                `כמות שערים לקבוצה חייבת להיות מספר שלם בין 0 ל-20. הערך שהתקבל לקבוצת החוץ: ${awayScore}`
            )
            throw new Error('INVALINVALID_SCORE_INPUTID_SCORE_INPUT')
        }
        const payload: MatchBetUpdatePayload = {
            'result-home': Number(homeScore),
            'result-away': Number(awayScore),
        }
        if (is_knockout && homeScore == awayScore && hasQualifierBet) {
            payload.winner_side = koWinner
            if (!koWinner) {
                window['toastr']['error'](
                    `עלייך לבחור מעפילה (מכיוון שסימנת משחק נוקאאוט שייגמר בתיקו)`
                )
                throw new Error('NO_QUALIFIER')
            }
        }
        return await sendBetAndStore({
            betType: BetType.Match,
            type_id: matchId,
            payload,
            forAllTournaments,
        })
    }
    return <OpenMatchesView matches={matches} sendBet={sendMatchBet} />
}

const mapDispatchToProps = {
    sendBetAndStore,
}

export default connect(
    MyOpenMatchBetsSelector,
    mapDispatchToProps
)(OpenMatchesProvider)
