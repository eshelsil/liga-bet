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
    FormControlLabel,
    Radio,
    RadioGroup,
    TextField,
} from '@mui/material'
import useGoTo from '../hooks/useGoTo'
import { cn, keysOf } from '../utils'
import { LoadingButton } from '../widgets/Buttons'

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
    const isOnlyOneCompetition = competitionIds.length === 1
    const disabled = isOnlyOneCompetition

    async function createTournament() {
        return await createNewTournament({ competitionId: competition, name })
            .catch(function (error) {
                console.log('FAILED creating tournament', error)
            })
    }
    async function createUtl() {
        return await onCreateUtl({
            tournamentCode: tournamentWithNoUtl?.code,
            name: nickname,
        })
        .then(() => {
            window['toastr']['success']('הטורניר נוצר!')
            goToHome()
        })
        .catch(function (error) {
            console.log('FAILED creating utl', error)
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

    const selectedCompetition = competitionsById[competition]

    return (
        <div className='LB-CreateNewTournament'>
            <h1 className='LB-TitleText'>צור טורניר חדש</h1>
            {tournamentWithNoUtl && (
                
                <div className='LB-UserJoinOwnedTournament'>
                    <h2>טורניר: {tournamentWithNoUtl.name}</h2>
                    <h3>בחר לעצמך כינוי:</h3>
                    <TextField
                        value={nickname}
                        label={'כינוי'}
                        onChange={(e) => setNickname(e.target.value)}
                    />
                    <div className='buttonContainer'>
                        <LoadingButton action={createUtl}>המשך</LoadingButton>
                    </div>
                </div>
            )}
            {!tournamentWithNoUtl && (
                <div className='LB-CreateNewTournament-content'>
                    {isOnlyOneCompetition && selectedCompetition && (
                        <div className='LB-CompetitionTitle'>
                            <img src={selectedCompetition.emblem} className={cn("h-[60px] ml-2 object-contain")} />
                            <h2>{selectedCompetition.name}</h2>
                        </div>
                    )}
                    {!isOnlyOneCompetition && (<>
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
                                    label={
                                        <div>
                                            {competition.emblem && (
                                                <img className="LB-CompetitionEmblem" src={competition.emblem} />
                                            )}
                                            {competition.name}
                                        </div>
                                    }
                                />
                            ))}
                        </RadioGroup>
                    </>)}
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
                        <LoadingButton action={createTournament}>צור טורניר</LoadingButton>
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
