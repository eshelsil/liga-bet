import * as React from 'react'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { ButtonWithLoaderProps } from './types'

export default function ButtonWithLoader({
    loading,
    disabled,
    children,
    ...props
}: ButtonWithLoaderProps) {
    return (
        <Button
            className={`LigaBet-ButtonWithLoader ${loading ? 'loading' : ''}`}
            variant="contained"
            color="primary"
            disabled={loading || disabled}
            {...props}
        >
            {children}
            {loading && (
                <div className="loader_container">
                    <CircularProgress className="loader" size={20} />
                </div>
            )}
        </Button>
    )
}
