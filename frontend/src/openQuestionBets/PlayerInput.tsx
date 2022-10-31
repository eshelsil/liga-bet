import React, { useEffect, useState } from 'react'
import { InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { useSelector } from 'react-redux'
import { PlayersByTeamId, PlayersWithTeams } from '../_selectors'
import TeamWithFlag from '../widgets/TeamFlag/TeamWithFlag'
import TeamInput from './TeamInput'

function PlayerInput({
    value,
    onChange,
}: {
    value: number
    onChange: (team: number) => void
}) {
    const [team, setTeam] = useState<number>()
    const playersByTeamId = useSelector(PlayersByTeamId)
    const players = playersByTeamId[team] ?? []
    const playersById = useSelector(PlayersWithTeams)
    const selectedPlayer = playersById[value]

    const differentTeamSelected = team !== selectedPlayer?.team?.id
    const defaultValue = players[0]?.id
    const displayValue = differentTeamSelected ? defaultValue : value

    const handleChange = (e: SelectChangeEvent<number>) => {
        const playerId = e.target.value as number
        onChange(playerId)
    }

    useEffect(() => {
        if (selectedPlayer?.team && !team) {
            setTeam(selectedPlayer.team.id)
        }
    }, [selectedPlayer])

    useEffect(() => {
        if (differentTeamSelected) {
            onChange(defaultValue)
        }
    }, [differentTeamSelected, defaultValue])

    return (
        <>
            <TeamInput value={team} onChange={setTeam} />
            <InputLabel id={`team-input-label`}>בחר שחקן</InputLabel>
            <Select
                placeholder={'בחר שחקן'}
                label="בחר שחקן"
                labelId="team-input-label"
                value={displayValue || ''}
                onChange={handleChange}
                renderValue={(playerId) => {
                    const player = players.find((p) => p.id === playerId)
                    if (!player) return
                    return (
                        <TeamWithFlag
                            name={player.name}
                            crest_url={player.team.crest_url}
                        />
                    )
                }}
                fullWidth
            >
                {players.map((player) => (
                    <MenuItem key={player.id} value={player.id} style={{}}>
                        <TeamWithFlag
                            name={player.name}
                            crest_url={player.team.crest_url}
                        />
                    </MenuItem>
                ))}
            </Select>
        </>
    )
}

export default PlayerInput
