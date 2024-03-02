import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Leaderboard from '../leaderboard/LeaderboardProvider';
import OpenMatchesView from '../open_matches/openMatchesProvider';
import OpenGroupRankBetsView from '../OpenGroupBets/OpenGroupRankBetsProvider';
import MyBetsView from '../myBets/MyBetsView';
import ManageNihusim from '@/nihusim/ManageNihusim';
import Takanon from '../takanon/Takanon';
import OpenQuestionBets from '../openQuestionBets/OpenQuestionBetsProvider';
import RedirectToDefaultPage from './RedirectToDefaultPage';
import HisBetsView from '../myBets/HisBetsView';
import ClosedBetsPage from '../closedBets/ClosedBetsPage';


function AppBasicRoutes() {
    return (
        <Switch>
            <Route path='/open-questions' component={OpenQuestionBets} />
            <Route path='/takanon' component={Takanon} />
            <Route path='/open-group-standings' component={OpenGroupRankBetsView} />
            <Route path='/open-matches' component={OpenMatchesView} />
            <Route path='/leaderboard' component={Leaderboard} />
            <Route path='/closed-bets/:tab?' component={ClosedBetsPage} />
            <Route path='/my-bets' component={MyBetsView} />
            <Route path='/nihusim' component={ManageNihusim} />
            <Route path='/his-bets/:utlId' component={HisBetsView} />
            <Route path='/'>
                <RedirectToDefaultPage />
            </Route>
        </Switch>
    )
}

export default AppBasicRoutes
