import React from 'react'
import { WinnerSide } from '../types'
import { keysOf } from '../utils'
import MatchResultView from '../widgets/MatchResult'
import CustomTable from '../widgets/Table/CustomTable'
import { MatchWithBets } from '../_selectors'
import GameHeader from './GameHeader'
import { sortBy } from 'lodash'


interface BetInstance {
    id: string,
    resultHome: number,
    resultAway: number,
    qualifier: WinnerSide,
    score: number,
    gumblers: string[],
}

function GameGumblersList({ match }: { match: MatchWithBets }) {
    const { home_team, away_team, betsByValue } = match

    const models = keysOf(betsByValue).map((betVal): BetInstance => {
        const bets = betsByValue[betVal]
        const betSample = bets[0]
        return {
            id: betVal,
            resultHome: betSample.result_home,
            resultAway: betSample.result_away,
            qualifier: betSample.winner_side,
            score: betSample.score,
            gumblers: bets.map((bet) => bet.utlName),
        }
    })
    const sortedModels = sortBy(models, ['score', 'id'], ['desc', 'asc'])

    const cells = [
        {
            id: 'admin',
            classes: {
                header: 'admin',
                cell: 'admin',
            },
            header: '',
            getter: (bet: BetInstance) => bet.id,
        },
        {
            id: 'betValue',
            classes: {
            },
            header: 'ניחוש',
            getter: (bet: BetInstance) => (
                <MatchResultView
                    home={{
                        team: home_team,
                        score: bet.resultHome
                    }}
                    away={{
                        team: away_team,
                        score: bet.resultAway
                    }}
                    qualifier={bet.qualifier}
                />
            ),
        },
        {
            id: 'gumblers',
            classes: {
                cell: 'gumblersCell'
            },
            header: 'מנחשים',
            getter: (bet: BetInstance) => (
                bet.gumblers.join('\n')
            ),
        },
        {
            id: 'score',
            classes: {
                cell: 'scoreCell'
            },
            header: 'ניקוד',
            getter: (bet: BetInstance) => bet.score,
        },
    ]

    return (
        <div className='LB-GameGumblersList'>
            <GameHeader match={match}/>
            <div className='LB-GumblersTable'>
                <CustomTable models={sortedModels} cells={cells}/>
            </div>
        </div>
    )
}

export default GameGumblersList
