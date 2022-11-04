import React from 'react'
import { CircularProgress } from '@mui/material'

function LoadingTournamentsView() {

    return (
        <>
            <h2>
                טוען טורנירים
            </h2>
            <CircularProgress
                size={60}
                thickness={5}
                sx={{animationDuration: '700ms'}}
            />
        </>
    )
}

export default LoadingTournamentsView
