import React from 'react'
import { Button } from '@mui/material'
import useGoTo from '../hooks/useGoTo'

function DefaultNoUtlView() {
    const { goToJoinTournament, goToCreateTournament } = useGoTo()
    return (
        <div className='LB-DefaultNoUtlView'>
            <h1 className={'title'}>ברוכים הבאים!</h1>
            <div className='buttonsContainer'>
                <Button variant="contained" color="primary" onClick={goToJoinTournament}>
                    הצטרף לטורניר קיים
                </Button>
                <Button variant="contained" color="primary" onClick={goToCreateTournament}>
                    צור טורניר חדש
                </Button>
            </div>
        </div>
    )
}


export default DefaultNoUtlView
