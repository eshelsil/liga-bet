import React from 'react'
import { useTranslation } from 'react-i18next'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import BlockIcon from '@mui/icons-material/Block'
import TeamWithFlag from '../widgets/TeamFlag/TeamWithFlag'
import { getGroupName } from '../strings/groups'
import { GroupStanding } from './useBracketTeams'

interface Props {
    group: GroupStanding
    seeded: Set<number> // placed in a bracket slot → qualified (green)
    unqualified: Set<number> // currently out of a qualifying position (red)
    highlightPosition?: number | null // the slot's target position, highlighted
}

// Full group table for the bracket dialog: played / points / GF / GA / GD, with the
// qualified team (seeded) in green and currently-out teams in red.
function BracketGroupStandings({ group, seeded, unqualified, highlightPosition }: Props) {
    const { t } = useTranslation('knockout_bracket')

    return (
        <div className="LB-BracketGroupStandings">
            <div className="BGS-title">{getGroupName(group.name)}</div>
            <table className="BGS-table">
                <thead>
                    <tr>
                        <th className="BGS-pos">{t('table.pos')}</th>
                        <th className="BGS-team" />
                        <th className="BGS-pts BGS-divider">{t('table.points')}</th>
                        <th>{t('table.played')}</th>
                        <th>{t('table.gf')}</th>
                        <th>{t('table.ga')}</th>
                        <th>{t('table.gd')}</th>
                    </tr>
                </thead>
                <tbody>
                    {group.rows.map((row, i) => {
                        const pos = i + 1
                        const qualified = seeded.has(row.team.id)
                        const out = unqualified.has(row.team.id)
                        const gd = row.goalsFor - row.goalsAgainst
                        return (
                            <tr
                                key={row.team.id}
                                className={[
                                    qualified ? 'is-qualified' : '',
                                    out ? 'is-out' : '',
                                    pos === highlightPosition ? 'is-highlight' : '',
                                ].join(' ')}
                            >
                                <td className="BGS-pos">{pos}</td>
                                <td className="BGS-team">
                                    <div className="BGS-teamCell">
                                        <TeamWithFlag team={row.team} size={22} />
                                        {qualified && (
                                            <span className="BGS-badge is-q">
                                                <CheckCircleIcon /> {t('table.qualified')}
                                            </span>
                                        )}
                                        {out && (
                                            <span className="BGS-badge is-o">
                                                <BlockIcon /> {t('table.eliminated')}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="BGS-pts BGS-divider">{row.points}</td>
                                <td>{row.played}</td>
                                <td>{row.goalsFor}</td>
                                <td>{row.goalsAgainst}</td>
                                <td>{gd > 0 ? `+${gd}` : gd}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default BracketGroupStandings
