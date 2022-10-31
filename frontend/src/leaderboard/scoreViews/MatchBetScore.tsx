import React from 'react'
import TeamWithFlag from '../../widgets/TeamWithFlag'
import MatchResult from '../../widgets/MatchResult'
import { MatchBetWithRelations } from '../../types'

interface Props {
    bet: MatchBetWithRelations
}

function MatchBetScore({ bet }: Props) {
    const { id, score, result_home, result_away, winner_side, relatedMatch } =
        bet
    if (!relatedMatch) {
        return null
    }
    const { home_team, away_team } = relatedMatch
    return (
        <li
            key={id}
            className="list-group-item row flex-row center-items col-no-padding"
            style={{ paddingLeft: '0px', paddingRight: '10px' }}
        >
            <div className="col-xs-1 pull-right col-no-padding">{score}</div>
            <div className="col-xs-9 pull-right col-no-padding">
                <table>
                    <tbody>
                        <tr
                            className="flex-row"
                            style={{ alignItems: 'center' }}
                        >
                            <td className="flex-row dir-ltr">
                                <TeamWithFlag
                                    name={home_team.name}
                                    crest_url={home_team.crest_url}
                                    // is_underlined={winner_side === 'home'}
                                    // is_bold={
                                    //     relatedMatch.winner_side === 'home'
                                    // }
                                ></TeamWithFlag>
                                <span>({result_home})</span>
                            </td>
                            <td style={{ padding: '5px' }}>-</td>
                            <td className="flex-row dir-ltr">
                                <TeamWithFlag
                                    name={away_team.name}
                                    crest_url={away_team.crest_url}
                                    // is_underlined={winner_side === 'away'}
                                    // is_bold={
                                    //     relatedMatch.winner_side === 'away'
                                    // }
                                ></TeamWithFlag>
                                <span>({result_away})</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="col-xs-2 pull-right col-no-padding">
                <MatchResult winner_class="bolded" matchData={relatedMatch} />
            </div>
        </li>
    )
}

export default MatchBetScore
