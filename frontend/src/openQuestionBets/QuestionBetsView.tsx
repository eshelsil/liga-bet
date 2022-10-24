import { Grid } from '@mui/material'
import React from 'react'
import { SpecialQuestionWithABet } from '../types'
import OpenQuestionBetView from './OpenQuestionBet'
import { QuestionBetParams } from './types'

interface Props {
    questions: SpecialQuestionWithABet[]
    sendQuestionBet: (params: QuestionBetParams) => Promise<void>
}

const QuestionBetsView = ({ questions, sendQuestionBet }: Props) => {
    return (
        <div className="LigaBet-QuestionBetsView">
            <h1>הימורים מיוחדים</h1>
            <div>
                <Grid container>
                    {questions.map((question) => (
                        <OpenQuestionBetView
                            key={question.id}
                            questionWithBet={question}
                            sendBet={sendQuestionBet}
                        />
                    ))}
                </Grid>
            </div>
        </div>
    )
}

export default QuestionBetsView
