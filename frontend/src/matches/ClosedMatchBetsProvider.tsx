import React from 'react'
import MatchesView from './MatchesView'
import { connect } from 'react-redux'
import { ClosedMatchBetsSelector, MatchWithBets } from '../_selectors'
import { useGameBets } from '../hooks/useFetcher'
import { map } from 'lodash'
import { GameBetsFetchType } from '../types'

interface Props {
    done_matches: MatchWithBets[]
    live_matches: MatchWithBets[]
}

const ClosedMatchBets = ({
    done_matches,
    live_matches,
}: Props) => {
    const allGamesIds = map([ ...done_matches, ...live_matches ], 'id');
    useGameBets({type: GameBetsFetchType.Games, ids: allGamesIds})

    return (
        <MatchesView done_matches={done_matches} live_matches={live_matches} />
    )
}

export default connect(
    ClosedMatchBetsSelector,
)(ClosedMatchBets)
