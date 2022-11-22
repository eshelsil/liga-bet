import React from 'react'
import { GameBetsFetchType } from '../types'
import { useGameBets } from '../hooks/useFetcher';
import { FormControlLabel, Switch } from '@mui/material';


interface Props {
    liveGameIds: number[]
    liveMode: boolean
    toggleLiveMode: () => void
}

function LiveModeFrom({ liveGameIds, liveMode, toggleLiveMode }: Props) {
    useGameBets({type: GameBetsFetchType.Games, ids: liveGameIds})

    return (
        <div className='LeaderboardView-isLiveForm'>
            <FormControlLabel
                control={
                    <Switch
                        color="primary"
                        checked={liveMode}
                        onClick={toggleLiveMode}
                    />
                }
                label={'מצב חי (live)'}
            />
        </div>
    )
}

export default LiveModeFrom
