import React from 'react'
import { connect, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
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
    const { t } = useTranslation('openQuestionBets')
    const { questionsWithBet, competitionStartTime, isTournamentStarted  } = useSelector(OpenQuestionBetsSelector)
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
        <div>
            {!isTournamentStarted && (
                <QuestionBetsView
                    questions={questionsWithBet}
                    sendQuestionBet={sendQuestionBet}
                    competitionStartTime={competitionStartTime}
                />
            )}
            {isTournamentStarted && (
                <h2 className='LB-TitleText'>{t('provider.tournamentStartedLocked')}</h2>
            )}
        </div>
    )
}

const mapDispatchToProps = {
    sendBetAndStore,
}

export default connect(NoSelector, mapDispatchToProps)(OpenQuestionBetsProvider)
