import React, { useState } from 'react'
import { Collapse } from '@mui/material'
import ArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { GameGoalsDataWithPlayer, MatchWithGoalsData } from '../../../types'
import PlayerWithImg from '../../../widgets/Player'
import GameHeader from '../../../matches/GameHeader';
import CustomTable from '../../../widgets/Table/CustomTable';


function GameScorersList({ match }: { match: MatchWithGoalsData }) {
    const [expand, setExpand] = useState(false)
    const toggleExpand = () => setExpand(!expand)

    const models = match.scorers

    const cells = [
        {
            id: 'admin',
            classes: {
                header: 'admin',
                cell: 'admin',
            },
            header: '',
            getter: (model: GameGoalsDataWithPlayer) => model.id,
        },
        {
            id: 'playerId',
            header: 'playerId',
            getter: (model: GameGoalsDataWithPlayer) => model.playerId,
        },
        {
            id: 'player',
            classes: {
            },
            header: 'player',
            getter: (model: GameGoalsDataWithPlayer) => (
                <PlayerWithImg player={model.player} size={36} />
            ),
        },
        {
            id: 'goals',
            header: 'goals',
            getter: (model: GameGoalsDataWithPlayer) => model.goals,
        },
        {
            id: 'assists',
            header: 'assists',
            getter: (model: GameGoalsDataWithPlayer) => model.assists,
        },
    ]

    return (
        <div className={`LB-GameGumblersList ${expand ? 'GameGumblersList-expanded' : ''}`}>
            <GameHeader match={match} onClick={toggleExpand} />
            <Collapse in={expand}>
                <div className='LB-GumblersTable'>
                    <CustomTable models={models} cells={cells}/>
                </div>
            </Collapse>
            <div className='GameGumblersList-expandIconContainer' onClick={toggleExpand}>
                <ArrowDownIcon className={`arrowDownIcon`} />
            </div>
        </div>
    )
}

export default GameScorersList
