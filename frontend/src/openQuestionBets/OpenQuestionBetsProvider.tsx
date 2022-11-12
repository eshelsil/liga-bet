import React from 'react'
import { connect, useSelector } from 'react-redux'
import { NoSelector } from '../_selectors'
import { OpenQuestionBetsSelector } from '../_selectors/questionBets'
import { sendBetAndStore, SendQuestionBetParams } from '../_actions/bets'
import { BetType } from '../types'
import { QuestionBetParams } from './types'
import QuestionBetsView from './QuestionBetsView'
import './OpenQuestionBets.scss'
import '../styles/openBets/EditableBetView.scss'


interface Props {
    sendBetAndStore: (params: SendQuestionBetParams) => Promise<void>
}

const OpenQuestionBetsProvider = ({ sendBetAndStore }: Props) => {
    const { questionsWithBet, competitionStartTime } = useSelector(OpenQuestionBetsSelector)
    async function sendQuestionBet({ questionId, answer, forAllTournaments }: QuestionBetParams) {
        const params = {
            betType: BetType.Question,
            type_id: questionId,
            payload: {
                answer,
            },
            forAllTournaments,
        }

        return await sendBetAndStore(params)
    }
    return (
        <QuestionBetsView
            questions={questionsWithBet}
            sendQuestionBet={sendQuestionBet}
            competitionStartTime={competitionStartTime}
        />
    )
}

const mapDispatchToProps = {
    sendBetAndStore,
}

export default connect(NoSelector, mapDispatchToProps)(OpenQuestionBetsProvider)
