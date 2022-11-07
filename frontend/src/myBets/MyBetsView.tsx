import React from 'react'
import SpecialBetsTable from './SpecialBetsTable'
import MatchesBetsTable from './MatchesBetsTable'
import GroupPositionBetsTable from './GroupPositionBetsTable'
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
            <h1>הטופס שלי</h1>
            <SpecialBetsTable bets={questionBets} />
            <MatchesBetsTable bets={matchBets} />
            <GroupPositionBetsTable bets={groupRankBets} />
        </div>
    )
}

export default MyBetsView
