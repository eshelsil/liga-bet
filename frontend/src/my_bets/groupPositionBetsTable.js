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

const GroupPositionBetsTable = ({bets}) => {


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
            bets
            // sort alphabetically by group name
            .sort((bet1, bet2) => bet1.relatedGroup.name.localeCompare(bet2.relatedGroup.name))
            .map(bet =>
                <tr>
                    <td className="admin">
                        {bet.relatedGroup.id}
                    </td>

                    <td>
                        {bet.relatedGroup.name}
                    </td>
                    <td>
                        <div className="col pull-right">
                            {
                                bet.standings.map(
                                    (team, index) =>
                                        <div className="flex-row">
                                            <span>
                                                ({index + 1})
                                            </span>
                                            {<TeamAndSymbol name={team.name} crest_url={team.crest_url}/>}
                                        </div>
                                )
                            }
                        </div>
                    </td>
                    <td>
                        <div className="col pull-right">
                            {
                                bet.relatedGroup.standings.map(
                                    (team, index) =>
                                        <div className="flex-row">
                                            <span>
                                                ({index + 1})
                                            </span>
                                            {<TeamAndSymbol name={team.name} crest_url={team.crest_url}/>}
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