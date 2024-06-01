import React, { useEffect, useState } from 'react'
import { InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { useSelector } from 'react-redux'
import { PlayersByTeamId, PlayersWithTeams } from '../_selectors'
import PlayerWithImg from '../widgets/Player'
import TeamInput from './TeamInput'
import { sortBy } from 'lodash'
import { cn } from '@/utils'
import { Team } from '@/types'


const alephBet = 'אבגדהוזחטיכלמנסעפצקרשת'

function PlayerInput({
    value,
    onChange,
    relevantTeams,
    selectedTeam,
    withLabel = true,
}: {
    value: number
    onChange: (team: number) => void
    selectedTeam?: number
    withLabel?: boolean
    relevantTeams?: Team[]
}) {
    const playersByTeamId = useSelector(PlayersByTeamId)
    const playersById = useSelector(PlayersWithTeams)
    const selectedPlayer = playersById[value]
    const [team, setTeam] = useState<number>(selectedPlayer?.team?.id ?? selectedTeam)
    const players = sortBy(
        (playersByTeamId[team] ?? []),
        [
            (player) => (alephBet.indexOf(player.name[0]) > -1 ? 0 : 1),
            'name',
        ],
    )
    
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
            <TeamInput value={team} onChange={setTeam} relevantTeams={relevantTeams} withLabel={withLabel} />
            {withLabel && (
                <InputLabel id={`team-input-label`}>בחר שחקן</InputLabel>
            )}
            <Select
                placeholder={'בחר שחקן'}
                label="בחר שחקן"
                disabled={!team}
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
                        paper: cn('mt-2'),
                        list: cn('max-h-[400px]'),
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
