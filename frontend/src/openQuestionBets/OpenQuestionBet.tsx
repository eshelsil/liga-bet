import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Grid, IconButton, Switch } from '@mui/material'
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
import useCancelEdit from '../hooks/useCancelEdit'
import { IsMultiBetDefaultForAll, MyOtherBettableUTLs } from '../_selectors'


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
    const otherTournaments = useSelector(MyOtherBettableUTLs);
    const hasOtherTournaments = otherTournaments.length > 0;
    const isMultiBetDefault = useSelector(IsMultiBetDefaultForAll)
    const [edit, setEdit] = useState(false)
    const [forAllTournaments, setForAllTournaments] = useState(isMultiBetDefault)
    const { getLastEditTs, cancelEdit } = useCancelEdit({edit, setEdit})
    const tournamentClass = useTournamentThemeClass();
    const isXsScreen = useIsXsScreen();
    const { name, bet, type } = questionWithBet
    const { answer: betAnswer } = bet || {}
    const hasBet = !!bet


    const openEditMode = () => {
        setEdit(true)
    }
    const exitEditMode = () => setEdit(false)


    const onBetSubmit = async (params: QuestionBetParams) => {
        const ts = getLastEditTs()
        return await sendBet({...params, forAllTournaments})
            .then(function (data) {
                let text = 'ההימור נשלח'
                if (forAllTournaments){
                    text += ` עבור ${otherTournaments.length + 1} טורנירים`
                }
                window['toastr']['success'](text)
                cancelEdit(ts)
            })
            .catch(function (error) {
                console.log('FAILED sending bet', error)
            })
    }
    useEffect(()=> {
        setForAllTournaments(isMultiBetDefault)
    }, [edit, isMultiBetDefault, setForAllTournaments])

    return (
        <Grid item xs={isXsScreen ? 12 : null}>
            <div className={'LigaBet-OpenQuestionBetView LB-EditableBetView'}>
                <div className={`EditableBetView-header ${tournamentClass} ${(edit && forAllTournaments) ? 'sendingforAllTournaments' : ''}`}>
                    <h4 className="name">{name}</h4>
                    {edit && hasOtherTournaments && (
                        <Switch
                            className='forAllTournamentsInput'
                            checked={forAllTournaments}
                            onChange={(e, value) => setForAllTournaments(value)}
                        />
                    )}
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
