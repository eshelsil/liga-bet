import React from 'react'
import { IconButton, Switch } from '@mui/material'
import PinnedIcon from '@mui/icons-material/PushPin'
import UnPinnedIcon from '@mui/icons-material/PushPinOutlined'
import InfoIcon from '@mui/icons-material/InfoOutlined'
import './MultiBetsSettings.scss'


interface Props {
    forAllTournaments: boolean
    setForAllTournaments: (value: boolean) => void
    pinned: boolean
    togglePinned: () => void
    onInfoClick: () => void
}

function MultiBetsSettingsView({
    forAllTournaments,
    setForAllTournaments,
    pinned,
    togglePinned,
    onInfoClick,
}: Props) {
    const pinClass = pinned ? 'MultiBetsSettings-pinned' : ''


    return (
        <div className={`LB-MultiBetsSettings ${pinClass}`}>
            <div className='MultiBetsSettings-content'>
                <div className='MultiBetsSettings-header'>
                    <IconButton className='MultiBetsSettings-pinIcon' onClick={togglePinned}>
                        {pinned ? <PinnedIcon /> : <UnPinnedIcon />}
                    </IconButton>
                    <p>ערוך לכל הטורנירים שלי</p>
                </div>
                <div className='MultiBetsSettings-isMultiBet'>
                    <InfoIcon
                        color='primary'
                        onClick={onInfoClick}
                    />
                    <Switch
                        color='secondary'
                        className='forAllTournamentsInput'
                        checked={forAllTournaments}
                        onChange={(e, value) => setForAllTournaments(value)}
                    />
                </div>
            </div>
        </div>
    )
}

export default MultiBetsSettingsView
