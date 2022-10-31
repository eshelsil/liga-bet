import React from 'react'
import TeamWithFlag from '../widgets/TeamWithFlag'
import MatchResult from '../widgets/MatchResult'
import { MatchBetWithRelations, WinnerSide } from '../types'

const MatchesBetsTable = ({ bets }: { bets: MatchBetWithRelations[] }) => {
    return (
        <table className="table table-striped">
            <thead>
                <tr>
                    <th className="admin">מזהה</th>
                    <th>משחק</th>
                    <th>הימור</th>
                    <th>תוצאה</th>
                </tr>
            </thead>
            <tbody>
                {bets.map((bet) => (
                    <tr key={bet.id}>
                        <td className="admin">{bet.relatedMatch.id}</td>

                        <td className="flex-row v-align-center">
                            <TeamWithFlag
                                name={bet.relatedMatch.home_team.name}
                                crest_url={bet.relatedMatch.home_team.crest_url}
                                // is_underlined={
                                //     bet.result_home > bet.result_away
                                // }
                                // is_bold={
                                //     bet.relatedMatch.result_home >
                                //     bet.relatedMatch.result_away
                                // }
                            />
                            <span className="dash-space"> - </span>
                            <TeamWithFlag
                                name={bet.relatedMatch.away_team.name}
                                crest_url={bet.relatedMatch.away_team.crest_url}
                                // is_underlined={
                                //     bet.result_home < bet.result_away
                                // }
                                // is_bold={
                                //     bet.relatedMatch.result_home <
                                //     bet.relatedMatch.result_away
                                // }
                            />
                        </td>
                        <td className="v-align-center">
                            <MatchResult
                                winner_class="underlined"
                                matchData={{
                                    winner_side: bet.winner_side,
                                    result_home: bet.result_home,
                                    result_away: bet.result_away,
                                }}
                            />
                        </td>
                        <td className="v-align-center">
                            <MatchResult
                                winner_class="bolded"
                                matchData={{
                                    winner_side: bet.winner_side,
                                    result_home: bet.relatedMatch.result_home,
                                    result_away: bet.relatedMatch.result_away,
                                }}
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default MatchesBetsTable
