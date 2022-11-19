import React from 'react'
import { orderBy } from 'lodash'
import { InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import LeaderboardVersionDisplay from './LeaderboardVersionDisplay';
import { valuesOf } from '../utils';
import { LeaderboardVersionById } from '../types';
import './LeaderboardVersionInput.scss'


function NoVersionDisplay () {
    return (
        <div>
            --------------------------
        </div>
    )
}


interface Props {
    versionsById: LeaderboardVersionById,
    value: number,
    onChange: (id: number) => void,
    label: string,
    allowNoVersion?: boolean,
    asc?: boolean,
}

function LeaderboardVersionInput({
    versionsById,
    value,
    onChange,
    label,
    allowNoVersion = false,
    asc = false
}: Props) {
    const versions = valuesOf(versionsById)
    const sortedVersions = orderBy(versions, 'created_at', (asc ? 'asc' : 'desc'))

    const handleChange = (e: SelectChangeEvent<number>) => {
        const versionId = e.target.value as number
        onChange(versionId)
    }

    return (
        <div className={`LB-LeaderboardVersionInput`}>
            <InputLabel>{label}</InputLabel>
            <Select
                className='LeaderboardVersionInput-select'
                value={value || -1}
                onChange={handleChange}
                renderValue={(versionId) => {
                    const version = versionsById[versionId]
                    if (!version) return (
                        <NoVersionDisplay />
                    )
                    return (
                        <LeaderboardVersionDisplay
                            description={version.description}
                            order={version.order}
                        />
                    )
                }}
                MenuProps={{
                    classes: {
                        paper: 'LeaderboardVersionInput-paper',
                        list: 'LeaderboardVersionInput-list',
                    }
                }}
            >
                {allowNoVersion && (
                    <MenuItem value={-1}>
                        <NoVersionDisplay />
                    </MenuItem>
                )}
                {sortedVersions.map((version, index) => (
                    <MenuItem key={version.id} value={version.id}>
                        <LeaderboardVersionDisplay
                            description={version.description}
                            order={version.order}
                        />
                    </MenuItem>
                ))}
            </Select>
        </div>
    )
}

export default LeaderboardVersionInput
