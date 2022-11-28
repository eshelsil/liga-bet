import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import GroupStandingsBets from '../groupBets/GroupStandingsBetsProvider'
import useGoTo from '../hooks/useGoTo'
import ClosedMatchBetsProvider from '../matches/ClosedMatchBetsProvider'
import ClosedQuestionBets from '../questionBets/ClosedQuestionBetsProvider'
import SimpleTabs from '../widgets/Tabs/Tabs'
import { ClosedBetsTab } from './types'
import { map } from 'lodash'
import './ClosedBetsPage.scss'


const tabViews = [
    {
        id: ClosedBetsTab.Games,
        label: 'משחקים',
        children: (
            <ClosedMatchBetsProvider />
        )
    },
    {
        id: ClosedBetsTab.Questions,
        label: 'ניחושים מיוחדים',
        children: (
            <ClosedQuestionBets />
        )
    },
    {
        id: ClosedBetsTab.Groups,
        label: 'דירוגי בתים',
        children: (
            <GroupStandingsBets />
        )
    },
]

const ClosedBetsPage = () => {
    const { goToClosedGameBets, goToClosedBets } = useGoTo()
    const { tab } = useParams<{tab: ClosedBetsTab}>();
    const tabs = map(tabViews, 'id')
    const selectedTabIndex = tabs.indexOf(tab);

    const hasSelectedTab = selectedTabIndex > -1

    const onTabChange = (index: number) => {
        goToClosedBets(tabs[index])
    }

    useEffect(()=> {
        if (!hasSelectedTab){
            goToClosedGameBets()
        }
    }, [hasSelectedTab])

    return (
        <div className='LB-ClosedBetsPage'>
            <h1 className='ClosedBetsPage-title LB-TitleText'>צפייה בניחושים</h1>
            <div className='ClosedBetsPage-tabsWrapper'>
                <SimpleTabs
                    tabs={tabViews}
                    index={hasSelectedTab ? selectedTabIndex : undefined}
                    onChange={onTabChange}
                    tabsProps={{
                        classes: {
                            root: 'ClosedBetsPage-tabs',
                        }
                    }}
                />
            </div>
        </div>
    )
}

export default ClosedBetsPage
