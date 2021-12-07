import React from 'react';
import TeamAndSymbol from "../widgets/team_with_flag";

const DUMMY_DATA = {
    groupPositionBet: [
        {
            id: 1,
            name: "Group A",
            userBet: [
                {
                    name: "Italy",
                    flag: "https://crests.football-data.org/784.svg",
                    position: 1,
                },
                {
                    name: "Switzerland",
                    flag: "https://crests.football-data.org/788.svg",
                    position: 2,
                },
                {
                    name: "Wales",
                    flag: "https://crests.football-data.org/833.svg",
                    position: 3,
                },
                {
                    name: "Turkey",
                    flag: "https://crests.football-data.org/803.svg",
                    position: 4,
                },
            ],
            actualResult: [
                {
                    name: "Italy",
                    flag: "https://crests.football-data.org/784.svg",
                    position: 1,
                },
                {
                    name: "Switzerland",
                    flag: "https://crests.football-data.org/788.svg",
                    position: 3,
                },
                {
                    name: "Wales",
                    flag: "https://crests.football-data.org/833.svg",
                    position: 2,
                },
                {
                    name: "Turkey",
                    flag: "https://crests.football-data.org/803.svg",
                    position: 4,
                },
            ],
        },
        {
            id: 2,
            name: "Group C",
            userBet: [
                {
                    name: "Netherlands",
                    flag: "https://crests.football-data.org/8601.svg",
                    position: 1,
                },
                {
                    name: "Austria",
                    flag: "https://crests.football-data.org/816.svg",
                    position: 2,
                },
                {
                    name: "Ukraine",
                    flag: "https://crests.football-data.org/790.svg",
                    position: 3,
                },
                {
                    name: "North Macedonia",
                    flag: "https://crests.football-data.org/1977.svg",
                    position: 4,
                },
            ],
            actualResult: [
                {
                    name: "Netherlands",
                    flag: "https://crests.football-data.org/8601.svg",
                    position: 1,
                },
                {
                    name: "Austria",
                    flag: "https://crests.football-data.org/816.svg",
                    position: 2,
                },
                {
                    name: "Ukraine",
                    flag: "https://crests.football-data.org/790.svg",
                    position: 3,
                },
                {
                    name: "North Macedonia",
                    flag: "https://crests.football-data.org/1977.svg",
                    position: 4,
                },
            ],
        },
        {
            id: 3,
            name: "Group B",
            userBet: [
                {
                    name: "Belgium",
                    flag: "https://crests.football-data.org/805.svg",
                    position: 1,
                },
                {
                    name: "Denmark",
                    flag: "https://crests.football-data.org/782.svg",
                    position: 2,
                },
                {
                    name: "Russia",
                    flag: "https://crests.football-data.org/808.svg",
                    position: 3,
                },
                {
                    name: "Finland",
                    flag: "https://crests.football-data.org/1976.svg",
                    position: 4,
                },
            ],
            actualResult: [
                {
                    name: "Belgium",
                    flag: "https://crests.football-data.org/805.svg",
                    position: 1,
                },
                {
                    name: "Denmark",
                    flag: "https://crests.football-data.org/782.svg",
                    position: 2,
                },
                {
                    name: "Russia",
                    flag: "https://crests.football-data.org/808.svg",
                    position: 4,
                },
                {
                    name: "Finland",
                    flag: "https://crests.football-data.org/1976.svg",
                    position: 3,
                },
            ],
        },
    ],
}

const GroupPositionBetsTable = (props) => {

    // const {groupPositionBet} = props;
    const {groupPositionBet} = DUMMY_DATA;


    return <table className="table table-striped">
        <thead>
        <tr>
            <th className="admin">מזהה</th>
            <th>
                בית
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
        {/*@foreach($groups as $group)*/}
        {
            groupPositionBet && groupPositionBet
                // sort alphabetically by group name
                .sort((group1, group2) => group1.name.localeCompare(group2.name))
                .map(group =>
                    <tr>
                        <td className="admin">
                            {group.id}
                        </td>

                        <td>
                            {group.name}
                        </td>
                        <td>
                            <div className="col pull-right">
                                {
                                    group.userBet
                                        // sort by position of the team
                                        .sort((team1, team2) => team1.position - team2.position)
                                        .map(team =>
                                            <div className="flex-row">
                                                <span>
                                                    ({team.position})
                                                </span>
                                                {<TeamAndSymbol name={team.name} crest_url={team.flag}/>}
                                            </div>
                                        )
                                }
                            </div>
                        </td>
                        <td>
                            <div className="col pull-right">
                                {
                                    group.actualResult
                                        // sort by position of the team
                                        .sort((team1, team2) => team1.position - team2.position)
                                        .map(team =>
                                            <div className="flex-row">
                                                <span>
                                                    ({team.position})
                                                </span>
                                                {<TeamAndSymbol name={team.name} crest_url={team.flag}/>}
                                            </div>
                                        )
                                }
                            </div>
                        </td>

                    </tr>
                )
        }
        </tbody>
    </table>
};

export default GroupPositionBetsTable;