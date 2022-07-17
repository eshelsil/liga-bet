import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { MyOpenMatchBetsSelector } from '../_selectors/openMatches';
import { fetch_users } from '../_actions/users';
import { fetch_matches } from '../_actions/matches';
import { fetch_bets } from '../_actions/bets';
import OpenMatchesView from './openMatchesView';
import { BetTypes } from '../_enums/betTypes';



function sendMatchBet({
    matchId,
    is_knockout,
    homeScore,
    awayScore,
    koWinner,
}) {
    const valid_input_vals = [...Array(21).keys()];
    if (homeScore === "" || valid_input_vals.indexOf(Number(homeScore)) === -1){
        toastr["error"](`כמות שערים לקבוצה חייבת להיות מספר שלם בין 0 ל-20. הערך שהתקבל לקבוצת הבית: ${home_val}`)
        return
    }
    if (awayScore === "" || valid_input_vals.indexOf(Number(awayScore)) === -1){
        toastr["error"](`כמות שערים לקבוצה חייבת להיות מספר שלם בין 0 ל-20. הערך שהתקבל לקבוצת החוץ: ${away_val}`)
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
            toastr["error"](`עלייך לבחור מעפילה (מכיוון שסימנת משחק נוקאאוט שייגמר בתיקו)`)
            return
        }
    }
    return $.ajax({
        type: 'POST',
        url: '/user/update',
        contentType: 'application/json',
        data: JSON.stringify({
            bets: [{
                type: BetTypes.Match,
                data: params
            }]
        }),
        dataType: 'json',
        success: function (data) {
            toastr["success"]("ההימור נשלח");
        },
        error: function(data) {
            toastr["error"](data.responseJSON.message);
        }
    });

}

const OpenMatchesProvider = ({
    matches,
    fetch_users,
    fetch_bets,
    fetch_matches,
}) => {
    useEffect(()=>{
		fetch_users();
        fetch_bets();
        fetch_matches();
	}, []);
    console.log({matches})
    return <OpenMatchesView
        matches={matches}
        sendBet={sendMatchBet}
    />
};

const mapDispatchToProps = {
    fetch_users,
    fetch_bets,
    fetch_matches,
}

export default connect(MyOpenMatchBetsSelector, mapDispatchToProps)(OpenMatchesProvider);