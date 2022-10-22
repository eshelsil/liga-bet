import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { CompetitionsById, Tournament } from '../types'
import {
    createNewTournament,
    fetchOwnedTournaments,
} from '../_actions/tournament'
import { createUtl } from '../_actions/tournamentUser'
import { fetchAndStoreCompetitions } from '../_actions/competition'
import { CreateNewTournamentSelector } from '../_selectors'
import {
    Button,
    FormControlLabel,
    Radio,
    RadioGroup,
    TextField,
} from '@mui/material'
import useGoTo from '../hooks/useGoTo'
import { keysOf } from '../utils'

interface Props {
    onCreateUtl: (...args: any) => any
    createNewTournament: (...args: any) => any
    fetchOwnedTournaments: (...args: any) => any
    fetchAndStoreCompetitions: (...args: any) => any
    competitionsById: CompetitionsById
    tournamentWithNoUtl?: Tournament
}

function CreateNewTournament({
    onCreateUtl,
    createNewTournament,
    competitionsById,
    tournamentWithNoUtl,
    fetchAndStoreCompetitions,
    fetchOwnedTournaments,
}: Props) {
    const [nickname, setNickname] = useState('')
    const [name, setName] = useState('')
    const [competition, setCompetition] = useState<number>()
    const { goToHome } = useGoTo();

    const competitionIds = keysOf(competitionsById)
    const disabled = competitionIds.length === 1

    function createTournament() {
        createNewTournament({ competitionId: competition, name })
    }
    function createUtl() {
        onCreateUtl({
            tournamentCode: tournamentWithNoUtl?.code,
            name: nickname,
        })
        .then(() => {
            window['toastr']['success']('הטורניר נוצר!')
            goToHome()
        })
    }

    useEffect(() => {
        fetchAndStoreCompetitions()
        fetchOwnedTournaments()
    }, [])

    useEffect(() => {
        if (!competition && competitionIds.length > 0) {
            setCompetition(competitionIds[0])
        }
    }, [competitionIds])

    return (
        <div className='LB-CreateNewTournament'>
            <h1>צור טורניר חדש</h1>
            {tournamentWithNoUtl && (
                <div className='LB-UserJoinOwnedTournament'>
                    <h3>בחר לעצמך כינוי:</h3>
                    <TextField
                        value={nickname}
                        label={'כינוי'}
                        onChange={(e) => setNickname(e.target.value)}
                    />
                    <div className='buttonContainer'>
                        <Button color='primary' variant='contained' onClick={createUtl}>המשך</Button>
                    </div>
                </div>
            )}
            {!tournamentWithNoUtl && (
                <div className='LB-CreateNewTournament-content'>
                    <h3 className={'LB-CreateNewTournament-title'}>בחר תחרות:</h3>
                    <RadioGroup
                        value={competition || null}
                        onChange={(e) => setCompetition(Number(e.target.value))}
                        name="competitions"
                    >
                        {Object.values(competitionsById).map((competition) => (
                            <FormControlLabel
                                key={competition.id}
                                value={competition.id}
                                control={<Radio disabled={disabled} />}
                                label={competition.name}
                            />
                        ))}
                    </RadioGroup>
                    <div className='nameInputContainer'>
                        <h3>שם הטורניר:</h3>
                        <TextField
                            value={name}
                            label={'שם הטורניר'}
                            onChange={(e) => setName(e.target.value)}
                            className={'nameInput'}
                        />
                    </div>
                    <div className='buttonContainer'>
                        <Button color='primary' variant='contained' onClick={createTournament}>צור טורניר</Button>
                    </div>
                </div>
            )}
        </div>
    )
}

const mapDispatchToProps = {
    createNewTournament,
    fetchAndStoreCompetitions,
    fetchOwnedTournaments,
    onCreateUtl: createUtl,
}

export default connect(
    CreateNewTournamentSelector,
    mapDispatchToProps
)(CreateNewTournament)
