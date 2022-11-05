import React from 'react'
import { useSelector } from 'react-redux'
import { IsLoadingAppCrucial } from '../_selectors'
import CircularProgress from '@mui/material/CircularProgress'
import './AppLoader.scss'


function AppLoader(){
    const isVisible = useSelector(IsLoadingAppCrucial)
    
    return (
        <div className={`LB-AppLoader ${!isVisible ? 'AppLoader-hidden' : ''}`}>
            <CircularProgress size={80} />
        </div>
    )
}

export default AppLoader