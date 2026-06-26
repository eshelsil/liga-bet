import React from 'react'
import { useTranslation } from 'react-i18next'
import { useTournamentLink } from '../hooks/useTournamentLink'
import { useSelector } from 'react-redux'
import { CurrentTournament } from '../_selectors'
import CopyLink from '../widgets/CopyToClipboard/CopyLink';
import './InviteFriends.scss';


function InviteFriends() {
    const { t } = useTranslation('inviteFriends')
    const joinLink = useTournamentLink();
    const tournament = useSelector(CurrentTournament)

    return (
        <div className='LB-InviteFriends'>
            <h2 className='LB-TitleText'> {t('title')} </h2>
            <div className='contentSection LB-FloatingFrame'>
                <div className='linkRow'>
                    <CopyLink
                        label={t('copyLinkLabel')}
                        link={joinLink}
                    />
                    <div className='linkText'>{' '} {t('copyLinkText')} </div>
                </div>
                <div className='codeRow'>
                    <div className='linkText'>
                        {t('codeText')} {' '}
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
