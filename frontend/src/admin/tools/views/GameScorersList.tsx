import React, { useEffect, useState } from 'react'
import { Collapse, TextField } from '@mui/material'
import ArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { GameGoalsDataWithPlayer, MatchWithGoalsData } from '../../../types'
import PlayerWithImg from '../../../widgets/Player'
import GameHeader from '../../../matches/GameHeader';
import CustomTable from '../../../widgets/Table/CustomTable';
import LoadingVIcon from '../../../widgets/LoadingVIcon';
import EditIcon from '@mui/icons-material/Edit'
import CloseIcon from '@mui/icons-material/Close'
import { setGameGoalData, updateScorersFromGoalsData } from '../../../api/admin';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../_helpers/store';
import { fetchAndStoreGoalsData } from '../../../_actions/matches';
import { LoadingButton } from '../../../widgets/Buttons';
import NewGoalDialog from './NewGoalDialog';
import { keyBy } from 'lodash';
import { isFinalGame } from '../../../utils';


function GameScorersList({ match }: { match: MatchWithGoalsData }) {
    const [expand, setExpand] = useState(false)
    const toggleExpand = () => setExpand(!expand)
    const dispatch = useDispatch<AppDispatch>()

    const [showNewGoalDialog, setShowNewGoalDialog] = useState(false)
    
    const [goals, setGoals] = useState('')
    const [assists, setAssists] = useState('')
    const [idOnEdit, setIdOnEdit] = useState<number>(null)

    const models = match.scorers
    const modelOnEdit = models.find(m => m.id === idOnEdit)

    const showOverrideScorersButton = isFinalGame(match) && match.is_done;

    const onOverrideScorersTotalData = async () => {
        let areYouSure = prompt("Are you sure? only Eshel knows what it does. Enter 10 or above to approve");
        if (Number(areYouSure) >= 10) {
            await updateScorersFromGoalsData(match.id)
        }
    }

    const updatePlayerGoalsData = async () => {
        await setGameGoalData(match.id, {
            [modelOnEdit.playerId]: {
                goals: Number(goals) >= 0 ? Number(goals) : undefined,
                assists: Number(assists) >= 0 ? Number(assists) : undefined,
            },
        })
        await dispatch(fetchAndStoreGoalsData())
        setIdOnEdit(null)
    }

    const submitNewGoal = async (
        scorer: {id: number, goals: number},
        assister?: {id: number, assists: number}
    ) => {
        await setGameGoalData(match.id, {
            [scorer.id]: {
                goals: scorer.goals
            },
            ...(assister ? {
                [assister.id]: {
                    assists: assister.assists
                }
            }: {}),
        })
        await dispatch(fetchAndStoreGoalsData())
        setIdOnEdit(null)
    }

    useEffect(() => {
        if (modelOnEdit){
            setTimeout(() => {
                setGoals(`${modelOnEdit.goals}`)
                setAssists(`${modelOnEdit.assists}`)
            }, 1)
        }
    }, [modelOnEdit])


    const cells = [
        {
            id: 'admin',
            classes: {
                header: 'admin',
                cell: 'admin',
            },
            header: '',
            getter: (model: GameGoalsDataWithPlayer) => model.id,
        },
        {
            id: 'playerId',
            header: 'pId',
            getter: (model: GameGoalsDataWithPlayer) => model.playerId,
        },
        {
            id: 'player',
            header: 'player',
            getter: (model: GameGoalsDataWithPlayer) => (
                <PlayerWithImg player={model.player} size={36} />
            ),
        },
        {
            id: 'goals',
            header: 'goals',
            getter: (model: GameGoalsDataWithPlayer) => 
                model.id === idOnEdit
                    ? (
                        <TextField
                            type={'number'}
                            className={'LB-GoalDataInput'}
                            value={goals}
                            onChange={(e)=> setGoals(e.target.value)}
                            InputProps={{
                                inputProps: {
                                    max: 9,
                                    min: 0,
                                    onClick:(e: any) => e.target.select(),
                                },
                            }}
                        />
                    )
                    : model.goals,
        },
        {
            id: 'assists',
            header: 'asists',
            getter: (model: GameGoalsDataWithPlayer) => 
                model.id === idOnEdit
                    ? (
                        <TextField
                            type={'number'}
                            className={'LB-GoalDataInput'}
                            value={assists}
                            onChange={(e)=> setAssists(e.target.value)}
                            InputProps={{
                                inputProps: {
                                    max: 9,
                                    min: 0,
                                    onClick:(e: any) => e.target.select(),
                                },
                            }}
                        />
                    )
                    : model.assists,
        },
        {
            id: 'buttons',
            classes: {
                cell: 'editButtonCell',
            },
            header: '',
            getter: (model: GameGoalsDataWithPlayer) => 
                model.id === idOnEdit
                    ? (
                        <div>
                            <LoadingVIcon action={updatePlayerGoalsData} />
                            <CloseIcon onClick={() => setIdOnEdit(null)} />
                        </div>
                    )
                    : <EditIcon onClick={() => setIdOnEdit(model.id)}/>,
        },
    ]

    const goalsDataByPlayerId = keyBy(models, 'playerId')

    return (
        <div className={`LB-GameGumblersList ${expand ? 'GameGumblersList-expanded' : ''}`}>
            <GameHeader match={match} onClick={toggleExpand} />
            <Collapse in={expand}>
                <div className='LB-GumblersTable'>
                    <CustomTable models={models} cells={cells}/>
                    <div>
                        <LoadingButton
                            action={async () => setShowNewGoalDialog(true)}
                            style={{margin: '12px auto', display: 'block'}}
                        >
                            עדכן גול חדש
                        </LoadingButton>
                        {showNewGoalDialog && (
                            <NewGoalDialog
                                open={showNewGoalDialog}
                                onClose={ () => setShowNewGoalDialog(false) }
                                game={match}
                                submit={submitNewGoal}
                                goalsDataByPlayerId={goalsDataByPlayerId}
                            />
                        )}
                        {!!showOverrideScorersButton && (
                            <LoadingButton
                                color='error'
                                action={onOverrideScorersTotalData}
                                style={{margin: '32px auto 16px', padding: '2px 10px', display: 'block', fontSize: 12}}
                            >
                                דרוס ניקוד הימורים לפי טבלה זו
                            </LoadingButton>
                        )}
                    </div>
                </div>
            </Collapse>
            <div className='GameGumblersList-expandIconContainer' onClick={toggleExpand}>
                <ArrowDownIcon className={`arrowDownIcon`} />
            </div>
        </div>
    )
}

export default GameScorersList
