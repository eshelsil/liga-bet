import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Leaderboard from '../leaderboard/LeaderboardProvider';
import OpenMatchesView from '../open_matches/openMatchesProvider';
import OpenGroupRankBetsView from '../OpenGroupBets/OpenGroupRankBetsProvider';
import MatchesView from '../matches/ClosedMatchBetsProvider';
import GroupStandingsBetsView from '../groupBets/GroupStandingsBetsProvider';
import AllQuestionBetsView from '../questionBets/ClosedQuestionBetsProvider';
import MyBetsView from '../myBets/MyBetsView';
import Takanon from '../takanon/Takanon';
import OpenQuestionBets from '../openQuestionBets/OpenQuestionBetsProvider';
import RedirectToDefaultPage from './RedirectToDefaultPage';
import HisBetsView from '../myBets/HisBetsView';


function AppBasicRoutes() {
    return (
        <Switch>
            <Route path='/open-questions' component={OpenQuestionBets} />
            <Route path='/takanon' component={Takanon} />
            <Route path='/open-group-standings' component={OpenGroupRankBetsView} />
            <Route path='/open-matches' component={OpenMatchesView} />
            <Route path='/closed-matches' component={MatchesView} />
            <Route path='/leaderboard' component={Leaderboard} />
            <Route path='/all-group-standings' component={GroupStandingsBetsView} />
            <Route path='/all-questions' component={AllQuestionBetsView} />
            <Route path='/my-bets' component={MyBetsView} />
            <Route path='/his-bets/:utlId' component={HisBetsView} />
            <Route path='/'>
                <RedirectToDefaultPage />
            </Route>
        </Switch>
    )
}

export default AppBasicRoutes
