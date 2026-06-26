import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Leaderboard from '../leaderboard/LeaderboardProvider'
import OpenMatchesView from '../open_matches/openMatchesProvider'
import OpenGroupRankBetsView from '../OpenGroupBets/OpenGroupRankBetsProvider'
import MyBetsView from '../myBets/MyBetsView'
import ManageNihusim from '@/nihusim/ManageNihusim'
import Takanon from '../takanon/Takanon'
import OpenQuestionBets from '../openQuestionBets/OpenQuestionBetsProvider'
import RedirectToDefaultPage from './RedirectToDefaultPage'
import HisBetsView from '../myBets/HisBetsView'
import ClosedBetsPage from '../closedBets/ClosedBetsPage'
import BracketProvider from '../bracket/BracketProvider'
import { IsCurrentTournamentKnockoutBracket } from '../_selectors'

// The /open-matches slot is the betting view for both types: classic shows the
// match-prediction list; knockout shows the bracket ("Open Guesses").
function OpenMatchesRoute() {
    const isKnockoutBracket = useSelector(IsCurrentTournamentKnockoutBracket)
    return isKnockoutBracket ? <BracketProvider /> : <OpenMatchesView />
}

// Classic-only betting views — redirect away for knockout_bracket.
function ClassicOnlyRoute({ children }: { children: React.ReactNode }) {
    const isKnockoutBracket = useSelector(IsCurrentTournamentKnockoutBracket)
    return isKnockoutBracket ? <RedirectToDefaultPage /> : <>{children}</>
}

function AppBasicRoutes() {
    return (
        <Switch>
            {/* legacy direct link — the bracket now lives under /open-matches for knockout */}
            <Route path="/bracket">
                <Redirect to="/open-matches" />
            </Route>
            <Route path="/open-questions">
                <ClassicOnlyRoute>
                    <OpenQuestionBets />
                </ClassicOnlyRoute>
            </Route>
            <Route path="/takanon" component={Takanon} />
            <Route path="/open-group-standings">
                <ClassicOnlyRoute>
                    <OpenGroupRankBetsView />
                </ClassicOnlyRoute>
            </Route>
            <Route path="/open-matches" component={OpenMatchesRoute} />
            <Route path="/leaderboard" component={Leaderboard} />
            <Route path="/closed-bets/:tab?">
                <ClassicOnlyRoute>
                    <ClosedBetsPage />
                </ClassicOnlyRoute>
            </Route>
            <Route path="/my-bets" component={MyBetsView} />
            <Route path="/nihusim" component={ManageNihusim} />
            <Route path="/his-bets/:utlId" component={HisBetsView} />
            <Route path="/">
                <RedirectToDefaultPage />
            </Route>
        </Switch>
    )
}

export default AppBasicRoutes
