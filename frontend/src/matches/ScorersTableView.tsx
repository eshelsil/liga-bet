import React from 'react'
import { GameGoalsDataWithPlayer, MatchWithGoalsData } from '../types'
import PlayerWithImg from '../widgets/Player'
import CustomTable from '../widgets/Table/CustomTable';


function ScorersTableView({ match }: { match: MatchWithGoalsData }) {
    
    const models = match.scorers

    const cells = [
        {
            id: 'player',
            header: 'שחקן',
            getter: (model: GameGoalsDataWithPlayer) => (
                <PlayerWithImg player={model.player} size={36} />
            ),
        },
        {
            id: 'goals',
            header: <img className='goalsScoredIcon' src="https://cdn-icons-png.flaticon.com/512/1165/1165187.png" />,
            classes: {
                header: 'centerContent',
                cell: 'centerContent',
            },
            getter: (model: GameGoalsDataWithPlayer) => model.goals,
        },
        {
            id: 'assists',
            header: <img className='goalsAssistedIcon' src="https://cdn-icons-png.flaticon.com/512/5107/5107693.png" />,
            classes: {
                header: 'assistsHeader centerContent',
                cell: 'centerContent',
            },
            getter: (model: GameGoalsDataWithPlayer) => model.assists,
        },
    ]

    return (
        <div className='LB-ScorersTableView'>
            <CustomTable models={models} cells={cells}/>
        </div>
    )
}

export default ScorersTableView
