import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Checkbox, FormControlLabel, TextField } from '@mui/material'
import { CurrentTournamentId, MyTournamentCodes, NoSelector, LiveTournamentsWithMyUtl } from '../_selectors'
import { connect } from 'react-redux'
import { createUtl } from '../_actions/tournamentUser'
import useGoTo from '../hooks/useGoTo'
import { getTournamentsName } from '../api/tournaments'
import TournamentIcon from '@mui/icons-material/EmojiEvents';
import { reportApiError } from '../utils'
import { LoadingButton } from '../widgets/Buttons'
import { useSelector } from 'react-redux'
import { isEmpty } from 'lodash'
import TournamentInput from '../widgets/TournamentInput'


interface Props {
    onJoin: (...args: any) => Promise<void>
}

function JoinTournament({ onJoin }: Props) {
    const { tournamentId } = useParams<any>();
    const codeFromURL = tournamentId
    const myRelevantTournamentsById = useSelector(LiveTournamentsWithMyUtl   )
    const currentTournamentId = useSelector(CurrentTournamentId)
    const myTournamentCodes = useSelector(MyTournamentCodes)
    const [code, setCode] = useState(codeFromURL || '')
    const [name, setName] = useState('')
    const [tournamentName, setTournamentName] = useState('')
    const [isCodeFromUrlInvalid, setIsCodeFromUrlInvalid] = useState<boolean>()
    const [shouldImport, setShouldImport] = useState(true)
    const [exportedTournament, setExportedTournament] = useState(currentTournamentId)
    const { goToHome } = useGoTo();
    const { t } = useTranslation('tournamentUser')

    const alreadyJoined = myTournamentCodes.includes(codeFromURL)
    const hasTournaments = !isEmpty(myRelevantTournamentsById)

    async function join() {
        await onJoin({ tournamentCode: code, name, importFromTournament: shouldImport ? exportedTournament : undefined  })
            .then(() => {
                window['toastr']['success'](t('join.successToast'))
                goToHome()
            })
            .catch(function (error) {
                console.log('FAILED join tournament', error)
            })
        
    }

    const isCodeAutoSet = !!codeFromURL && !isCodeFromUrlInvalid

    useEffect(() => {
        if (alreadyJoined) {
            goToHome()
        } else if (codeFromURL) {
            getTournamentsName(codeFromURL)
                .then(name => {
                    setTournamentName(name)
                })
                .catch(error => {
                    reportApiError(error)
                    setIsCodeFromUrlInvalid(true)
                })
        }
    }, [codeFromURL, alreadyJoined])

    useEffect(()=> {
        if (!exportedTournament) {
            setExportedTournament(currentTournamentId)
        }
    }, [currentTournamentId])
    

    return (
        <div className='LB-JoinTournament'>
            {!alreadyJoined && (<>
                <h1 className='LB-TitleText'>{t('join.title')}</h1>
                <div className='joinTournamentForm'>
                    {isCodeAutoSet && (
                        <div className='tournamentName'>
                            <TournamentIcon className='tournamentIcon' fontSize='large' />
                            <div>{tournamentName}</div>
                        </div>
                    )}
                    {!isCodeAutoSet && (
                        <TextField
                            value={code}
                            label={t('join.tournamentCode')}
                            onChange={(e) => setCode(e.target.value)}
                        />
                    )}
                    <TextField
                        value={name}
                        label={t('join.nickname')}
                        onChange={(e) => setName(e.target.value)}
                    />
                    {hasTournaments && (
                        <div className='importBetsSection'>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        size='medium'
                                        checked={shouldImport}
                                        onChange={(e, value: boolean) => setShouldImport(value)}
                                    />
                                }
                                label={t('join.importBets')}
                            />
                            {shouldImport && (
                                // Todo: handle importable & which tournament can import from and is the proper tournament & colors & show competition
                                <TournamentInput
                                    value={exportedTournament}
                                    onChange={setExportedTournament}
                                    tournamentsById={myRelevantTournamentsById}
                                />
                            )}
                        </div>
                    )}
                    <div className='buttonContainer'>
                        <LoadingButton action={join}>{t('join.joinButton')}</LoadingButton>
                    </div>
                </div>
            </>)}
        </div>
    )
}

const mapDispatchToProps = {
    onJoin: createUtl,
}

export default connect(
    NoSelector,
    mapDispatchToProps
)(JoinTournament)
