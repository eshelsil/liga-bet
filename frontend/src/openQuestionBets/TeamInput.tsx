import React from 'react'
import { InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { useSelector } from 'react-redux'
import TeamWithFlag from '../widgets/TeamFlag/TeamWithFlag'
import { Teams } from '../_selectors'
import { cn, valuesOf } from '../utils'
import { sortBy } from 'lodash'
import { getHebTeamName } from '../strings/teamNames'
import { Team } from '@/types'




function TeamInput({
    value,
    onChange,
    relevantTeams,
    withLabel = true,
}: {
    value: number
    onChange: (team: number) => void
    withLabel?: boolean
    relevantTeams?: Team[]
}) {
    const teamsById = useSelector(Teams)
    const teamsSortedByName = sortBy(
        valuesOf(teamsById),
        [
            (team) => getHebTeamName(team.name)
        ]
    )
    if (!relevantTeams){
        relevantTeams = teamsSortedByName
    }

    const handleChange = (e: SelectChangeEvent<number>) => {
        const teamId = e.target.value as number
        onChange(teamId)
    }

    return (
        <div className={'LB-TeamInput'}>
            {withLabel && (
                <InputLabel>בחר קבוצה</InputLabel>
            )}
            <Select
                placeholder={'בחר קבוצה'}
                value={value || ''}
                onChange={handleChange}
                renderValue={(selectedTeam) => {
                    const team = teamsById[selectedTeam]
                    if (!team) return
                    return (
                        <TeamWithFlag
                            team={team}
                            size={32}
                        />
                    )
                }}
                fullWidth
                MenuProps={{
                    classes: {
                        paper: cn('mt-2'),
                        list: cn('max-h-[400px]'),
                    }
                }}
            >
                {relevantTeams.map((team) => (
                    <MenuItem key={team.id} value={team.id} style={{}}>
                        <TeamWithFlag
                            team={team}
                            size={32}
                        />
                    </MenuItem>
                ))}
            </Select>
        </div>
    )
}

export default TeamInput
