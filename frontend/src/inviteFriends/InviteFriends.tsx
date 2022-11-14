import React from 'react'
import { useTournamentLink } from '../hooks/useTournamentLink'
import { useSelector } from 'react-redux'
import { CurrentTournament } from '../_selectors'
import CopyLink from '../widgets/CopyToClipboard/CopyLink';
import './InviteFriends.scss';


function InviteFriends() {
    const joinLink = useTournamentLink();
    const tournament = useSelector(CurrentTournament)

    return (
        <div className='LB-InviteFriends'>
            <h2 className='LB-TitleText'> הזמן חברים להשתתף בטורניר </h2>
            <div className='contentSection LB-FloatingFrame'>
                <div className='linkRow'>
                    <CopyLink 
                        label='לחץ כאן'
                        link={joinLink}
                    />
                    <div className='linkText'>{' '} כדי להעתיק את הקישור להזמנה ושלח אותו לחברים! </div>
                </div>
                <div className='codeRow'>
                    <div className='linkText'>
                        או שתספר לחברים שהם יכולים להצטרף לטורניר באמצעות הזנת קוד הטורניר: {' '}
                    </div>
                    <CopyLink 
                        label={tournament?.code}
                        link={tournament?.code}
                    />
                </div>
            </div>
        </div>
    )
}

export default InviteFriends
