import React, { useState } from 'react'
import { Button, TextField } from '@mui/material'
import { NoSelector } from '../_selectors'
import { connect } from 'react-redux'
import { createUtl } from '../_actions/tournamentUser'
import useGoTo from '../hooks/useGoTo'

interface Props {
    onJoin: (...args: any) => Promise<void>
}

function JoinTournament({ onJoin }: Props) {
    const [code, setCode] = useState('')
    const [name, setName] = useState('')
    const { goToHome } = useGoTo();

    function join() {
        onJoin({ tournamentCode: code, name })
        .then(() => {
            window['toastr']['success']('נרשמת לטורניר בהצלחה')
            goToHome()
        })
    }

    return (
        <div className='LB-JoinTournament'>
            <h1>הצטרף לטורניר קיים</h1>
            <div className='joinTournamentForm'>
                <TextField
                    value={code}
                    label='קוד טורניר'
                    onChange={(e) => setCode(e.target.value)}
                />
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
