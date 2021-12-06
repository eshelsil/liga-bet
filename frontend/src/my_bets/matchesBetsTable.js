import React from 'react';
import TeamAndSymbol from "../widgets/team_with_flag";
import MatchResult from "../widgets/match_result";

const DUMMY_DATA = {

    matches: [
        {
            id: 1,
            homeTeam: {
                name: "Turkey",
                flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/1920px-Flag_of_Canada_%28Pantone%29.svg.png"
            },
            awayTeam: {
                name: "Italy",
                flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/1920px-Flag_of_Canada_%28Pantone%29.svg.png"
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
                flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/1920px-Flag_of_Canada_%28Pantone%29.svg.png"
            },
            awayTeam: {
                name: "Switzerland",
                flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/1920px-Flag_of_Canada_%28Pantone%29.svg.png"
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
                flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/1920px-Flag_of_Canada_%28Pantone%29.svg.png"
            },
            awayTeam: {
                name: "Finland",
                flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/1920px-Flag_of_Canada_%28Pantone%29.svg.png"
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
                flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/1920px-Flag_of_Canada_%28Pantone%29.svg.png"
            },
            awayTeam: {
                name: "Russia",
                flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/1920px-Flag_of_Canada_%28Pantone%29.svg.png"
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
                flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/1920px-Flag_of_Canada_%28Pantone%29.svg.png"
            },
            awayTeam: {
                name: "Croatia",
                flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/1920px-Flag_of_Canada_%28Pantone%29.svg.png"
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
        {
            id: 6,
            homeTeam: {
                name: "Italy",
                flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/1920px-Flag_of_Canada_%28Pantone%29.svg.png"
            },
            awayTeam: {
                name: "Turkey",
                flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/1920px-Flag_of_Canada_%28Pantone%29.svg.png"
            },
            userBet: {
                homeTeamScore: 1,
                awayTeamScore: 0
            },
            actualResults: {
                homeTeamScore: 3,
                awayTeamScore: 0
            },
        },
        {
            id: 7,
            homeTeam: {
                name: "Italy",
                flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/1920px-Flag_of_Canada_%28Pantone%29.svg.png"
            },
            awayTeam: {
                name: "Turkey",
                flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/1920px-Flag_of_Canada_%28Pantone%29.svg.png"
            },
            userBet: {
                homeTeamScore: 1,
                awayTeamScore: 0
            },
            actualResults: {
                homeTeamScore: 3,
                awayTeamScore: 0
            },
        },
        {
            id: 8,
            homeTeam: {
                name: "Italy",
                flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/1920px-Flag_of_Canada_%28Pantone%29.svg.png"
            },
            awayTeam: {
                name: "Turkey",
                flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/1920px-Flag_of_Canada_%28Pantone%29.svg.png"
            },
            userBet: {
                homeTeamScore: 1,
                awayTeamScore: 0
            },
            actualResults: {
                homeTeamScore: 3,
                awayTeamScore: 0
            },
        },
        {
            id: 9,
            homeTeam: {
                name: "Italy",
                flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/1920px-Flag_of_Canada_%28Pantone%29.svg.png"
            },
            awayTeam: {
                name: "Turkey",
                flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/1920px-Flag_of_Canada_%28Pantone%29.svg.png"
            },
            userBet: {
                homeTeamScore: 1,
                awayTeamScore: 0
            },
            actualResults: {
                homeTeamScore: 3,
                awayTeamScore: 0
            },
        },
        {
            id: 10,
            homeTeam: {
                name: "Italy",
                flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/1920px-Flag_of_Canada_%28Pantone%29.svg.png"
            },
            awayTeam: {
                name: "Turkey",
                flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/1920px-Flag_of_Canada_%28Pantone%29.svg.png"
            },
            userBet: {
                homeTeamScore: 1,
                awayTeamScore: 0
            },
            actualResults: {
                homeTeamScore: 3,
                awayTeamScore: 0
            },
        },
        {
            id: 11,
            homeTeam: {
                name: "Italy",
                flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/1920px-Flag_of_Canada_%28Pantone%29.svg.png"
            },
            awayTeam: {
                name: "Turkey",
                flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/1920px-Flag_of_Canada_%28Pantone%29.svg.png"
            },
            userBet: {
                homeTeamScore: 1,
                awayTeamScore: 0
            },
            actualResults: {
                homeTeamScore: 3,
                awayTeamScore: 0
            },
        },
        {
            id: 12,
            homeTeam: {
                name: "Italy",
                flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/1920px-Flag_of_Canada_%28Pantone%29.svg.png"
            },
            awayTeam: {
                name: "Turkey",
                flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/1920px-Flag_of_Canada_%28Pantone%29.svg.png"
            },
            userBet: {
                homeTeamScore: 1,
                awayTeamScore: 0
            },
            actualResults: {
                homeTeamScore: 3,
                awayTeamScore: 0
            },
        },
        {
            id: 13,
            homeTeam: {
                name: "Italy",
                flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/1920px-Flag_of_Canada_%28Pantone%29.svg.png"
            },
            awayTeam: {
                name: "Turkey",
                flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/1920px-Flag_of_Canada_%28Pantone%29.svg.png"
            },
            userBet: {
                homeTeamScore: 1,
                awayTeamScore: 0
            },
            actualResults: {
                homeTeamScore: 3,
                awayTeamScore: 0
            },
        },
        {
            id: 14,
            homeTeam: {
                name: "Italy",
                flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/1920px-Flag_of_Canada_%28Pantone%29.svg.png"
            },
            awayTeam: {
                name: "Turkey",
                flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/1920px-Flag_of_Canada_%28Pantone%29.svg.png"
            },
            userBet: {
                homeTeamScore: 1,
                awayTeamScore: 0
            },
            actualResults: {
                homeTeamScore: 3,
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