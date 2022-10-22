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
        <div>
            <div>
                <h6>קוד טורניר</h6>
                <TextField
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />
            </div>
            <h6>כינוי</h6>
            <TextField value={name} onChange={(e) => setName(e.target.value)} />
            <div></div>
            <Button onClick={join}>הצטרף לטורניר</Button>
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
