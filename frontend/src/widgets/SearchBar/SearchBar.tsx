import React, { useMemo, useEffect, useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import './SearchBar.scss';
import { debounce } from 'lodash';



interface Props {
    onChange: (val: string) => void,
    defaultValue?: string,
    placeholder?: string,
}

function SearchBar({
    onChange,
    defaultValue = '',
    placeholder = 'Search',
}: Props){
    const [value, setValue] = useState(defaultValue);
    const isEmpty = value.length === 0;
    const debouncedOnChange = useMemo(
		() => debounce(onChange, 300),
		[onChange]
	);
    function handleInputChange(newVal: string){
        setValue(newVal);
        debouncedOnChange(newVal);
    }
    function onClear(){
        handleInputChange('');
    }

    useEffect(()=>{
		return () => {
			debouncedOnChange.cancel()
		}
	}, [])
    return (
        <div className={'LigaBet-SearchBar'}>
            <TextField
                value={value}
                onChange={e => handleInputChange(e.target.value)}
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