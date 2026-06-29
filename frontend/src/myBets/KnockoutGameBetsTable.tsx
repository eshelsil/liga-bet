import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { keyBy, orderBy } from 'lodash'
import dayjs from 'dayjs'
import { useTournamentThemeClass } from '../hooks/useThemeClass'
import CustomTable from '../widgets/Table/CustomTable'
import MatchResultView from '../widgets/MatchResult'
import QualifierResultView from '../widgets/QualifierResult/QualifierResultView'
import { Match, MatchBetWithRelations } from '../types'
import {
    bracketSpecialRole,
    ENG_SHORT_DATE_FORMAT,
    getQualifierSide,
    isGameLive,
    SHORT_DATE_FORMAT,
} from '../utils'
import {
    IsCurrentTournamentIncludesBetOnResult,
    KnockoutGames,
    RunnerUpBetByUtlId,
    WinnerBetByUtlId,
} from '../_selectors'

interface KnockoutGameRow {
    id: number
    match: Match
    bet?: MatchBetWithRelations
}

interface Props {
    utlId: number
    // The contestant's match bets (qualifier-only or result), keyed onto games by match id.
    bets: MatchBetWithRelations[]
    dropColumns?: {
        date?: boolean
    }
    showLive?: boolean
    // Wrap in the themed "Matches" section card (My/His bets). Off (raw table) for the
    // leaderboard's expanded contestant view, matching the classic GameBetsTable there.
    withSection?: boolean
}

const KnockoutGameBetsTable = ({ utlId, bets, dropColumns, showLive, withSection }: Props) => {
    const { t, i18n } = useTranslation('myBets')
    const tournamentClass = useTournamentThemeClass()
    const isResultBetOn = useSelector(IsCurrentTournamentIncludesBetOnResult)
    const knockoutGames = useSelector(KnockoutGames)
    const winnerBetByUtl = useSelector(WinnerBetByUtlId)
    const runnerUpBetByUtl = useSelector(RunnerUpBetByUtlId)

    // The W/RU badge reflects THIS contestant's own predicted Winner / Runner-Up.
    const winnerTeamId = (winnerBetByUtl[utlId]?.answer as { id: number } | undefined)?.id ?? null
    const runnerUpTeamId = (runnerUpBetByUtl[utlId]?.answer as { id: number } | undefined)?.id ?? null

    const betsByGameId = keyBy(bets, 'type_id')

    const renderBet = (row: KnockoutGameRow) => {
        const { match, bet } = row
        if (!bet) {
            return null
        }
        const homeRole = bracketSpecialRole(match.home_team?.id, winnerTeamId, runnerUpTeamId)
        const awayRole = bracketSpecialRole(match.away_team?.id, winnerTeamId, runnerUpTeamId)
        if (isResultBetOn) {
            return (
                <MatchResultView
                    home={{ team: match.home_team, score: bet.result_home }}
                    away={{ team: match.away_team, score: bet.result_away }}
                    isKnockout={match.is_knockout}
                    qualifier={bet.result_home === bet.result_away ? bet.winner_side : undefined}
                    isAutoBet={bet.is_auto_bet}
                    homeRole={homeRole}
                    awayRole={awayRole}
                />
            )
        }
        return (
            <QualifierResultView
                home={{ team: match.home_team, role: homeRole }}
                away={{ team: match.away_team, role: awayRole }}
                qualifier={bet.winner_side}
                isAutoBet={bet.is_auto_bet}
                dimNonQualifier={false}
            />
        )
    }

    const renderResult = (row: KnockoutGameRow) => {
        const { match } = row
        if (!(showLive || match.is_done)) {
            return null
        }
        if (isResultBetOn) {
            return (
                <MatchResultView
                    home={{
                        team: match.home_team,
                        score: match.result_home,
                        fullScore: match.full_result_home,
                    }}
                    away={{
                        team: match.away_team,
                        score: match.result_away,
                        fullScore: match.full_result_away,
                    }}
                    isKnockout={match.is_knockout}
                    qualifier={getQualifierSide(match)}
                />
            )
        }
        return (
            <QualifierResultView
                home={{ team: match.home_team }}
                away={{ team: match.away_team }}
                qualifier={getQualifierSide(match)}
            />
        )
    }

    const cells = [
        {
            id: 'id',
            header: t('columns.id'),
            classes: { header: 'admin', cell: 'admin' },
            getter: (row: KnockoutGameRow) => row.bet?.id ?? row.match.id,
        },
        ...(!dropColumns?.date
            ? [{
                id: 'date',
                header: t('columns.date'),
                classes: { header: 'dateCell' },
                getter: (row: KnockoutGameRow) => dayjs(row.match.start_time).format(
                    i18n.language === 'he' ? SHORT_DATE_FORMAT : ENG_SHORT_DATE_FORMAT
                ),
            }] : []
        ),
        {
            id: 'bet',
            header: t('columns.bet'),
            classes: { cell: 'alignToTop' },
            getter: renderBet,
        },
        {
            id: 'result',
            header: t('columns.result'),
            getter: renderResult,
        },
        {
            id: 'score',
            header: t('columns.score'),
            classes: { cell: 'scoreCell' },
            getter: (row: KnockoutGameRow) => row.bet?.score,
        },
    ]

    const getRowClassName = (row: KnockoutGameRow) => {
        return (showLive && isGameLive(row.match)) ? 'GameBetsTable-live' : ''
    }

    const models: KnockoutGameRow[] = orderBy(
        Object.values(knockoutGames),
        [(match) => match.start_time],
        ['desc'],
    ).map((match) => ({
        id: match.id,
        match,
        bet: betsByGameId[match.id],
    })).filter(({bet}) => !!bet)

    const table = (
        <CustomTable models={models} cells={cells} getRowClassName={getRowClassName} />
    )

    if (!withSection) {
        return <div className='LB-GameBetsTable'>{table}</div>
    }

    return (
        <div className='LB-GameBetsTable LB-MyBetsSection'>
            <div className={`MyBetsSection-header ${tournamentClass}`}>
                <h4 className='MyBetsSection-title'>{t('sections.matches')}</h4>
            </div>
            {table}
        </div>
    )
}

export default KnockoutGameBetsTable
