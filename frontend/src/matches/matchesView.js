import moment from 'moment';
import React from 'react';
import { updateScoresFromApi } from '../api/matches';
import MatchResult from '../widgets/match_result';
import TeamWithFlag from '../widgets/team_with_flag';


function MatchGumblesList({
    match,
}){
    const {home_team, away_team, start_time, is_done, betsByValue} = match;
    return (
        <div>
            <h3>
                <table style={{marginBottom: 5}}>
                    <tbody>
                        <tr className="flex-row center-items">
                            <td className="around-huge-flag">
                                <TeamWithFlag crest_url={home_team.crest_url} name={home_team.name} />
                            </td>
                            <td style={{padding: 5}}>
                                -
                            </td>
                            <td className="around-huge-flag">
                                <TeamWithFlag crest_url={away_team.crest_url} name={away_team.name} />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div style={{fontSize: '75%'}}>
                    <div style={{marginBottom: 5}}>
                        {moment(start_time).format('HH:mm  YYYY/MM/DD')}
                    </div>
                    {is_done && (
                        <div className="flex-row center-items" style={{marginBottom: 5}}>
                            <span className="label label-success" style={{marginLeft: 5, fontSize: 12}}>הסתיים</span>
                            <span>{match.result_home} - {match.result_away} </span>
                        </div>
                    )}
                </div>
            </h3>
            <div style={{padding: 20}}>
                <table className="table">
                    <thead>
                        <tr>
                            {is_done && (<>
                                <td className="admin">מזהה מוכר</td>
                                <th className="col-xs-3">הימור</th>
                                <th className="col-xs-6">מהמרים</th>
                                <th className="col-xs-3">ניקוד</th>
                            </>)}
                            {!is_done && (<>
                                <td className="admin">מזהה מוכר</td>
                                <th className="col-xs-6">הימור</th>
                                <th className="col-xs-6">מהמרים</th>
                            </>)}
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(betsByValue).map(([betVal, bets]) => {
                            const betSample = bets[0];
                            const gumblers = bets.map(bet => bet.user_name);
                            return (
                                <tr key={betVal}>
                                    <td className="admin">match-id: {match.id}</td>
                                    <td>
                                        <MatchResult matchData={match} winner_class={'bold'} />
                                    </td>
                                    <td>
                                    {gumblers.map(
                                        (name) => <div key={name}>
                                            {name}
                                        </div>
                                    )}
                                    </td>
                                    {is_done && (

                                        <td>{betSample.score}</td>
                                    )}
                                </tr>
                            );
                        })}
                </tbody>
            </table>
        </div>
        </div>
    );
}

const MatchesView = ({
    done_matches,
    live_matches,
}) => {
    const hasLiveMatches = live_matches.length > 0;
    return (
        <div>
            <h1>רשימת משחקים</h1>
            <div className="float-right">
                <ul className="nav nav-tabs float-right"  style={{paddingRight: 0}}>
                    <li className="float-right active">
                        <a data-toggle="tab" href="#ongoing-games">
                            משחקים נוכחיים
                        </a>
                    </li>
                    <li className="float-right">
                        <a data-toggle="tab" href="#done-games">
                            משחקים שנגמרו
                        </a>
                    </li>
                </ul>
            </div>
            <div className="tab-content" style={{marginTop: 25}}>
                <div id="ongoing-games" className="tab-pane fade active in" style={{paddingTop: 35}}>
                    {hasLiveMatches  && (
                        <button
                            className="btn btn-primary"
                            onClick={updateScoresFromApi}
                            style={{marginRight: 10, marginTop: 15}}
                        >עדכן תוצאות</button>
                    )}
                    {live_matches.map(match =>
                        <MatchGumblesList key={match.id} match={match} />
                    )}
                </div>
                <div id="done-games" className="tab-pane fade" style={{paddingTop: 35}}>
                    {done_matches.map(match =>
                        <MatchGumblesList key={match.id} match={match} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default MatchesView;