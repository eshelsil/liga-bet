import React, { useState } from 'react'
import { GameWithBetsAndGoalsData } from '../types'
import SimpleTabs from '../widgets/Tabs/Tabs'
import ScorersTableView from './ScorersTableView'
import GameGumblersList from './GameGumblersList'
import { useSelector } from 'react-redux'
import { CanSendNihus, IsOnNihusim } from '@/_selectors'


function GameDataView({ match, isLive }: { match: GameWithBetsAndGoalsData, isLive?: boolean, }) {
    const [selectedTab, setSelectedTab] = useState(0)
    const canSendNihus = useSelector(CanSendNihus)
    const isOnNihusim = useSelector(IsOnNihusim)
    const canShowNihusable = canSendNihus && isOnNihusim

    return (
        <SimpleTabs
            tabs={[
                {
                    id: 'gumblers',
                    label: 'ניחושים',
                    children: (
                        <GameGumblersList match={match} isLive={isLive} showNihusable={canShowNihusable} />
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
