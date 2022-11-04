import React, { useState } from 'react'
import {
    IconButton,
    CircularProgress,
} from '@mui/material'
import DoneIcon from '@mui/icons-material/Done'
import './LoadingVIcon.scss'


interface Props {
    action: () => Promise<void>
}

function LoadingVIcon({ action }: Props) {
    const [loading, setLoading] = useState(false)
    const onClick = () => {
        setLoading(true)
        action()
            .finally(() => {
                setLoading(false)
            })
    }
    return (
        <div className="LB-LoadingVIcon">
            {loading && (
                <CircularProgress size={20} />
            )}
            {!loading && (
                <IconButton onClick={onClick}>
                    <DoneIcon />
                </IconButton>
            )}
        </div>
    )
}

export default LoadingVIcon
