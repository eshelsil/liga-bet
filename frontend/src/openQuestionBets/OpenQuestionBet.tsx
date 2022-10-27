import React, { useState } from 'react'
import { Button, Grid, IconButton } from '@mui/material'
import { SpecialQuestionWithABet } from '../types'
import { hasPlayerAnswer, hasTeamAnswer } from '../utils'
import TeamInput from './TeamInput'
import SpecialAnswerView from '../widgets/specialAnswer/SpecialAnswer'
import { QuestionBetParams } from './types'
import PlayerInput from './PlayerInput'
import AddCircle from '@mui/icons-material/AddCircle'
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { useIsXsScreen } from '../hooks/useMedia'


interface Props {
    questionWithBet: SpecialQuestionWithABet
    sendBet: (params: QuestionBetParams) => Promise<void>
}


function QuestionBetEditView({
    questionWithBet,
    sendBet,
    onClose
} : {
    onClose: () => void
} & Props) {
    const { id, bet } = questionWithBet
    const { answer: betAnswer } = bet || {}
    const [answer, setAnswer] = useState<number>(betAnswer?.id)
    const isTeamQuestion = hasTeamAnswer(questionWithBet)
    const isPlayerQuestion = hasPlayerAnswer(questionWithBet)
    const submitBet = async () => {
        await sendBet({ questionId: id, answer })
    }


    return (
        <div className="QuestionBetEditView">
            <div>
                {isTeamQuestion && (
                    <TeamInput value={answer} onChange={setAnswer} />
                )}
                {isPlayerQuestion && (
                    <PlayerInput value={answer} onChange={setAnswer} />
                )}
            </div>
            <div className="buttonContainer">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={submitBet}
                >
                    שלח
                </Button>
                <IconButton className='iconGoBack' onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </div>
        </div>
    )
}


function OpenQuestionBetView({ questionWithBet, sendBet }: Props) {
    const [edit, setEdit] = useState(false)
    const isXsScreen = useIsXsScreen();
    const { name, bet, type } = questionWithBet
    const { answer: betAnswer } = bet || {}
    const hasBet = !!bet

    return (
        <Grid item xs={isXsScreen ? 12 : null}>
            <div className={'LigaBet-OpenQuestionBetView'}>
                <div className="OpenQuestionBetView-header">
                    <h3 className="name">{name}</h3>
                </div>
                {!edit && (
                    <>
                        {hasBet && (
                            <div className="existing_bet">
                                <SpecialAnswerView answer={betAnswer} type={type} />
                                <IconButton onClick={()=> setEdit(true)}>
                                    <EditIcon />
                                </IconButton>
                            </div>
                        )}
                        {!hasBet && (
                            <div className="no_bet">
                                <AddCircle
                                    color='primary'
                                    onClick={()=> setEdit(true)}
                                    style={{fontSize: 48}}
                                />
                            </div>
                        )}
                    </>
                )}
                {edit && (
                    <QuestionBetEditView
                        onClose={() => {setEdit(false)}}
                        questionWithBet={questionWithBet}
                        sendBet={sendBet}
                    />
                )}
            </div>
        </Grid>
    )
}

export default OpenQuestionBetView
