import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Redirect } from 'react-router';
import Leaderboard from '../leaderboard/LeaderboardProvider';
import OpenMatchesView from '../open_matches/openMatchesProvider';
import OpenGroupRankBetsView from '../preTournamentBets/OpenGroupRankBetsProvider';
import MatchesView from '../matches/ClosedMatchBetsProvider';
import GroupStandingsBetsView from '../groupBets/GroupStandingsBetsProvider';
import AllQuestionBetsView from '../questionBets/ClosedQuestionBetsProvider';
import MyBetsView from '../myBets/MyBetsView';
import Takanon from '../takanon/Takanon';
import TournamentUserController from '../tournamentUser/TournamentUserController';
import InitialDataFetcher from '../initialDataFetcher/InitialDataFetcher';
import ManageContestantsProvider from '../manageContestants/ManageContestantsProvider';


function AppContent(){
	// if (!user.isConfirmed){
	// 	return <h2>האתר יהיה זמין לך ברגע שתאושר על ידי אחד מהאדמינים</h2>
	// }
    // TODO: Handle unconfirmed user
	return (
        <TournamentUserController>
            <InitialDataFetcher>
                <Switch>
                    <Route path='/open-questions' component={OpenGroupRankBetsView} />
                    {/* ABOVE TBD ^--------^*/}
                    <Route path='/contestants' component={ManageContestantsProvider} />
                    <Route path='/takanon' component={Takanon} />
                    <Route path='/open-group-standings' component={OpenGroupRankBetsView} />
                    <Route path='/open-matches' component={OpenMatchesView} />
                    <Route path='/closed-matches' component={MatchesView} />
                    <Route path='/leaderboard' component={Leaderboard} />
                    <Route path='/all-group-standings' component={GroupStandingsBetsView} />
                    <Route path='/all-questions' component={AllQuestionBetsView} />
                    <Route path='/my-bets' component={MyBetsView} />
                    <Route path='/'>
                        {/* <Route path='/closed-matches' component={MatchesView} /> */}
                        <Redirect to='/leaderboard'/>
                    </Route>
                </Switch>
            </InitialDataFetcher>
        </TournamentUserController>
	);
}

export default AppContent