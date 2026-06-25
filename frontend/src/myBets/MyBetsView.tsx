import React from 'react'
import { useTranslation } from 'react-i18next'
import MySpecialBetsTable from './MySpecialBetsTable'
import MyGameBetsTable from './MyGameBetsTable'
import GroupPositionBetsTable from './MyGroupPositionBetsTable'
import { IsCurrentTournamentKnockoutBracket, MyBetsSelector } from '../_selectors'
import { useSelector } from 'react-redux'
import { useMyGameBets } from '../hooks/useFetcher'
import './MyBetsView.scss'


const MyBetsView = () => {
    const { t } = useTranslation('myBets')
    const { matchBets, groupRankBets, questionBets } =
        useSelector(MyBetsSelector)
    useMyGameBets();
    const isKnockoutBracket = useSelector(IsCurrentTournamentKnockoutBracket)

    return (
        <div className="LB-MyBetsView">
            <h1 className='LB-TitleText'>{t('titles.myForm')}</h1>
            <MySpecialBetsTable bets={questionBets} />
            <MyGameBetsTable bets={isKnockoutBracket ? [] : matchBets} /> {/* temp: hide game bets for knockout bracket */}
            {isKnockoutBracket ? null : (
                <GroupPositionBetsTable bets={groupRankBets} />
            )}
        </div>
    )
}

export default MyBetsView
