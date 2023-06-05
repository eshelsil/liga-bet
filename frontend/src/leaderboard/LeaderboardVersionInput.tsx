import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { map, orderBy } from 'lodash'
import { CircularProgress, IconButton, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import LeaderboardVersionDisplay from './LeaderboardVersionDisplay';
import { valuesOf } from '../utils';
import { LeaderboardVersionWithGame } from '../types';
import { CurrentlyFetchingLeaderboardVersions, FetchedLeaderboardVersions } from '../_selectors';
import './LeaderboardVersionInput.scss'


function NoVersionDisplay () {
    return (
        <div>
            -------------------
        </div>
    )
}


interface Props {
    versionsById: Record<number, LeaderboardVersionWithGame>,
    value: number,
    onChange: (id: number) => void,
    label: string,
    allowNoVersion?: boolean,
    disabled?: boolean,
    retryFetch: () => void,
}

function LeaderboardVersionInput({
    versionsById,
    value,
    onChange,
    label,
    allowNoVersion = false,
    disabled = false,
    retryFetch,
}: Props) {
    const versions = valuesOf(versionsById)
    const sortedVersions = orderBy(versions, 'order', 'desc')
    const availableVersionIds = map(sortedVersions, 'id')
    
    const fetchingVersions = useSelector(CurrentlyFetchingLeaderboardVersions)
    const fetchedVersions = useSelector(FetchedLeaderboardVersions)

    const handleChange = (e: SelectChangeEvent<number>) => {
        const versionId = e.target.value as number
        onChange(versionId)
    }

    const defaultValue = allowNoVersion ? -1 : (sortedVersions[0]?.id ?? -1)

    useEffect(() => {
        if (!availableVersionIds.includes(value) && !allowNoVersion && !disabled){
            onChange(defaultValue)
        }
    }, [defaultValue, value, allowNoVersion, availableVersionIds, disabled])

    const isLoading = fetchingVersions.includes(value)
    const isFetched = fetchedVersions.includes(value)

    return (
        <div className={`LB-LeaderboardVersionInput`}>
            <div className='LeaderboardVersionInput-labelContainer'>
                <div className='LeaderboardVersionInput-label'>
                    {label}
                </div>
                <div className='LeaderboardVersionInput-loaderContainer'>
                    {isLoading && (
                        <CircularProgress className="LeaderboardVersionInput-loader" size={24} />
                    )}
                    {!isLoading && !isFetched && !disabled && (
                        <IconButton onClick={retryFetch}>
                            <RefreshIcon className="LeaderboardVersionInput-refreshIcon" />
                        </IconButton>
                    )}
                </div>
            </div>
            
            <Select
                className='LeaderboardVersionInput-select'
                value={value || defaultValue}
                disabled={disabled}
                onChange={handleChange}
                renderValue={(versionId) => {
                    const version = versionsById[versionId]
                    if (!version) return (
                        <NoVersionDisplay />
                    )
                    return (
                        <LeaderboardVersionDisplay
                            version={version}
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
                            version={version}
                        />
                    </MenuItem>
                ))}
            </Select>
        </div>
    )
}

export default LeaderboardVersionInput
