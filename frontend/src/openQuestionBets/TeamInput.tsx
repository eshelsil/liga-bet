import React from 'react'
import { InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { useSelector } from 'react-redux'
import TeamWithFlag from '../widgets/TeamWithFlag'
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
        <>
            <InputLabel id={`team-input-label`}>בחר קבוצה</InputLabel>
            <Select
                placeholder={'בחר קבוצה'}
                label="בחר קבוצה"
                labelId="team-input-label"
                value={value || ''}
                onChange={handleChange}
                // input={<OutlinedInput label={placeholder} />}
                renderValue={(selectedTeam) => {
                    const team = teamsById[selectedTeam]
                    if (!team) return
                    return (
                        <TeamWithFlag
                            name={team.name}
                            crest_url={team.crest_url}
                        />
                    )
                }}
                fullWidth
            >
                {Object.values(teamsById).map((team) => (
                    <MenuItem key={team.id} value={team.id} style={{}}>
                        <TeamWithFlag
                            name={team.name}
                            crest_url={team.crest_url}
                        />
                    </MenuItem>
                ))}
            </Select>
        </>
    )
}

export default TeamInput
