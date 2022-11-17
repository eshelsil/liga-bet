import React from 'react'
import { QuestionBetWithRelations } from '../types'
import { SpecialAnswerSmall } from '../widgets/specialAnswer'
import CustomTable from '../widgets/Table/CustomTable'


interface Props {
    bets: QuestionBetWithRelations[],
    headers?: {
        bet?: string,
        result?: string,
    },
}


const SpecialBetsTable = ({ bets, headers }: Props) => {
	const cells = [
		{
			id: 'id',
			header: 'מזהה',
			classes: {
                header: 'admin',
                cell: 'admin',
            },
			getter: (model: QuestionBetWithRelations) => model.id,
		},
		{
			id: 'questionName',
			header: '',
            classes: {
                cell: 'questionNameCell',
            },
			getter: (model: QuestionBetWithRelations) => model.relatedQuestion.name,
		},
		{
			id: 'bet',
			header: headers?.bet ?? 'ניחוש',
            classes: {
                cell: 'alignToTop'
            },
			getter: (model: QuestionBetWithRelations) => (
                <SpecialAnswerSmall
                    answer={model.answer}
                    type={model.relatedQuestion.type}
                />
            ),
		},
		{
			id: 'result',
			header: headers?.result ?? 'תוצאה',
			getter: (model: QuestionBetWithRelations) => (<>
                {model.relatedQuestion.answer.map((answer) => (
                    <SpecialAnswerSmall
                        key={answer.id}
                        answer={answer}
                        type={model.relatedQuestion.type}
                    />
                ))}
            </>),
		},
		{
			id: 'score',
			header: 'נק\'',
            classes: {
                cell: 'scoreCell',
            },
			getter: (model: QuestionBetWithRelations) => model.score,
		},
    ]
	
    return (
        <div className='LB-SpecialBetsTable'>
            <CustomTable models={bets} cells={cells} />
        </div>
    )
}

export default SpecialBetsTable
