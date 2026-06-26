import React from 'react'
import { Grid } from '@mui/material'
import { useTranslation } from 'react-i18next'
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
    const { t } = useTranslation('openQuestionBets')
    const startTimeString = competitionStartTime ? `(${dayjs(competitionStartTime).format(DEFAULT_DATETIME_FORMAT)})` : ''
    const otherTournaments = useSelector(MyOtherBettableUTLs)
    const hasOtherTournaments = otherTournaments.length > 0
    return (
        <div className="LigaBet-QuestionBetsView">
            <h1 className='LB-TitleText'>{t('view.title')}</h1>
            <div className='LB-FloatingFrame'>
                <ul style={{margin: 0}}>
                    <li>{t('view.editUntil', { startTime: startTimeString })}</li>
                    <li style={{marginTop: 8}}>
                        {t('view.scoringMethodPrefix')}
                        <TakanonPreviewModal label={t('view.scoringMethodLink')}>
                            <SpecialQuestionsRules />
                        </TakanonPreviewModal>
                    </li>
                </ul>
            </div>
            {hasOtherTournaments && (
                <MultiBetsSettings />
            )}
            <div>
                <Grid container justifyContent="center">
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
