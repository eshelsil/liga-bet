import React from 'react'
import MySpecialBetsTable from './MySpecialBetsTable'
import MyGameBetsTable from './MyGameBetsTable'
import GroupPositionBetsTable from './MyGroupPositionBetsTable'
import { MyBetsSelector } from '../_selectors'
import { useSelector } from 'react-redux'
import { useMyGameBets } from '../hooks/useFetcher'
import './MyBetsView.scss'


const MyBetsView = () => {
    const { matchBets, groupRankBets, questionBets } =
        useSelector(MyBetsSelector)
    useMyGameBets();


    return (
        <div className="LB-MyBetsView">
            <h1 className='LB-TitleText'>הטופס שלי</h1>
            <MySpecialBetsTable bets={questionBets} />
            <MyGameBetsTable bets={matchBets} />
            <GroupPositionBetsTable bets={groupRankBets} />
        </div>
    )
}

export default MyBetsView
