import React from 'react'
import { Button } from '@mui/material'
import useGoTo from '../hooks/useGoTo'
import './AdminDefaultView.scss'

function AdminDefaultView() {
    const { goToJoinTournament, goToCreateTournament } = useGoTo()
    return (
        <div className='LigaBet-AdminDefaultView'>
            <h1 className={'title'}>Admin View</h1>
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


export default AdminDefaultView
