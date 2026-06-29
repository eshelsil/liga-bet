import React, { useState } from 'react'
import { GameWithBetsAndGoalsData } from '../types'
import SimpleTabs from '../widgets/Tabs/Tabs'
import ScorersTableView from './ScorersTableView'
import GameGumblersList from './GameGumblersList'
import { useSelector } from 'react-redux'
import {
    CanSendNihus,
    IsCurrentTournamentKnockoutBracket,
    IsOnNihusim,
} from '@/_selectors'
import { useTranslation } from 'react-i18next'

function GameDataView({
    match,
    isLive,
}: {
    match: GameWithBetsAndGoalsData
    isLive?: boolean
}) {
    const { t } = useTranslation('matches')
    const [selectedTab, setSelectedTab] = useState(0)
    const isBracketTournament = useSelector(IsCurrentTournamentKnockoutBracket)
    const canSendNihus = useSelector(CanSendNihus)
    const isOnNihusim = useSelector(IsOnNihusim)
    const canShowNihusable = canSendNihus && isOnNihusim

    return (
        <>
            {isBracketTournament ? (
                <GameGumblersList
                    match={match}
                    isLive={isLive}
                    showNihusable={canShowNihusable}
                />
            ) : (
                <SimpleTabs
                    tabs={[
                        {
                            id: 'gumblers',
                            label: t('tabs.predictions'),
                            children: (
                                <GameGumblersList
                                    match={match}
                                    isLive={isLive}
                                    showNihusable={canShowNihusable}
                                />
                            ),
                        },
                        {
                            id: 'scorers',
                            label: t('tabs.scorers'),
                            children: <ScorersTableView match={match} />,
                        },
                    ]}
                    index={selectedTab}
                    onChange={setSelectedTab}
                />
            )}
        </>
    )
}

export default GameDataView
