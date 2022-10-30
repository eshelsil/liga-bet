import React, { useState } from 'react'
import {
    IconButton,
    TextField,
    Link,
} from '@mui/material'
import { UtlRole, UtlWithTournament } from '../types'
import { isTournamentStarted, UtlRoleToString } from '../utils'
import EditIcon from '@mui/icons-material/Edit'
import CloseIcon from '@mui/icons-material/Close'
import DoneIcon from '@mui/icons-material/Done'
import useGoTo from '../hooks/useGoTo'
import EmojiEventsOutlined from '@mui/icons-material/EmojiEventsOutlined'

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
    const { goToMyBets, goToInviteFriends } = useGoTo()
    const [edit, setEdit] = useState(false)
    const [name, setName] = useState(utl.name)

    const isTournamentAdmin = utl.role === UtlRole.Admin
    const canInviteFriends = isTournamentStarted && !isTournamentStarted(utl.tournament)
    const toggleEdit = () => setEdit(!edit)

    const update = () => {
        updateUTL({ name }).then(() => {
            setEdit(false)
            window['toastr']['success']('הפרופיל עודכן')
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
                {isTournamentAdmin && (
                    <div className={'utlAttribute'}>
                        <div className='attributeName'>קוד טורניר</div>
                        <div className='value'>
                            {utl.tournament.code}
                            {canInviteFriends && (<>
                                {'\t'}
                                <Link
                                    onClick={goToInviteFriends}
                                    style={{ cursor: 'pointer', marginRight: 24 }}
                                    >
                                    הזמן חברים לטורניר
                                </Link>
                            </>
                            )}
                        </div>
                    </div>
                )}
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
                </div>
                <div className='buttonsContinaer'>
                    {edit && (
                        <IconButton className="confirmButton" onClick={update}>
                            <DoneIcon />
                        </IconButton>
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
