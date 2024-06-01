import React, { useEffect } from 'react'
import { MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { useSelector } from 'react-redux'
import { Contestants, WhatifsGamesData } from '../_selectors'
import { cn, valuesOf } from '../utils'
import { sortBy } from 'lodash'




function UtlsInput({
    value,
    onChange,
    utlsToInclude,
}: {
    value: number
    onChange: (team: number) => void
    utlsToInclude?: number[]
}) {
    const utlsById = useSelector(Contestants)
    const utlsSortedByName = sortBy(
        valuesOf(utlsById),'name'
    )
    const utlsList = utlsToInclude ? utlsSortedByName.filter(utl => utlsToInclude.includes(utl.id)) : utlsSortedByName

    const handleChange = (e: SelectChangeEvent<number>) => {
        const utlId = e.target.value as number
        onChange(utlId)
    }


    return (
        <div className={'min-w-[200px]'}>
            <Select
                placeholder={'בחר מנחש'}
                value={utlsList.map(utl => utl.id).includes(value) ? value : ''}
                displayEmpty
                onChange={handleChange}
                renderValue={(selectedUtl) => {
                    const utl = utlsById[selectedUtl]
                    if (!utl) return '---בחר מנחש---'
                    return (
                        utl.name
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
                {utlsList.map((utl) => (
                    <MenuItem key={utl.id} value={utl.id}>
                        {utl.name}
                    </MenuItem>
                ))}
            </Select>
        </div>
    )
}

export default UtlsInput
