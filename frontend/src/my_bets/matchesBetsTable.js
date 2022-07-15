import React from 'react';
import TeamAndSymbol from "../widgets/team_with_flag";
import MatchResult from "../widgets/match_result";

const DUMMY_DATA = {

    matches: [
        {
            id: 1,
            homeTeam: {
                name: "Turkey",
                flag: "https://crests.football-data.org/803.svg"
            },
            awayTeam: {
                name: "Italy",
                flag: "https://crests.football-data.org/784.svg"
            },
            userBet: {
                homeTeamScore: 0,
                awayTeamScore: 1
            },
            actualResults: {
                homeTeamScore: 0,
                awayTeamScore: 3
            },
        },
        {
            id: 2,
            homeTeam: {
                name: "Wales",
                flag: "https://crests.football-data.org/833.svg"
            },
            awayTeam: {
                name: "Switzerland",
                flag: "https://crests.football-data.org/788.svg"
            },
            userBet: {
                homeTeamScore: 1,
                awayTeamScore: 2
            },
            actualResults: {
                homeTeamScore: 1,
                awayTeamScore: 1
            },
        },
        {
            id: 3,
            homeTeam: {
                name: "Denmark",
                flag: "https://crests.football-data.org/782.svg"
            },
            awayTeam: {
                name: "Finland",
                flag: "https://crests.football-data.org/1976.svg"
            },
            userBet: {
                homeTeamScore: 2,
                awayTeamScore: 0
            },
            actualResults: {
                homeTeamScore: 0,
                awayTeamScore: 1
            },
        },
        {
            id: 4,
            homeTeam: {
                name: "Belgium",
                flag: "https://crests.football-data.org/805.svg"
            },
            awayTeam: {
                name: "Russia",
                flag: "https://crests.football-data.org/808.svg"
            },
            userBet: {
                homeTeamScore: 4,
                awayTeamScore: 0
            },
            actualResults: {
                homeTeamScore: 3,
                awayTeamScore: 0
            },
        },
        {
            id: 5,
            homeTeam: {
                name: "England",
                flag: "https://crests.football-data.org/770.svg"
            },
            awayTeam: {
                name: "Croatia",
                flag: "https://crests.football-data.org/799.svg"
            },
            userBet: {
                homeTeamScore: 2,
                awayTeamScore: 1
            },
            actualResults: {
                homeTeamScore: 1,
                awayTeamScore: 0
            },
        },
    ]

}

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
                    <tr>
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