import React from 'react';
import TeamAndSymbol from "../widgets/team_with_flag";

const DUMMY_DATA = {
    specialBet: [
        {
            id: 1,
            title: "זוכה",
            bet: {
                value: "France",
                flag: "https://crests.football-data.org/773.svg"
            },
            actualResults: [
                {
                    value: "Italy",
                    flag: "https://crests.football-data.org/784.svg"
                }
            ]
        },
        {
            id: 2,
            title: "סגנית",
            bet: {
                value: "Belgium",
                flag: "https://crests.football-data.org/805.svg"
            },
            actualResults: [
                {
                    value: "England",
                    flag: "https://crests.football-data.org/770.svg"
                }
            ]
        },
        {
            id: 3,
            title: "מלך השערים",
            bet: {
                value: "Romelu Lukaku",
                flag: "https://crests.football-data.org/805.svg"
            },
            actualResults: [
                {
                    value: "Cristiano Ronaldo",
                    flag: "https://crests.football-data.org/765.svg"
                },
                {
                    value: "Patrik Schick",
                    flag: "https://crests.football-data.org/798.svg"
                }
            ]
        },
        {
            id: 4,
            title: "מלך הבישולים",
            bet: {
                value: "Thomas Müller",
                // flag: "https://crests.football-data.org/759.svg"
            },
            actualResults: [
                {
                    value: "Steven Zuber",
                    // flag: "https://crests.football-data.org/788.svg"
                }
            ]
        },
        {
            id: 5,
            title: "מצטיין הטורניר",
            bet: {
                value: "N'Golo Kanté",
                // flag: ""
            },
            actualResults: [
                {
                    value: "Gianluigi Donnarumma",
                    // flag: ""
                }
            ]
        },
        {
            id: 6,
            title: "ההתקפה החזקה בבתים",
            bet: {
                value: "Belgium",
                flag: "https://crests.football-data.org/805.svg"
            },
            actualResults: [
                {
                    value: "Netherlands",
                    flag: "https://crests.football-data.org/8601.svg"
                }
            ]
        },
    ],
}

const SpecialBetsTable = ({
    bets,
}) => {
    console.log('bets123', bets)
    return <table className="table table-striped">
        <thead>
        <tr>
            <th className="admin">מזהה</th>
            <th>
                סוג
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
            bets.map((bet =>
                    <tr>
                        <td className="admin">{bet.id}</td>

                        <td>
                            {bet.relatedQuestion.name}
                        </td>
                        <td>
                            <TeamAndSymbol name={bet.answer.name} crest_url={bet.answer.crest_url}/>
                        </td>
                        <td>
                            <TeamAndSymbol name={bet.relatedQuestion.answer.name} crest_url={bet.relatedQuestion.answer.crest_url}/>
                        </td>
                    </tr>
            ))
        }
        </tbody>
    </table>
};

export default SpecialBetsTable;