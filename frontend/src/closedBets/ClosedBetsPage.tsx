import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import i18n from '@/i18n/config'
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
        get label() { return i18n.t('closedBets:tabs.games') },
        children: (
            <ClosedMatchBetsProvider />
        )
    },
    {
        id: ClosedBetsTab.Questions,
        get label() { return i18n.t('closedBets:tabs.questions') },
        children: (
            <ClosedQuestionBets />
        )
    },
    {
        id: ClosedBetsTab.Groups,
        get label() { return i18n.t('closedBets:tabs.groups') },
        children: (
            <GroupStandingsBets />
        )
    },
]

const ClosedBetsPage = () => {
    const { t } = useTranslation('closedBets')
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
            <h1 className='ClosedBetsPage-title LB-TitleText'>{t('title')}</h1>
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
