import React from 'react'
import { CircularProgress } from '@mui/material'

function LoadingTournamentsView() {

    return (
        <>
            <h2>
                טוען טורניירים
            </h2>
            <CircularProgress size={80} />
        </>
    )
}

export default LoadingTournamentsView
