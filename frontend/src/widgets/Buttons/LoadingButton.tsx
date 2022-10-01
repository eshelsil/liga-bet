import * as React from 'react';
import Button from '@mui/material/Button';
import { CircularProgress } from '@mui/material';
import { LoadingButtonProps } from './types';
import './style.scss'



export default function LoadingButton({
    loading,
    disabled,
    children,
    ...props
}: LoadingButtonProps) {
    return (
        <Button
            className='LigaBet-LoadingButton'
            variant='contained'
            color='primary'
            disabled={loading || disabled}
            {...props}
        >
            {children}
            {loading && (
                <div className='loader_container'>
                    <CircularProgress className='loader' size={28} />
                </div>
            )}
        </Button>
    );
};