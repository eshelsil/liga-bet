import React, { useState } from 'react'
import {
    IconButton,
    CircularProgress,
} from '@mui/material'
import DoneIcon from '@mui/icons-material/Done'
import useIsRendered from '../../hooks/useIsRendered'
import './LoadingVIcon.scss'


interface Props {
    action: () => Promise<void>
}

function LoadingVIcon({ action }: Props) {
    const [loading, setLoading] = useState(false)
    const isRendered = useIsRendered()
    const onClick = () => {
        setLoading(true)
        action()
            .finally(() => {
                isRendered && setLoading(false)
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
