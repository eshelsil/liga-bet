import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Checkbox, FormControlLabel, TextField } from '@mui/material'
import { CurrentTournamentId, MyTournamentCodes, NoSelector, TournamentsWithMyUtl } from '../_selectors'
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
    const myTournamentsById = useSelector(TournamentsWithMyUtl)
    const currentTournamentId = useSelector(CurrentTournamentId)
    const myTournamentCodes = useSelector(MyTournamentCodes)
    const [code, setCode] = useState(codeFromURL || '')
    const [name, setName] = useState('')
    const [tournamentName, setTournamentName] = useState('')
    const [isCodeFromUrlInvalid, setIsCodeFromUrlInvalid] = useState<boolean>()
    const [shouldImport, setShouldImport] = useState(true)
    const [exportedTournament, setExportedTournament] = useState(currentTournamentId)
    const { goToHome } = useGoTo();

    const alreadyJoined = myTournamentCodes.includes(codeFromURL)
    const hasTournaments = !isEmpty(myTournamentsById)

    async function join() {
        await onJoin({ tournamentCode: code, name, importFromTournament: shouldImport ? exportedTournament : undefined  })
            .then(() => {
                window['toastr']['success']('נרשמת לטורניר בהצלחה')
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
                <h1 className='LB-TitleText'>הצטרף לטורניר קיים</h1>
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
                            label='קוד טורניר'
                            onChange={(e) => setCode(e.target.value)}
                        />
                    )}
                    <TextField
                        value={name}
                        label='כינוי'
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
                                label="ייבא ניחושים שמילאתי"
                            />
                            {shouldImport && (
                                <TournamentInput
                                    value={exportedTournament}
                                    onChange={setExportedTournament}
                                    tournamentsById={myTournamentsById}
                                />
                            )}
                        </div>
                    )}
                    <div className='buttonContainer'>
                        <LoadingButton action={join}>הצטרף לטורניר</LoadingButton>
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
