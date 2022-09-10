import React from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import './SearchBar.scss';



interface Props {
    value: string,
    onChange: (val: string) => void,
    placeholder?: string,
}

function SearchBar({
    value,
    onChange,
    placeholder = 'Search',
}: Props){
    const isEmpty = value.length === 0;
    function onClear(){
        onChange('');
    }
    return (
        <div className={'LigaBet-SearchBar'}>
            <TextField
                value={value || ''}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            {isEmpty ?
                                (
                                    <IconButton disabled >
                                        <SearchIcon />
                                    </IconButton>
                                ) : (
                                    <IconButton onClick={onClear} >
                                        <CloseIcon />
                                    </IconButton>
                                )
                            }
                        </InputAdornment>
                    ),
                }}
            />

        </div>
    );
}

export default SearchBar;