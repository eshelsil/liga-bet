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

const MatchesBetsTable = (props) => {

    // const {matches} = props
    const {matches} = DUMMY_DATA;

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
                matches && matches.map(match =>
                    <tr>
                        <td className="admin">
                            {match.id}
                        </td>

                        <td className="flex-row v-align-center">
                            <TeamAndSymbol
                                name={match.homeTeam.name}
                                crest_url={match.homeTeam.flag}
                                // is_loser_bg={match.actualResults.homeTeamScore < match.actualResults.awayTeamScore}
                                // is_winner_bg={match.actualResults.homeTeamScore > match.actualResults.awayTeamScore}
                                is_underlined={match.userBet.homeTeamScore > match.userBet.awayTeamScore}
                                is_bold={match.actualResults.homeTeamScore > match.actualResults.awayTeamScore}
                            />
                            <span className="dash-space"> - </span>
                            <TeamAndSymbol
                                name={match.awayTeam.name}
                                crest_url={match.awayTeam.flag}
                                // is_loser_bg={match.actualResults.homeTeamScore > match.actualResults.awayTeamScore}
                                // is_winner_bg={match.actualResults.homeTeamScore < match.actualResults.awayTeamScore}
                                is_underlined={match.userBet.homeTeamScore < match.userBet.awayTeamScore}
                                is_bold={match.actualResults.homeTeamScore < match.actualResults.awayTeamScore}
                            />
                        </td>
                        <td className="v-align-center">
                            <MatchResult
                                winner_class="underlined"
                                matchData={{
                                    winner_side: match.userBet.homeTeamScore > match.userBet.awayTeamScore ? "home" : match.userBet.homeTeamScore < match.userBet.awayTeamScore ? "away" : "",
                                    result_home: match.userBet.homeTeamScore,
                                    result_away: match.userBet.awayTeamScore,
                                }}
                            />
                        </td>
                        <td className="v-align-center">
                            <MatchResult
                                winner_class="bolded"
                                matchData={{
                                    winner_side: match.actualResults.homeTeamScore > match.actualResults.awayTeamScore ? "home" : match.actualResults.homeTeamScore < match.actualResults.awayTeamScore ? "away" : "",
                                    result_home: match.actualResults.homeTeamScore,
                                    result_away: match.actualResults.awayTeamScore,
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