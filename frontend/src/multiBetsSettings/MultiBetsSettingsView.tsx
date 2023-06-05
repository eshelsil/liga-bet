import React from 'react'
import { Switch } from '@mui/material'
import InfoIcon from '@mui/icons-material/InfoOutlined'
import StickyConfigView from '../widgets/stickyConfig/StickyConfigView'
import './MultiBetsSettings.scss'


interface Props {
    forAllTournaments: boolean
    setForAllTournaments: (value: boolean) => void
    pinned: boolean
    setPinned: (val: boolean) => void
    onInfoClick?: () => void
}

function MultiBetsSettingsView({
    forAllTournaments,
    setForAllTournaments,
    pinned,
    setPinned,
    onInfoClick,
}: Props) {

    return (
        <StickyConfigView
            pinned={pinned}
            setPinned={setPinned}
            className='LB-MultiBetsSettings'
            header={
                <div className='MultiBetsSettings-content'>
                    <p>ערוך לכל הטורנירים שלי</p>
                    <div className='MultiBetsSettings-isMultiBet'>
                        <InfoIcon
                            className={`MultiBetsSettings-infoIcon ${!!onInfoClick ? 'infoIconClickable' : ''}`}
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
            }
        />
    )
}

export default MultiBetsSettingsView
