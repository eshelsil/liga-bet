import React, { useState } from 'react'
import { GameWithBetsAndGoalsData, } from '../types'
import GameHeader from './GameHeader'
import { Collapse } from '@mui/material'
import ArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import GameDataView from './GameDataView'


function GameView({ match, withExpand, isLive }: { match: GameWithBetsAndGoalsData, withExpand?: boolean, isLive?: boolean, }) {
    const [expand, setExpand] = useState(false)
    const toggleExpand = () => setExpand(!expand)

    return (
        <div className={`LB-GameView ${expand ? 'GameView-expanded' : ''}`}>
            <GameHeader match={match} onClick={withExpand ? toggleExpand : null} />
            {withExpand && (<>
                <Collapse in={expand}>
                    <GameDataView match={match} isLive={isLive} />
                </Collapse>
                <div className='GameView-expandIconContainer' onClick={toggleExpand}>
                    <ArrowDownIcon className={`arrowDownIcon`} />
                </div>
            </>)}
            {!withExpand && (
                <GameDataView match={match} isLive={isLive} />
            )}
        </div>
    )
}

export default GameView
