import React from 'react';
import TeamAndSymbol from "../widgets/team_with_flag";

const DUMMY_DATA = {
    id: 1,
    specialBet: [
        {
            title: "זוכה",
            bet: {
                value: "France",
                flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/1920px-Flag_of_Canada_%28Pantone%29.svg.png"
            },
            actualResults: [
                {
                    value: "Italy",
                    flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/1920px-Flag_of_Canada_%28Pantone%29.svg.png"
                }
            ]
        },
        {
            title: "סגנית",
            bet: {
                value: "Belgium",
                flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/1920px-Flag_of_Canada_%28Pantone%29.svg.png"
            },
            actualResults: [
                {
                    value: "England",
                    flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/1920px-Flag_of_Canada_%28Pantone%29.svg.png"
                }
            ]
        },
        {
            title: "מלך השערים",
            bet: {
                value: "Romelu Lukaku",
                flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/1920px-Flag_of_Canada_%28Pantone%29.svg.png"
            },
            actualResults: [
                {
                    value: "Cristiano Ronaldo",
                    flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/1920px-Flag_of_Canada_%28Pantone%29.svg.png"
                },
                {
                    value: "Patrik Schick",
                    flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/1920px-Flag_of_Canada_%28Pantone%29.svg.png"
                }
            ]
        },
        {
            title: "מלך הבישולים",
            bet: {
                value: "Thomas Müller",
                flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/1920px-Flag_of_Canada_%28Pantone%29.svg.png"
            },
            actualResults: [
                {
                    value: "Steven Zuber",
                    flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/1920px-Flag_of_Canada_%28Pantone%29.svg.png"
                }
            ]
        },
        {
            title: "מצטיין הטורניר",
            bet: {
                value: "N'Golo Kanté",
                flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/1920px-Flag_of_Canada_%28Pantone%29.svg.png"
            },
            actualResults: [
                {
                    value: "Gianluigi Donnarumma",
                    flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/1920px-Flag_of_Canada_%28Pantone%29.svg.png"
                }
            ]
        },
        {
            title: "ההתקפה החזקה בבתים",
            bet: {
                value: "Belgium",
                flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/1920px-Flag_of_Canada_%28Pantone%29.svg.png"
            },
            actualResults: [
                {
                    value: "Netherlands",
                    flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/1920px-Flag_of_Canada_%28Pantone%29.svg.png"
                }
            ]
        },
    ],
}

const SpecialBetsTable = ( props ) => {

    // const {specialBet} = props;
    const {id, specialBet} = DUMMY_DATA;


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
            specialBet && specialBet.map((row =>
                    <tr>
                        <td className="admin">{id}</td>

                        <td>
                            {row.title}
                        </td>
                        <td>
                            <TeamAndSymbol name={row.bet.value} crest_url={row.bet.flag}/>
                        </td>
                        <td>
                            {
                                row.actualResults.map(data =>
                                    <TeamAndSymbol name={data.value} crest_url={data.flag}/>
                                )
                            }
                        </td>
                    </tr>
            ))
        }
        </tbody>
    </table>
};

export default SpecialBetsTable;