import moment from 'moment';
import React from 'react';
import { DEFAULT_DATETIME_FORMAT } from '../utils/timeFormats';
import TeamAndSymbol from '../widgets/TeamWithFlag';
import { WINNER_SIDE } from '../_enums/winnerSide';

function MatchWithBetView ({
    match,
    onEdit,
}){
    const {id, start_time, home_team, away_team, is_knockout, bet = {}} = match;


    const hasBet = bet.id !== undefined;
    let winnerSide;
    if (bet.id !== undefined && is_knockout){
        if (bet.result_home > bet.result_away){
            winnerSide = WINNER_SIDE.home;
        } else if (bet.result_home < bet.result_away){
            winnerSide = WINNER_SIDE.away;
        } else {
            winnerSide = bet.winner_side;
        }
    }

    const isHomeKoWinner = winnerSide === WINNER_SIDE.home;
    const isAwayKoWinner = winnerSide === WINNER_SIDE.away;

    
    return (
        <tr id={`row_match_${id}`}>
            <td className="admin">{id}</td>
            <td className="v-align-center">
                {moment(start_time).format(DEFAULT_DATETIME_FORMAT)}
            </td>
            <td className="open-match-teams-cell v-align-center">
                <TeamAndSymbol
                    crest_url={home_team.crest_url}
                    name={home_team.name}
                    is_ko_winner={isHomeKoWinner}
                    />
                <br />
                <TeamAndSymbol
                    crest_url={away_team.crest_url}
                    name={away_team.name}
                    is_ko_winner={isAwayKoWinner}
                />
            </td>
            <td className="open-matches-bet-cell">
                <>
                    {hasBet && (
                    <div className="spaced-row" style={{flexDirection: 'column', justifyContent: 'space-between'}}>
                        <p>
                            {bet.result_home}
                        </p>
                        <p></p>
                        <p>
                            {bet.result_away}
                        </p>
                    </div>
                    )}
                    {!hasBet && (
                        <button className={`btn btn-sm btn-primary`} onClick={onEdit}>הוסף</button>
                    )}
                </>
            </td>
            <td className="v-align-center">
                {hasBet && (
                    <button className={`btn btn-sm btn-primary`} onClick={onEdit}>ערוך</button>
                )}
            </td>
        </tr>
    );
}


export default MatchWithBetView;