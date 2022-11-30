import React, { useState } from 'react'
import { WinnerSide } from '../types'
import { keysOf } from '../utils'
import { MatchResultV2 } from '../widgets/MatchResult'
import CustomTable from '../widgets/Table/CustomTable'
import { MatchWithBets } from '../_selectors'
import GameHeader from './GameHeader'
import { orderBy } from 'lodash'
import { Collapse } from '@mui/material'
import ArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import GumblersList from '../gumblersList/GumblersList'


interface BetInstance {
    id: string,
    resultHome: number,
    resultAway: number,
    qualifier: WinnerSide,
    score: number,
    gumblers: string[],
}

function GameGumblersList({ match, withExpand, isLive }: { match: MatchWithBets, withExpand?: boolean, isLive?: boolean, }) {
    const { home_team, away_team, betsByValue } = match
    const [expand, setExpand] = useState(false)
    const toggleExpand = () => setExpand(!expand)

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
    const sortedModels = orderBy(
        models,
        [
            'score',
            ({gumblers}) => gumblers.length,
            'id',
        ],
        [
            'desc',
            'desc',
            'asc',
        ]
    )

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
                <MatchResultV2
                    home={{
                        team: home_team,
                        score: bet.resultHome
                    }}
                    away={{
                        team: away_team,
                        score: bet.resultAway
                    }}
                    isKnockout={match.is_knockout}
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
                <GumblersList gumblers={bet.gumblers} />
            ),
        },
        {
            id: 'score',
            classes: {
                cell: `scoreCell ${isLive ? 'isLive' : ''}`,
                header: 'scoreHeaderCell',
            },
            header: 'ניקוד',
            getter: (bet: BetInstance) => bet.score,
        },
    ]

    return (
        <div className={`LB-GameGumblersList ${expand ? 'GameGumblersList-expanded' : ''}`}>
            <GameHeader match={match} onClick={withExpand ? toggleExpand : null} />
            {withExpand && (<>
                <Collapse in={expand}>
                    <div className='LB-GumblersTable'>
                        <CustomTable models={sortedModels} cells={cells}/>
                    </div>
                </Collapse>
                <div className='GameGumblersList-expandIconContainer' onClick={toggleExpand}>
                    <ArrowDownIcon className={`arrowDownIcon`} />
                </div>
            </>)}
            {!withExpand && (
                <div className='LB-GumblersTable'>
                    <CustomTable models={sortedModels} cells={cells}/>
                </div>
            )}
        </div>
    )
}

export default GameGumblersList
