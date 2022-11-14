import React from 'react'
import { Grid } from '@mui/material'
import dayjs from 'dayjs'
import SpecialQuestionsRules from '../takanon/specialQuestions/SpecialQuestionsRules'
import TakanonPreviewModal from '../tournamentConfig/takanonPreview/TakanonPreviewModal'
import { SpecialQuestionWithABet } from '../types'
import { DEFAULT_DATETIME_FORMAT } from '../utils'
import OpenQuestionBetView from './OpenQuestionBet'
import { QuestionBetParams } from './types'
import { MyOtherBettableUTLs } from '../_selectors'
import { useSelector } from 'react-redux'
import MultiBetsSettings from '../multiBetsSettings/MultiBetsSettingsProvider'

interface Props {
    questions: SpecialQuestionWithABet[]
    competitionStartTime: Date
    sendQuestionBet: (params: QuestionBetParams) => Promise<void>
}

const QuestionBetsView = ({ questions, sendQuestionBet, competitionStartTime }: Props) => {
    const startTimeString = competitionStartTime ? `(${dayjs(competitionStartTime).format(DEFAULT_DATETIME_FORMAT)})` : ''
    const otherTournaments = useSelector(MyOtherBettableUTLs)
    const hasOtherTournaments = otherTournaments.length > 0
    return (
        <div className="LigaBet-QuestionBetsView">
            <h1 className='LB-TitleText'>ניחושים מיוחדים</h1>
            <div className='LB-FloatingFrame'>
                <ul>
                    <li>ניתן לערוך את הניחושים עד שעת תתחילת המשחק הראשון בטורניר {' '}{startTimeString}</li>
                    <li style={{marginTop: 8}}>
                        ניתן לראות את שיטת הניקוד
                        <TakanonPreviewModal label={'בלחיצה כאן'}>
                            <SpecialQuestionsRules />
                        </TakanonPreviewModal>
                    </li>
                </ul>
            </div>
            {hasOtherTournaments && (
                <MultiBetsSettings />
            )}
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
