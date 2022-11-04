import React, { useRef, useState } from 'react'
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
import { useTournamentThemeClass } from '../hooks/useTournamentTheme'
import { LoadingButton } from '../widgets/Buttons'


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
                <LoadingButton
                    action={submitBet}
                >
                    שלח
                </LoadingButton>
                <IconButton className='iconGoBack' onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </div>
        </div>
    )
}


function OpenQuestionBetView({ questionWithBet, sendBet }: Props) {
    const lastEditOpen = useRef<number>()
    const [edit, setEdit] = useState(false)
    const tournamentClass = useTournamentThemeClass();
    const isXsScreen = useIsXsScreen();
    const { name, bet, type } = questionWithBet
    const { answer: betAnswer } = bet || {}
    const hasBet = !!bet


    const openEditMode = () => {
        lastEditOpen.current = Number(new Date())
        setEdit(true)
    }
    const exitEditMode = () => setEdit(false)


    const onBetSubmit = async (params: QuestionBetParams) => {
        const ts = lastEditOpen.current
        await sendBet(params)
        if (ts === lastEditOpen.current) {
            exitEditMode()
        }
    }

    return (
        <Grid item xs={isXsScreen ? 12 : null}>
            <div className={'LigaBet-OpenQuestionBetView'}>
                <div className={`OpenQuestionBetView-header ${tournamentClass}`}>
                    <h4 className="name">{name}</h4>
                </div>
                {!edit && (
                    <>
                        {hasBet && (
                            <div className="existing_bet">
                                <SpecialAnswerView answer={betAnswer} type={type} />
                                <IconButton onClick={openEditMode}>
                                    <EditIcon />
                                </IconButton>
                            </div>
                        )}
                        {!hasBet && (
                            <div className="no_bet">
                                <AddCircle
                                    color='primary'
                                    onClick={openEditMode}
                                    style={{fontSize: 48}}
                                />
                            </div>
                        )}
                    </>
                )}
                {edit && (
                    <QuestionBetEditView
                        onClose={exitEditMode}
                        questionWithBet={questionWithBet}
                        sendBet={onBetSubmit}
                    />
                )}
            </div>
        </Grid>
    )
}

export default OpenQuestionBetView
