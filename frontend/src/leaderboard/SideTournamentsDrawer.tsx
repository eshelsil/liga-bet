import React, { useState } from 'react'
import { Collapse } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import BackToLiveIcon from '@mui/icons-material/SettingsBackupRestore';
import { SideTournament } from '../types';


interface Props {
    sideTournaments: SideTournament[]
    selectSideTournament: (id: number) => void
    selectedSideTournamentId?: number
}

function SideTournamentsDrawer({ sideTournaments, selectedSideTournamentId, selectSideTournament }: Props) {
    const [expanded, setExpanded] = useState(false)
    const isMainTournamentShown = !selectedSideTournamentId

    const onSelectSideTournament = (id: number) => {
        setExpanded(false)
        selectSideTournament(id)
    }
    
    return (
        <div className={`LB-SideTournamentsDrawer`}>
            {isMainTournamentShown && (<>
                <div className={`SideTournamentsDrawer-expandButton ${expanded ? 'expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
                    <KeyboardArrowRightIcon viewBox='4 4 15 15' />
                </div>
                <Collapse in={expanded} orientation='horizontal'>
                    <div className='SideTournamentsDrawer-list'>
                        {sideTournaments.map(st => (
                            <img key={st.id} className='SideTournamentsDrawer-sideTournament' src={st.emblem} onClick={() => onSelectSideTournament(st.id)} />
                        ))}
                    </div>
                </Collapse>
            </>)}
            {!isMainTournamentShown && (
                <BackToLiveIcon className='SideTournamentsDrawer-backToMain' onClick={() => selectSideTournament(null)}/>
            )}
            
        </div>
    )
}

export default SideTournamentsDrawer
