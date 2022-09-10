import React from 'react';
import { Box, Chip, MenuItem, Select, OutlinedInput } from '@mui/material';


interface Item<T>{
    value: T,
    label: string,
}


interface Props<T> {
    items: Item<T>[]
    value: T[],
    onChange: (values: T[]) => void,
    placeholder?: string,
}

function MultipleSelect({
    value,
    onChange,
    placeholder,
    items
}: Props<any>){
    return (
        <Select
            multiple
            placeholder={placeholder}
            value={value}
            onChange={e => {
                const value = e.target.value;
                onChange(typeof value === 'string' ? (value.split(',') as any[]) : value);
            }}
            input={<OutlinedInput label={placeholder} />}
            renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                    <Chip
                        key={value}
                        label={items.find(i => i.value === value)?.label}
                    />
                ))}
                </Box>
            )}
            fullWidth
        >
            {items.map(item => (
                <MenuItem
                    key={item.value}
                    value={item.value}
                    style={{
                        fontWeight: value.includes(item.value) ? 700 : 400,
                    }}
                >
                    {item.label}
                </MenuItem>
            ))}
        </Select>
    );
}

export default MultipleSelect;