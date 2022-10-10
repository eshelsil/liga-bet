import React from 'react'
import { QuestionBetWithRelations } from '../types'
import SpecialAnswer from '../widgets/specialAnswer/SpecialAnswer'

const SpecialBetsTable = ({ bets }: { bets: QuestionBetWithRelations[] }) => {
    return (
        <table className="table table-striped">
            <thead>
                <tr>
                    <th className="admin">מזהה</th>
                    <th>סוג</th>
                    <th>הימור</th>
                    <th>תוצאה</th>
                </tr>
            </thead>
            <tbody>
                {bets.map((bet) => (
                    <tr key={bet.id}>
                        <td className="admin">{bet.id}</td>

                        <td>{bet.relatedQuestion.name}</td>
                        <td>
                            <SpecialAnswer
                                answer={bet.answer}
                                type={bet.relatedQuestion.type}
                            />
                        </td>
                        <td>
                            {bet.relatedQuestion.answer.map((answer) => (
                                <SpecialAnswer
                                    key={answer.id}
                                    answer={answer}
                                    type={bet.relatedQuestion.type}
                                />
                            ))}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default SpecialBetsTable
