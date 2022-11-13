import React from 'react'
import PersonIcon from '@mui/icons-material/PersonOutlineRounded'
import EmojiEventsOutlined from '@mui/icons-material/EmojiEventsOutlined'
import { TournamentDisplayProps } from './types'
import './TournamentDisplay.scss'



function TournamentDisplay({tournament, index}: TournamentDisplayProps){
    return (
        <div className={`LB-TournamentDisplay tournament-theme tournament-theme-${index + 1}`}>
            <div className='TournamentDisplay-header'>
                <EmojiEventsOutlined className={'tournamentIcon'}/>
                <div className='TournamentDisplay-name'>{tournament.name}</div>
            </div>
            <div className='TournamentDisplay-content'>
                <PersonIcon className={'personIcon'}/>
                <div className='TournamentDisplay-utlName'>
                    {tournament.linkedUtl.name}
                </div>
            </div>
        </div>
    )
}

export default TournamentDisplay
