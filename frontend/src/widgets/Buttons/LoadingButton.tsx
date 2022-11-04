import React, { useState } from 'react'
import { LoadingButtonProps } from './types'
import { Button, CircularProgress } from '@mui/material'

export default function LoadingButton({
    action,
    children,
    disabled,
    ...props
}: LoadingButtonProps) {
    const [loading, setLoading] = useState(false)
    const onClick = async () => {
        setLoading(true)
        await action()
        setLoading(false)
    }
    return (
        <Button
            className={`LigaBet-LoadingButton ${loading ? 'loading' : ''}`}
            variant="contained"
            color="primary"
            disabled={loading || disabled}
            onClick={onClick}
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
