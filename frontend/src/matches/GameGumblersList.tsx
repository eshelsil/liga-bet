import React from 'react'
import { GameWithBetsAndGoalsData, WinnerSide } from '../types'
import { keysOf } from '../utils'
import { MatchResultV2 } from '../widgets/MatchResult'
import CustomTable from '../widgets/Table/CustomTable'
import { groupBy, mapValues, orderBy, sortBy } from 'lodash'
import GumblersList from '../gumblersList/GumblersList'
import useOpenDialog from '@/hooks/useOpenDialog'
import { DialogName } from '@/dialogs/types'
import { useSelector } from 'react-redux'
import { Nihusim, NihusimByGameId } from '@/_selectors'


interface BetInstance {
    id: string,
    resultHome: number,
    resultAway: number,
    qualifier: WinnerSide,
    score: number,
    gumblers: {name: string, id: number}[],
}

function GameGumblersList({ match, isLive, showNihusable }: { match: GameWithBetsAndGoalsData, isLive?: boolean, showNihusable?: boolean }) {
    const { home_team, away_team, betsByValue, id } = match
    const nihusimByGameId = useSelector(NihusimByGameId)
    const nihusim = nihusimByGameId[id]
    const nihusimByTargetUtlId = mapValues(groupBy(nihusim, 'target_utl_id'), betNahs => sortBy(betNahs, 'created_at'))
    const openNihusDialog = useOpenDialog(DialogName.SendNihus)

    const models = keysOf(betsByValue).map((betVal): BetInstance => {
        const bets = betsByValue[betVal]
        const betSample = bets[0]
        return {
            id: betVal,
            resultHome: betSample.result_home,
            resultAway: betSample.result_away,
            qualifier: betSample.winner_side,
            score: betSample.score,
            gumblers: bets.map((bet) => ({
                name: bet.utlName,
                id: bet.user_tournament_id,
            })),
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
                    isTwoLeggedTie={match.isTwoLeggedTie}
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
                <GumblersList nihusimByTargetUtlId={nihusimByTargetUtlId} gumblers={bet.gumblers} onNihusClick={(utlId => openNihusDialog({targetUtlId: utlId, gameId: id}))} showNihusable={showNihusable && isLive}/>
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
        <div className='LB-GumblersTable'>
            <CustomTable models={sortedModels} cells={cells}/>
        </div>
    )
}

export default GameGumblersList
