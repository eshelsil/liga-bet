import moment from 'moment';
import React, { useState } from 'react';
import { DEFAULT_DATETIME_FORMAT } from '../utils/time_formats';
import TeamAndSymbol from '../widgets/team_with_flag';

const WINNER_SIDE = {
    away: 'away',
    home: 'home',
}

function MatchBet ({
    match,
    sendBet,
}){
    const {id, start_time, home_team, away_team, is_knockout, bet = {}} = match;
    const [betSaved, setBetSaved] = useState(false);
    const [koWinner, setKoWinner] = useState(bet.winner_side ?? null);
    const [homeScore, setHomeScore] = useState(bet.result_home ?? '');
    const [awayScore, setAwayScore] = useState(bet.result_away ?? '');
    let winnerSide;
    const hasHomeScore = homeScore !== '';
    const hasAwayScore = awayScore !== '';
    if (hasHomeScore && hasAwayScore){
        if (homeScore > awayScore){
            winnerSide = WINNER_SIDE.home;
        } else if (homeScore < awayScore){
            winnerSide = WINNER_SIDE.away;
        } else {
            winnerSide = koWinner;
        }
    }
    const showKoWinnerInput = is_knockout && hasAwayScore && hasHomeScore && homeScore === awayScore;
    const koWinnerChange = (e) => {
        setKoWinner(e.target.value);
        setBetSaved(false);
    };
    const homeScoreChange = (e) => {
        const value = parseInt(e.target.value);
        const score = isNaN(value) ? '' : value;
        setHomeScore(score >= 0 ? score : 0);
        setBetSaved(false);
    }
    const awayScoreChange = (e) => {
        const value = parseInt(e.target.value);
        const score = isNaN(value) ? '' : value;
        setAwayScore(score >= 0 ? score : 0);
        setBetSaved(false);
    }
    const isHomeWinner = winnerSide === WINNER_SIDE.home;
    const isAwayWinner = winnerSide === WINNER_SIDE.away;

    const saveBet = () => {
        sendBet({
            matchId: id,
            is_knockout,
            homeScore,
            awayScore,
            koWinner,
        })
        .success(()=>{
            setBetSaved(true);
        });
    }

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
                    is_winner_bg={isHomeWinner}
                    is_loser_bg={isAwayWinner}
                />
                <br />
                <TeamAndSymbol
                    crest_url={away_team.crest_url}
                    name={away_team.name}
                    is_winner_bg={isAwayWinner}
                    is_loser_bg={isHomeWinner}
                />
            </td>
            <td className="open-matches-bet-cell">
                <>
                    {showKoWinnerInput && (

                        <div className="ko_switch_input">
                            <div className="tw-toggle">
                                <input type="radio" onChange={koWinnerChange} value={WINNER_SIDE.home}
                                    name={`ko_winner_of_match_${id}`}
                                    className="home-radio"
                                    checked={koWinner === WINNER_SIDE.home}
                                />
                                <label className="toggle"><i className="fa fa-star" aria-hidden="true"></i></label>
                                <label className="arrow"><i className="fa fa-arrows-v arrow-icon"></i></label>
                                <input type="radio" onChange={koWinnerChange} value={WINNER_SIDE.away}
                                    name={`ko_winner_of_match_${id}`}
                                    checked={koWinner === WINNER_SIDE.away}
                                />
                                <label className="toggle"><i className="fa fa-star"></i></label>
                                <span></span>
                            </div>
                        </div>
                    )}
                    <div className="row full-row">
                        <div className="spaced-row">
                            <input
                                onChange={homeScoreChange}
                                className={`form-control open-match-input ${isHomeWinner ? 'winner_color' : ''} ${isAwayWinner ? 'loser_color' : ''}`}
                                type="number"
                                value={homeScore}
                            />
                        </div>
                        <div className="row full-row" style={{height: 16, fontSize: 11}}>
                            <span id="ko_winner_note_{{$match->id}}" hidden>מעפילה:</span>
                        </div>
                        <div className="spaced-row">
                            <input
                                onChange={awayScoreChange}
                                className={`form-control open-match-input ${isAwayWinner ? 'winner_color' : ''} ${isHomeWinner ? 'loser_color' : ''}`}
                                type="number"
                                value={awayScore}
                            />
                        </div>
                    </div>
                </>
            </td>
            <td className="v-align-center">
                <button className={`btn btn-sm ${betSaved ? 'btn-success' : 'btn-primary'}`} onClick={saveBet}>שלח</button>
            </td>
        </tr>
    );
}

const OpenMatchesView = ({
    matches = [],
    sendBet,
}) => {
    const hasMatches = matches.length > 0;
    return (
        <div>
            <h1>רשימת משחקים</h1>
            <span className="admin">{moment().format('HH:mm  YYYY/MM/DD')}</span>
            {!hasMatches&& (
                <h3>אין משחקים פתוחים</h3>
            )}
            {hasMatches&& (
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th className="admin">מזהה</th>
                        <th className="open-matches-date-header">
                            תאריך
                        </th>
                        <th>
                            משחק
                        </th>
                        <th className="open-matches-bet-header" style={{paddingLeft: 30}}>
                            הימור
                        </th>
                        <th>

                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {matches.map(match =>(
                        <MatchBet key={match.id} match={match} sendBet={sendBet} />
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default OpenMatchesView;