import React from 'react'
import { GroupRankBetWithRelations } from '../types'
import TeamWithFlag from '../widgets/TeamWithFlag'

const GroupPositionBetsTable = ({
    bets,
}: {
    bets: GroupRankBetWithRelations[]
}) => {
    return (
        <table className="table table-striped">
            <thead>
                <tr>
                    <th className="admin">מזהה</th>
                    <th>בית</th>
                    <th>הימור</th>
                    <th>תוצאה</th>
                </tr>
            </thead>
            <tbody>
                {bets
                    // sort alphabetically by group name
                    .sort((bet1, bet2) =>
                        bet1.relatedGroup.name.localeCompare(
                            bet2.relatedGroup.name
                        )
                    )
                    .map((bet) => (
                        <tr key={bet.id}>
                            <td className="admin">{bet.relatedGroup.id}</td>

                            <td>{bet.relatedGroup.name}</td>
                            <td>
                                <div className="col pull-right">
                                    {bet.standings.map((team, index) => (
                                        <div key={index} className="flex-row">
                                            <span>({index + 1})</span>
                                            {
                                                <TeamWithFlag
                                                    name={team.name}
                                                    crest_url={team.crest_url}
                                                />
                                            }
                                        </div>
                                    ))}
                                </div>
                            </td>
                            <td>
                                <div className="col pull-right">
                                    {bet.relatedGroup.standings &&
                                        bet.relatedGroup.standings.map(
                                            (team, index) => (
                                                <div
                                                    key={index}
                                                    className="flex-row"
                                                >
                                                    <span>({index + 1})</span>
                                                    {
                                                        <TeamWithFlag
                                                            name={team.name}
                                                            crest_url={
                                                                team.crest_url
                                                            }
                                                        />
                                                    }
                                                </div>
                                            )
                                        )}
                                    {!bet.relatedGroup.standings && '-'}
                                </div>
                            </td>
                        </tr>
                    ))}
            </tbody>
        </table>
    )
}

export default GroupPositionBetsTable
