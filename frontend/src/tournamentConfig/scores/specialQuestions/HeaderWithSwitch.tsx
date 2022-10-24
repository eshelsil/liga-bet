

import React from 'react';
import { Checkbox, CheckboxProps } from '@mui/material';


interface Props extends CheckboxProps {
    label: string,
}

function HeaderWithSwitch({label, ...checkboxProps}: Props){
	return (
		<div className={'headerWithSwitch'}>
            <Checkbox {...checkboxProps} />
            <div>{label}</div>
        </div>
	);
}


export default HeaderWithSwitch;