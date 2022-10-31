import React from 'react'
import { InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { useSelector } from 'react-redux'
import TeamWithFlag from '../widgets/TeamFlag/TeamWithFlag'
import { Teams } from '../_selectors'

function TeamInput({
    value,
    onChange,
}: {
    value: number
    onChange: (team: number) => void
}) {
    const teamsById = useSelector(Teams)
    const handleChange = (e: SelectChangeEvent<number>) => {
        const teamId = e.target.value as number
        onChange(teamId)
    }

    return (
        <div className={'LB-TeamInput'}>
            <InputLabel>בחר קבוצה</InputLabel>
            <Select
                placeholder={'בחר קבוצה'}
                value={value || ''}
                onChange={handleChange}
                renderValue={(selectedTeam) => {
                    const team = teamsById[selectedTeam]
                    if (!team) return
                    return (
                        <TeamWithFlag
                            name={team.name}
                            size={32}
                        />
                    )
                }}
                fullWidth
                MenuProps={{
                    classes: {
                        paper: 'TeamInput-paper',
                        list: 'TeamInput-list',
                    }
                }}
            >
                {Object.values(teamsById).map((team) => (
                    <MenuItem key={team.id} value={team.id} style={{}}>
                        <TeamWithFlag
                            name={team.name}
                            size={32}
                        />
                    </MenuItem>
                ))}
            </Select>
        </div>
    )
}

export default TeamInput
