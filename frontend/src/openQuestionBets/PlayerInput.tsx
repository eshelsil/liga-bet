import React, { useEffect, useState } from 'react'
import { InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { useSelector } from 'react-redux'
import { PlayersByTeamId, PlayersWithTeams } from '../_selectors'
import PlayerWithImg from '../widgets/Player'
import TeamInput from './TeamInput'

function PlayerInput({
    value,
    onChange,
}: {
    value: number
    onChange: (team: number) => void
}) {
    const playersByTeamId = useSelector(PlayersByTeamId)
    const playersById = useSelector(PlayersWithTeams)
    const selectedPlayer = playersById[value]
    const [team, setTeam] = useState<number>(selectedPlayer?.team?.id)
    const players = playersByTeamId[team] ?? []
    
    const differentTeamSelected = team !== selectedPlayer?.team?.id
    const defaultValue = players[0]?.id
    const displayValue = differentTeamSelected ? defaultValue : value

    const handleChange = (e: SelectChangeEvent<number>) => {
        const playerId = e.target.value as number
        onChange(playerId)
    }


    useEffect(() => {
        if (differentTeamSelected) {
            onChange(defaultValue)
        }
    }, [differentTeamSelected, defaultValue])

    return (
        <div className={'LB-PlayerInput'}>
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
                        <PlayerWithImg
                            player={player}
                            size={56}
                        />
                    )
                }}
                fullWidth
                MenuProps={{
                    classes: {
                        paper: 'PlayerInput-paper',
                        list: 'PlayerInput-list',
                    }
                }}
            >
                {players.map((player) => (
                    <MenuItem key={player.id} value={player.id} style={{}}>
                        <PlayerWithImg
                            player={player}
                            size={48}
                        />
                    </MenuItem>
                ))}
            </Select>
        </div>
    )
}

export default PlayerInput
