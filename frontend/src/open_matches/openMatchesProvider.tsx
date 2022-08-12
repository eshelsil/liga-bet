import React from 'react';
import { connect } from 'react-redux';
import { MyOpenMatchBetsSelector } from '../_selectors/openMatches';
import { sendBetAndStore } from '../_actions/bets';
import OpenMatchesView from './openMatchesView';
import { BetTypes } from '../_enums/betTypes';
import { MatchWithABet } from '../types';




const OpenMatchesProvider = ({
    matches,
    sendBetAndStore,
}: {
    matches: MatchWithABet[],
    sendBetAndStore: any,
}) => {
    async function sendMatchBet({
        matchId,
        is_knockout,
        homeScore,
        awayScore,
        koWinner,
    }) {
        const valid_input_vals = [...Array(21).keys()];
        if (homeScore === "" || valid_input_vals.indexOf(Number(homeScore)) === -1){
            window['toastr']["error"](`כמות שערים לקבוצה חייבת להיות מספר שלם בין 0 ל-20. הערך שהתקבל לקבוצת הבית: ${homeScore}`)
            return
        }
        if (awayScore === "" || valid_input_vals.indexOf(Number(awayScore)) === -1){
            window['toastr']["error"](`כמות שערים לקבוצה חייבת להיות מספר שלם בין 0 ל-20. הערך שהתקבל לקבוצת החוץ: ${awayScore}`)
            return
        }
        let params = {
            type_id: matchId,
            "result-home": homeScore,
            "result-away": awayScore
        }
        if (is_knockout && homeScore == awayScore){
            params['winner_side'] = koWinner;
            if (!koWinner){
                window['toastr']["error"](`עלייך לבחור מעפילה (מכיוון שסימנת משחק נוקאאוט שייגמר בתיקו)`)
                return
            }
        }
        await sendBetAndStore({
            ...params,
            betType: BetTypes.Match,
        })
            .then(function (data) {
                window['toastr']["success"]("ההימור נשלח");
            })
            .catch(function(error) {
                console.log('FAILED updating bet', error)
            });
    }
    return <OpenMatchesView
        matches={matches}
        sendBet={sendMatchBet}
    />
};

const mapDispatchToProps = {
    sendBetAndStore,
}

export default connect(MyOpenMatchBetsSelector, mapDispatchToProps)(OpenMatchesProvider);