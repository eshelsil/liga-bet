import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { TextField } from '@mui/material'
import { MyTournamentCodes, NoSelector } from '../_selectors'
import { connect } from 'react-redux'
import { createUtl } from '../_actions/tournamentUser'
import useGoTo from '../hooks/useGoTo'
import { getTournamentsName } from '../api/tournaments'
import TournamentIcon from '@mui/icons-material/EmojiEvents';
import { reportApiError } from '../utils'
import { LoadingButton } from '../widgets/Buttons'
import { useSelector } from 'react-redux'


interface Props {
    onJoin: (...args: any) => Promise<void>
}

function JoinTournament({ onJoin }: Props) {
    const { tournamentId } = useParams<any>();
    const codeFromURL = tournamentId
    const myTournaments = useSelector(MyTournamentCodes)
    const [code, setCode] = useState(codeFromURL || '')
    const [name, setName] = useState('')
    const [tournamentName, setTournamentName] = useState('')
    const [isCodeFromUrlInvalid, setIsCodeFromUrlInvalid] = useState<boolean>()
    const { goToHome } = useGoTo();

    const alreadyJoined = myTournaments.includes(codeFromURL)

    async function join() {
        await onJoin({ tournamentCode: code, name })
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
    

    return (
        <div className='LB-JoinTournament'>
            {!alreadyJoined && (<>
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
