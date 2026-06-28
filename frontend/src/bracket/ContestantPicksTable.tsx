import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { orderBy } from 'lodash'
import {
    RunnerUpBetByUtlId,
    ScoreboardSelector,
    WinnerBetByUtlId,
} from '../_selectors'
import { Team } from '../types'
import TeamFlag from '../widgets/TeamFlag/TeamFlag'

// One W/RU cell: team flag + name, or a muted "—" when the contestant hasn't picked.
function TeamCell({ team }: { team: Team | null }) {
    const { t } = useTranslation('knockout_bracket')
    if (!team) {
        return (
            <span className="ContestantPicks-empty">
                {t('special.notSelected')}
            </span>
        )
    }
    return (
        <span className="ContestantPicks-team">
            <TeamFlag team={team} size={22} />
            <span className="ContestantPicks-teamName">{team.name}</span>
        </span>
    )
}

// Table of every contestant's tournament Winner & Runner-Up picks (post-start modal).
// All data is already aggregated by user-tournament id, so this is a pure render.
function ContestantPicksTable() {
    const { t } = useTranslation('knockout_bracket')
    const rows = useSelector(ScoreboardSelector)
    const winnerByUtl = useSelector(WinnerBetByUtlId)
    const runnerUpByUtl = useSelector(RunnerUpBetByUtlId)

    const ordered = orderBy(rows, 'rank', 'asc')

    return (
        <div className="LB-ContestantPicks">
            <table className="ContestantPicks-table">
                <thead>
                    <tr>
                        <th>{t('picksTable.contestant')}</th>
                        <th>{t('special.winner')}</th>
                        <th>{t('special.runnerUp')}</th>
                    </tr>
                </thead>
                <tbody>
                    {ordered.map((row) => {
                        const utlId = row.user_tournament_id
                        const winner =
                            (winnerByUtl[utlId]?.answer as Team) ?? null
                        const runnerUp =
                            (runnerUpByUtl[utlId]?.answer as Team) ?? null
                        return (
                            <tr key={utlId}>
                                <td className="ContestantPicks-name">
                                    {row.name}
                                </td>
                                <td>
                                    <TeamCell team={winner} />
                                </td>
                                <td>
                                    <TeamCell team={runnerUp} />
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default ContestantPicksTable
