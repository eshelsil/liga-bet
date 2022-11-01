import React, { useEffect, useState } from 'react'
import { Button, TextField } from '@mui/material'
import { NoSelector } from '../_selectors'
import { connect } from 'react-redux'
import { createUtl } from '../_actions/tournamentUser'
import useGoTo from '../hooks/useGoTo'
import { getTournamentsName } from '../api/tournaments'
import { useLocation } from 'react-router-dom'
import TournamentIcon from '@mui/icons-material/EmojiEvents';
import { reportApiError } from '../utils'


interface Props {
    onJoin: (...args: any) => Promise<void>
}

function JoinTournament({ onJoin }: Props) {
    const location = useLocation();
    const params = new URLSearchParams(location.search)
    const codeFromURL = params.get('tournament-code') 
    const [code, setCode] = useState(codeFromURL || '')
    const [name, setName] = useState('')
    const [tournamentName, setTournamentName] = useState('')
    const [isCodeFromUrlInvalid, setIsCodeFromUrlInvalid] = useState<boolean>()
    const { goToHome } = useGoTo();

    getTournamentsName
    function join() {
        onJoin({ tournamentCode: code, name })
        .then(() => {
            window['toastr']['success']('נרשמת לטורניר בהצלחה')
            goToHome()
        })
    }

    const isCodeAutoSet = !!codeFromURL && !isCodeFromUrlInvalid

    useEffect(() => {
        if (codeFromURL) {
            getTournamentsName(codeFromURL)
                .then(name => {
                    setTournamentName(name)
                })
                .catch(error => {
                    reportApiError(error)
                    setIsCodeFromUrlInvalid(true)
                })
        }
    }, [codeFromURL])

    return (
        <div className='LB-JoinTournament'>
            <h1>הצטרף לטורניר קיים</h1>
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
                <div className='buttonContainer'>
                    <Button variant='contained' color='primary' onClick={join}>הצטרף לטורניר</Button>
                </div>
            </div>
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
