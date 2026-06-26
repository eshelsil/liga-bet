import React from 'react'
import { useTranslation } from 'react-i18next'
import { getGroupName } from '../strings/groups'
import TeamFlag from '../widgets/TeamFlag/TeamFlag'
import { GroupStanding } from './useBracketTeams'

interface Props {
    groups: GroupStanding[]
    onOpenGroup: (groupId: number) => void
}

// Compact flag grid (like the ref image), each group ordered by current standing.
// Tapping a group opens its full standings dialog.
function GroupsOverview({ groups, onOpenGroup }: Props) {
    const { t } = useTranslation('knockout_bracket')
    if (groups.length === 0) return null

    return (
        <div className="LB-GroupsOverview">
            <div className="GroupsOverview-title">{t('groups.title')}</div>
            <div className="GroupsOverview-grid">
                {groups.map((group) => (
                    <div
                        key={group.id}
                        className="GroupsOverview-group"
                        role="button"
                        onClick={() => onOpenGroup(group.id)}
                    >
                        <div className="GroupsOverview-name">{getGroupName(group.name)}</div>
                        <div className="GroupsOverview-flags">
                            {group.rows.map(({ team }) => (
                                <TeamFlag key={team.id} team={team} size={22} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default GroupsOverview
