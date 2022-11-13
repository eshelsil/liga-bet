import React from 'react'
import { InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { valuesOf } from '../../utils'
import {  orderBy } from 'lodash'
import TournamentDisplay from './TournamentDisplay'
import { TournamentInputProps } from './types'
import './TournamentInput.scss'



function TournamentInput({
    value,
    onChange,
    tournamentsById,
}: TournamentInputProps) {
    const tournaments = valuesOf(tournamentsById)
    const sortedTournaments = orderBy(tournaments, t => t.linkedUtl.createdAt)

    const handleChange = (e: SelectChangeEvent<number>) => {
        const tournamentId = e.target.value as number
        onChange(tournamentId)
    }



    return (
        <div className={'LB-TournamentInput'}>
            <InputLabel>ייבא ניחושים מטורניר:</InputLabel>
            <Select
                className='TournamentInput-select'
                value={value || ''}
                onChange={handleChange}
                renderValue={(tournamentId) => {
                    const tournament = tournamentsById[tournamentId]
                    if (!tournament) return
                    return (
                        <TournamentDisplay tournament={tournament} index={sortedTournaments.findIndex(t => t.id == tournamentId)} />
                    )
                }}
                MenuProps={{
                    classes: {
                        paper: 'TournamentInput-paper',
                        list: 'TournamentInput-list',
                    }
                }}
            >
                {sortedTournaments.map((tournament, index) => (
                    <MenuItem key={tournament.id} value={tournament.id}>
                        <TournamentDisplay tournament={tournament} index={index} />
                    </MenuItem>
                ))}
            </Select>
        </div>
    )
}

export default TournamentInput
