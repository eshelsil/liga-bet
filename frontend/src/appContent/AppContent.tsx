import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Redirect } from 'react-router';
import Leaderboard from '../leaderboard/LeaderboardProvider';
import OpenMatchesView from '../open_matches/openMatchesProvider';
import OpenGroupRankBetsView from '../OpenGroupBets/OpenGroupRankBetsProvider';
import MatchesView from '../matches/ClosedMatchBetsProvider';
import GroupStandingsBetsView from '../groupBets/GroupStandingsBetsProvider';
import AllQuestionBetsView from '../questionBets/ClosedQuestionBetsProvider';
import MyBetsView from '../myBets/MyBetsView';
import Takanon from '../takanon/Takanon';
import TournamentUserController from '../tournamentUser/TournamentUserController';
import InitialDataFetcher from '../initialDataFetcher/InitialDataFetcher';
import ManageContestantsProvider from '../manageContestants/ManageContestantsProvider';
import OpenQuestionBets from '../openQuestionBets/OpenQuestionBetsProvider';
import TournamentConfig from '../tournamentConfig';

function AppContent() {
    return (
        <TournamentUserController>
            <InitialDataFetcher>
                <Switch>
                    <Route path='/open-questions' component={OpenQuestionBets} />
                    <Route path='/contestants' component={ManageContestantsProvider} />
                    <Route path='/takanon' component={Takanon} />
                    <Route path='/tournament-config' component={TournamentConfig} />
                    <Route path='/open-group-standings' component={OpenGroupRankBetsView} />
                    <Route path='/open-matches' component={OpenMatchesView} />
                    <Route path='/closed-matches' component={MatchesView} />
                    <Route path='/leaderboard' component={Leaderboard} />
                    <Route path='/all-group-standings' component={GroupStandingsBetsView} />
                    <Route path='/all-questions' component={AllQuestionBetsView} />
                    <Route path='/my-bets' component={MyBetsView} />
                    <Route path='/'>
                        <Redirect to='/tournament-config'/>
                    </Route>
                </Switch>
            </InitialDataFetcher>
        </TournamentUserController>
    )
}

export default AppContent
