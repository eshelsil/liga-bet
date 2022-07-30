import React from 'react';
import TeamAndSymbol from "../widgets/TeamWithFlag.tsx";


const SpecialBetsTable = ({
    bets,
}) => {
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
                    <tr key={bet.id}>
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