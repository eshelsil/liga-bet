import React from 'react';
import TeamAndSymbol from "../widgets/team_with_flag";
import MatchResult from "../widgets/match_result";


const MatchesBetsTable = ({bets}) => {
    return (
        <table className="table table-striped">
            <thead>
            <tr>
                <th className="admin">מזהה</th>
                <th>
                    משחק
                </th>
                <th>
                    הימור
                </th>
                <th>
                    תוצאה
                </th>
            </tr>
            </thead>
            <tbody>
            {
                bets.map(bet =>
                    <tr key={bet.id}>
                        <td className="admin">
                            {bet.relatedMatch.id}
                        </td>

                        <td className="flex-row v-align-center">
                            <TeamAndSymbol
                                name={bet.relatedMatch.home_team.name}
                                crest_url={bet.relatedMatch.home_team.crest_url}
                                // is_loser_bg={match.actualResults.homeTeamScore < match.actualResults.awayTeamScore}
                                // is_winner_bg={match.actualResults.homeTeamScore > match.actualResults.awayTeamScore}
                                is_underlined={bet.result_home > bet.result_away}
                                is_bold={bet.relatedMatch.result_home > bet.relatedMatch.result_away}
                            />
                            <span className="dash-space"> - </span>
                            <TeamAndSymbol
                                name={bet.relatedMatch.away_team.name}
                                crest_url={bet.relatedMatch.away_team.crest_url}
                                // is_loser_bg={match.actualResults.homeTeamScore > match.actualResults.awayTeamScore}
                                // is_winner_bg={match.actualResults.homeTeamScore < match.actualResults.awayTeamScore}
                                is_underlined={bet.result_home < bet.result_away}
                                is_bold={bet.relatedMatch.result_home < bet.relatedMatch.result_away}
                            />
                        </td>
                        <td className="v-align-center">
                            <MatchResult
                                winner_class="underlined"
                                matchData={{
                                    winner_side: bet.result_home > bet.result_away ? "home" : bet.result_home < bet.result_away ? "away" : "",
                                    result_home: bet.result_home,
                                    result_away: bet.result_away,
                                }}
                            />
                        </td>
                        <td className="v-align-center">
                            <MatchResult
                                winner_class="bolded"
                                matchData={{
                                    winner_side: bet.relatedMatch.result_home > bet.relatedMatch.result_away ? "home" : bet.relatedMatch.result_home < bet.relatedMatch.result_away ? "away" : "",
                                    result_home: bet.relatedMatch.result_home,
                                    result_away: bet.relatedMatch.result_away,
                                }}
                            />
                        </td>
                    </tr>
                )
            }
            </tbody>
        </table>
    );
};

export default MatchesBetsTable;