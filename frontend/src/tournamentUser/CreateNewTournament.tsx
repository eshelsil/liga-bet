import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import {
    CompetitionsById,
    CompetitionStatus,
    CompetitionType,
    Tournament,
    TournamentType,
} from '../types'
import {
    createNewTournament,
    fetchOwnedTournaments,
} from '../_actions/tournament'
import { createUtl } from '../_actions/tournamentUser'
import { fetchAndStoreCompetitions } from '../_actions/competition'
import { CreateNewTournamentSelector } from '../_selectors'
import { FormControlLabel, Radio, RadioGroup, TextField } from '@mui/material'
import useGoTo from '../hooks/useGoTo'
import { cn, keysOf } from '../utils'
import { LoadingButton } from '../widgets/Buttons'
import useMemoFlatObject from '@/hooks/useMemoFlatObject'

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
    const { goToHome } = useGoTo()
    const { t } = useTranslation('tournamentUser')

    const competitionIds = useMemoFlatObject(keysOf(competitionsById))
    const isOnlyOneCompetition = competitionIds.length === 1
    const disabled = isOnlyOneCompetition

    const selectedCompetition = competitionsById[competition]

    async function createTournament() {
        return await createNewTournament({
            competitionId: competition,
            name,
            type:
                selectedCompetition?.status === CompetitionStatus.Ongoing
                    ? TournamentType.KnockoutBracket // temp: should add an input for tournament type
                    : undefined,
        }).catch(function (error) {
            console.log('FAILED creating tournament', error)
        })
    }
    async function createUtl() {
        return await onCreateUtl({
            tournamentCode: tournamentWithNoUtl?.code,
            name: nickname,
        })
            .then(() => {
                window['toastr']['success'](t('create.successToast'))
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


    return (
        <div className="LB-CreateNewTournament">
            <h1 className="LB-TitleText">{t('create.title')}</h1>
            {tournamentWithNoUtl && (
                <div className="LB-UserJoinOwnedTournament">
                    <h2>
                        {t('create.tournamentLabel', {
                            name: tournamentWithNoUtl.name,
                        })}
                    </h2>
                    <h3>{t('create.chooseNickname')}</h3>
                    <TextField
                        value={nickname}
                        label={t('create.nickname')}
                        onChange={(e) => setNickname(e.target.value)}
                    />
                    <div className="buttonContainer">
                        <LoadingButton action={createUtl}>
                            {t('create.continue')}
                        </LoadingButton>
                    </div>
                </div>
            )}
            {!tournamentWithNoUtl && (
                <div className="LB-CreateNewTournament-content">
                    {isOnlyOneCompetition && selectedCompetition && (
                        <div className="LB-CompetitionTitle">
                            <img
                                src={selectedCompetition.emblem}
                                className={cn('h-[60px] me-2 object-contain')}
                            />
                            <h2>{selectedCompetition.name}</h2>
                        </div>
                    )}
                    {!isOnlyOneCompetition && (
                        <>
                            <h3 className={'LB-CreateNewTournament-title'}>
                                {t('create.chooseCompetition')}
                            </h3>
                            <RadioGroup
                                value={competition || null}
                                onChange={(e) =>
                                    setCompetition(Number(e.target.value))
                                }
                                name="competitions"
                            >
                                {Object.values(competitionsById).map(
                                    (competition) => (
                                        <FormControlLabel
                                            key={competition.id}
                                            value={competition.id}
                                            control={
                                                <Radio disabled={disabled} />
                                            }
                                            label={
                                                <div>
                                                    {competition.emblem && (
                                                        <img
                                                            className="LB-CompetitionEmblem"
                                                            src={
                                                                competition.emblem
                                                            }
                                                        />
                                                    )}
                                                    {competition.name}
                                                </div>
                                            }
                                        />
                                    )
                                )}
                            </RadioGroup>
                        </>
                    )}
                    <div className="nameInputContainer">
                        <h3>{t('create.tournamentName')}</h3>
                        <TextField
                            value={name}
                            label={t('create.tournamentNameLabel')}
                            onChange={(e) => setName(e.target.value)}
                            className={'nameInput'}
                        />
                    </div>
                    <div className="buttonContainer">
                        <LoadingButton action={createTournament}>
                            {t('create.createButton')}
                        </LoadingButton>
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
