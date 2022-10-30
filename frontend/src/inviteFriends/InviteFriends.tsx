import React from 'react'
import { useTournamentLink } from '../hooks/useTournamentLink'
import { useSelector } from 'react-redux'
import { CurrentTournament } from '../_selectors'
import { Link } from '@mui/material';
import CopyToClipboard from '../widgets/CopyToClipboard/CopyToClipBoard';
import './InviteFriends.scss';


function InviteFriends() {
    const joinLink = useTournamentLink();
    const tournament = useSelector(CurrentTournament)

    const copyLink = () => {
        navigator.clipboard.writeText(joinLink)
    }

    return (
        <div className='LB-InviteFriends'>
            <h2> הזמן חברים להשתתף בטורניר </h2>
            <div className='contentSection'>
                <div className='linkRow'>
                    <CopyToClipboard renderChildren={
                        ({copy}) => (
                            <Link
                                className='copyLink'
                                onClick={ () => copy(joinLink) }
                            >
                                לחץ כאן
                            </Link>
                        )
                    } />
                    <div className='linkText'>{' '} כדי להעתיק את הקישור להזמנה ושלח אותו לחברים! </div>
                </div>
                <div className='codeRow'>
                    <div className='linkText'>
                        או שתספר לחברים שהם יכולים להצטרף לטורניר באמצעות הזנת קוד הטורניר: {' '}
                    </div>
                    <CopyToClipboard renderChildren={
                        ({copy}) => (
                            <Link
                                className='copyLink'
                                onClick={ () => copy(tournament?.code) }
                            >
                                {tournament?.code}
                            </Link>
                        )
                    } />
                </div>
            </div>
        </div>
    )
}

export default InviteFriends
