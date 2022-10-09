import React, { useRef } from 'react'
import {
    Box,
    Chip,
    MenuItem,
    Select,
    OutlinedInput,
    InputLabel,
    FormControl,
} from '@mui/material'
import { createCounter } from '../../utils'

const counter = createCounter()

interface Item<T> {
    value: T
    label: string
}

interface Props<T> {
    items: Item<T>[]
    value: T[]
    onChange: (values: T[]) => void
    label?: string
}

function MultipleSelect({ value, onChange, label, items }: Props<any>) {
    const idRef = useRef(counter())
    const id = idRef.current
    const labelId = `multiple-select-${id}`
    return (
        <>
            <FormControl fullWidth>
                <InputLabel id={labelId}>{label}</InputLabel>
                <Select
                    multiple
                    labelId={labelId}
                    value={value}
                    onChange={(e) => {
                        const value = e.target.value
                        onChange(
                            typeof value === 'string'
                                ? (value.split(',') as any[])
                                : value
                        )
                    }}
                    input={<OutlinedInput label={label} />}
                    renderValue={(selected) => (
                        <Box
                            sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}
                        >
                            {selected.map((value) => (
                                <Chip
                                    key={value}
                                    label={
                                        items.find((i) => i.value === value)
                                            ?.label
                                    }
                                />
                            ))}
                        </Box>
                    )}
                    fullWidth
                >
                    {items.map((item) => (
                        <MenuItem
                            key={item.value}
                            value={item.value}
                            style={{
                                fontWeight: value.includes(item.value)
                                    ? 700
                                    : 400,
                            }}
                        >
                            {item.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </>
    )
}

export default MultipleSelect
