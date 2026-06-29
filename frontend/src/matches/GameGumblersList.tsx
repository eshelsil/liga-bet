import React from 'react'
import { GameWithBetsAndGoalsData, WinnerSide } from '../types'
import { getWinnerSide, keysOf } from '../utils'
import { MatchResultV2 } from '../widgets/MatchResult'
import TeamFlag from '../widgets/TeamFlag/TeamFlag'
import CustomTable from '../widgets/Table/CustomTable'
import { groupBy, mapValues, orderBy, sortBy } from 'lodash'
import GumblersList, { Gumbler } from '../gumblersList/GumblersList'
import useOpenDialog from '@/hooks/useOpenDialog'
import { DialogName } from '@/dialogs/types'
import { useSelector } from 'react-redux'
import {
    IsCurrentTournamentIncludesBetOnResult,
    IsCurrentTournamentKnockoutBracket,
    NihusimByGameId,
    RunnerUpBetByUtlId,
    WinnerBetByUtlId,
} from '@/_selectors'
import { useTranslation } from 'react-i18next'
import QualifierResultView from '@/widgets/QualifierResult/QualifierResultView'


interface BetInstance {
    id: string,
    resultHome: number,
    resultAway: number,
    qualifier: WinnerSide,
    score: number,
    gumblers: Gumbler[],
}

function GameGumblersList({ match, isLive, showNihusable }: { match: GameWithBetsAndGoalsData, isLive?: boolean, showNihusable?: boolean }) {
    const { t } = useTranslation('matches')
    const { home_team, away_team, betsByValue, id } = match
    const nihusimByGameId = useSelector(NihusimByGameId)
    const nihusim = nihusimByGameId[id]
    const nihusimByTargetUtlId = mapValues(groupBy(nihusim, 'target_utl_id'), betNahs => sortBy(betNahs, 'created_at'))
    const openNihusDialog = useOpenDialog(DialogName.SendNihus)

    const isKnockoutBracket = useSelector(IsCurrentTournamentKnockoutBracket)
    const isResultBetOn = useSelector(IsCurrentTournamentIncludesBetOnResult)
    const winnerBetByUtlId = useSelector(WinnerBetByUtlId)
    const runnerUpBetByUtlId = useSelector(RunnerUpBetByUtlId)

    // Knockout bracket only: 🏆/🥈 when one of THIS game's teams is the user's
    // tournament Winner/Runner-Up pick. Undefined for classic → no visual change.
    const gameTeamIds = [home_team?.id, away_team?.id].filter((tid): tid is number => tid != null)
    const specialRoleForUtl = (utlId: number): Gumbler['specialRole'] => {
        if (!isKnockoutBracket) return undefined
        const winnerTeamId = winnerBetByUtlId[utlId]?.answer?.id
        if (winnerTeamId != null && gameTeamIds.includes(winnerTeamId)) return 'winner'
        const runnerUpTeamId = runnerUpBetByUtlId[utlId]?.answer?.id
        if (runnerUpTeamId != null && gameTeamIds.includes(runnerUpTeamId)) return 'runnerUp'
        return undefined
    }

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
                isAutoBet: bet.is_auto_bet,
                specialRole: specialRoleForUtl(bet.user_tournament_id),
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
            header: t('table.prediction'),
            getter: (bet: BetInstance) => {
                // Result bet off (knockout bracket): the bet is just a qualifier
                // pick — show only the winning team's flag, no score / ✌️.
                if (isKnockoutBracket && !isResultBetOn) {
                    const winnerSide = getWinnerSide(bet.resultHome, bet.resultAway, bet.qualifier)
                    const winnerTeam = winnerSide === WinnerSide.Away ? away_team : home_team
                    return (
                        <div className='flex justify-center'>
                            <QualifierResultView
                                home={{ team: match.home_team }}
                                away={{ team: match.away_team }}
                                qualifier={bet.qualifier}
                                dimNonQualifier
                                noPadding
                            />
                        </div>
                    )
                }
                return (
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
                )
            },
        },
        {
            id: 'gumblers',
            classes: {
                cell: 'gumblersCell'
            },
            header: t('table.gumblers'),
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
            header: t('table.score'),
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
