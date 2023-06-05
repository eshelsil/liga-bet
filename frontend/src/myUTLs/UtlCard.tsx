import React, { useState } from 'react'
import {
    IconButton,
    TextField,
    Link,
} from '@mui/material'
import { UtlWithTournament } from '../types'
import { hasManagePermissions, isTournamentStarted, UtlRoleToString } from '../utils'
import EditIcon from '@mui/icons-material/Edit'
import CloseIcon from '@mui/icons-material/Close'
import useGoTo from '../hooks/useGoTo'
import EmojiEventsOutlined from '@mui/icons-material/EmojiEventsOutlined'
import { useTournamentLink } from '../hooks/useTournamentLink'
import CopyLink from '../widgets/CopyToClipboard/CopyLink'
import useCancelEdit from '../hooks/useCancelEdit'
import LoadingVIcon from '../widgets/LoadingVIcon'
import { useLeaderboard } from '../hooks/useFetcher'

interface Props {
    utl: UtlWithTournament
    utlIndex: number
    isSelected: boolean
    updateUTL: (params: { name: string }) => Promise<void>
    selectUtl: () => void
    socreboardRow?: {
        rank: number
        score: number
    }
}

function UtlCard({ utl, utlIndex, isSelected,  updateUTL, selectUtl, socreboardRow }: Props) {
    useLeaderboard(utl.tournament.id)
    const { goToMyBets, goToTakanon } = useGoTo()
    const joinLink = useTournamentLink(utl.tournament.code);
    const [edit, setEdit] = useState(false)
    const [name, setName] = useState(utl.name)
    const { getLastEditTs, cancelEdit } = useCancelEdit({edit, setEdit})

    const canInviteFriends = hasManagePermissions(utl) && !isTournamentStarted(utl.tournament)
    const toggleEdit = () => setEdit(!edit)

    const update = async () => {
        const ts = getLastEditTs()
        await updateUTL({ name })
            .then(() => {
                window['toastr']['success']('הפרופיל עודכן')
                cancelEdit(ts)
            })
            .catch(function (error) {
                console.log('FAILED updating UTL', error)
            })
    }

    const updateName = (e) => setName(e.target.value)

    return (
        <div className="LB-UtlCard">
            <div className={`cardHeader tournament-theme-${utlIndex + 1}`}
                onClick={selectUtl}
            >
                <EmojiEventsOutlined style={{color: '#fff'}} />
                <h4 className="tournamentName">{utl.tournament.name}</h4>
                {isSelected && (
                    <div className='selectedUtl' />
                )}
            </div>
            <div className='cardBody'>
                <div className={'utlAttribute'}>
                    <div className='attributeName'>כינוי</div>
                    <div className='value'>
                            {edit && (
                                <div className="nameInput">
                                    <TextField
                                        value={name}
                                        onChange={updateName}
                                        label="שם"
                                    />
                                </div>
                            )}
                            {!edit && utl.name}
                    </div>
                </div>
                <div className={'utlAttribute'}>
                    <div className='attributeName'>הרשאות</div>
                    <div className='value'>
                        {UtlRoleToString[utl.role]}
                    </div>
                </div>
                <div className={'utlAttribute'}>
                    <div className='attributeName'>קוד טורניר</div>
                    <div className='value'>
                        <div>
                            {utl.tournament.code}
                        </div>
                        {canInviteFriends && (
                            <div style={{ cursor: 'pointer', marginRight: 24 }}>
                            <CopyLink
                                label='הזמן חברים'
                                link={joinLink}
                                title={'קישור הועתק ✓'}
                            />
                            </div>
                        )}
                    </div>
                </div>
                {socreboardRow && (
                    <>
                        <div className={'utlAttribute'}>
                            <div className='attributeName'>מיקום בטבלה</div>
                            <div className='value'>
                                {socreboardRow.rank}
                            </div>
                        </div>
                        <div className={'utlAttribute'}>
                            <div className='attributeName'>נקודות</div>
                            <div className='value'>
                                {socreboardRow.score}
                            </div>
                        </div>
                    </>
                )}
                <div className='linksContainer'>
                    <Link
                        onClick={() => {
                            selectUtl()
                            goToMyBets()
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        צפייה בטופס שלי
                    </Link>
                    <Link
                        className='takanonLink'
                        onClick={() => {
                            selectUtl()
                            goToTakanon()
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        תקנון
                    </Link>
                </div>
                <div className='buttonsContinaer'>
                    {edit && (
                        <LoadingVIcon action={update} />
                    )}
                    <IconButton className="editButton" onClick={toggleEdit}>
                        {!edit && <EditIcon />}
                        {edit && <CloseIcon />}
                    </IconButton>
                </div>

            </div>
            
        </div>
    )
}

export default UtlCard
