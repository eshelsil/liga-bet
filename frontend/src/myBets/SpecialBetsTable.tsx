import React from 'react'
import { useTournamentThemeClass } from '../hooks/useTournamentTheme'
import { QuestionBetWithRelations } from '../types'
import { SpecialAnswerSmall } from '../widgets/specialAnswer'
import CustomTable from '../widgets/Table/CustomTable'


const SpecialBetsTable = ({ bets }: { bets: QuestionBetWithRelations[] }) => {
    const tournamentClass = useTournamentThemeClass();

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
			header: 'הניחוש שלך',
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
			header: 'תוצאה בפועל',
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
			getter: (model: QuestionBetWithRelations) => model.score,
		},
    ]
	
    return (
        <div className='LB-MyQuestionBetsTable LB-MyBetsSection'>
            <div className={`MyBetsSection-header ${tournamentClass}`}>
                <h4 className='MyBetsSection-title'>{'שאלות מיוחדות'}</h4>
            </div>
            <CustomTable models={bets} cells={cells} />
        </div>
    )
}

export default SpecialBetsTable
