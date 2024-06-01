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
import {IsQualifierBetOn, IsWhatifOn} from "../_selectors";
import WhatifInputs from '@/whatifs/WhatifInputsView'

interface Props {
    matches: MatchWithABet[]
    notifications: number[]
    sendBetAndStore: (params: SendMatchBetParams) => Promise<void>
}

const OpenMatchesProvider = ({
    matches,
    notifications,
    sendBetAndStore,
}: Props) => {

    const hasQualifierBet = useSelector(IsQualifierBetOn)
    const isWhatifOn = useSelector(IsWhatifOn)

    useGames(true);
    useAllGameBets();

    async function sendMatchBet({
        matchId,
        is_knockout,
        isTwoLeggedTie,
        isFirstLeg,
        homeScore,
        awayScore,
        koWinner,
        forAllTournaments,
    }: {
        matchId: number
        is_knockout: boolean
        isTwoLeggedTie: boolean
        isFirstLeg: boolean
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
        if (hasQualifierBet && (isTwoLeggedTie ? isFirstLeg : (is_knockout && homeScore == awayScore))) {
            payload.winner_side = koWinner
            if (!koWinner) {
                window['toastr']['error'](
                    isTwoLeggedTie ? `עלייך לבחור מעפילה` : `עלייך לבחור מעפילה (מכיוון שסימנת משחק נוקאאוט שייגמר בתיקו)`
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
    return (<>
        {isWhatifOn && (
            <WhatifInputs matches={matches}/>
        )}
        {!isWhatifOn && (
            <OpenMatchesView matches={matches} notifications={notifications} sendBet={sendMatchBet} />
        )}
    </>)

}

const mapDispatchToProps = {
    sendBetAndStore,
}

export default connect(
    MyOpenMatchBetsSelector,
    mapDispatchToProps
)(OpenMatchesProvider)
