import React, { useState } from 'react'
import { GameWithBetsAndGoalsData } from '../types'
import SimpleTabs from '../widgets/Tabs/Tabs'
import ScorersTableView from './ScorersTableView'
import GameGumblersList from './GameGumblersList'


function GameDataView({ match, isLive }: { match: GameWithBetsAndGoalsData, isLive?: boolean, }) {
    const [selectedTab, setSelectedTab] = useState(0)

    return (
        <SimpleTabs
            tabs={[
                {
                    id: 'gumblers',
                    label: 'ניחושים',
                    children: (
                        <GameGumblersList match={match} isLive={isLive} />
                    )
                },
                {
                    id: 'scorers',
                    label: 'מבקיעים',
                    children: (
                        <ScorersTableView match={match} />
                    )
                },
            ]}
            index={selectedTab}
            onChange={setSelectedTab}
        
        />
    )
}

export default GameDataView
