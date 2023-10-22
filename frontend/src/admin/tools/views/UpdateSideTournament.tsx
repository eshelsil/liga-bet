import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import useGoTo from '../../../hooks/useGoTo'
import { CurrentTournament, Games } from '../../../_selectors'
import { AppDispatch } from '../../../_helpers/store'
import { LoadingButton } from '../../../widgets/Buttons'
import { updateSideTournamentGames } from '../../../api/admin'
import { keyBy, uniq } from 'lodash'
import { fetchAndStoreMatches } from '../../../_actions/matches'
import { getGameDayString, valuesOf } from '../../../utils'
import { SideTournament } from '../../../types'


function GameDayOption({gameDay}: {gameDay: string}){
    const date = new Date(`${gameDay}T00:00:00`)
    return (
        <div style={{padding: '12px 18px', borderRadius: 16, background: '#88c2eb'}}>
            {date.toLocaleDateString('he-IL', {weekday: 'long'})} {date.toLocaleDateString('he-IL')}
        </div>
    )
}

function SideTournamentOption({sideTournament}: {sideTournament: SideTournament}){
    const {emblem, name} = sideTournament
    return (
        <div style={{display: 'flex', alignItems:'center', padding: '12px 18px', borderRadius: 16, background: '#88c2eb'}}>
            {emblem && (
                <img src={emblem} style={{height: 32, width: 32, marginLeft: 8}} />
            )}
            <div>{name}</div>
        </div>
    )
}

function AdminUpdateSideTournament() {
    const dispatch = useDispatch<AppDispatch>()
    const { goToAdminIndex } = useGoTo()
    const tournament = useSelector(CurrentTournament)
    const games = useSelector(Games)

    const [sideTournament, setSideTournament] = useState<number>(0)
    const [gameDay, setGameDay] = useState<string>()
    
    const competitionId = tournament?.competition?.id
    const sideTournamentsById = keyBy(tournament.sideTournaments, 'id')
    const gameDays = uniq(valuesOf(games).map(getGameDayString))

    const handleSideTournamentChange = (e: SelectChangeEvent<number>) => {
        const id = e.target.value as number
        setSideTournament(id)
    }

    const handleGameDayChange = (e: SelectChangeEvent<string>) => {
        const dayString = e.target.value as string
        setGameDay(dayString)
    }

    const submit = async () => {
        await updateSideTournamentGames(tournament.id, gameDay, sideTournament)
            .then(data => {
                (window as any).toastr["success"]('עודכן בהצלחה')
            })
    }

    useEffect(() => {
        if (competitionId) {
            dispatch(fetchAndStoreMatches())
        }
    }, [competitionId])

    return (
        <div className='LB-AdminSetMvp'>
            <h2>עדכן משחקים לטורניר צדדי</h2>
            <InputLabel>בחר טורניר צדדי</InputLabel>
            <Select
                value={sideTournament || 0}
                onChange={handleSideTournamentChange}
                fullWidth
                renderValue={(sideTournamentId) => {
                    const sideTournament = sideTournamentsById[sideTournamentId]
                    if (!sideTournament) return (<div>מחק משחקים מטורניר צדדי</div>)
                    return (
                        <SideTournamentOption sideTournament={sideTournament} />
                    )
                }}
            >
                <MenuItem key={0} value={0} style={{}}>
                    <div>
                        מחק משחקים מטורניר צדדי
                    </div>
                </MenuItem>
                {valuesOf(sideTournamentsById).map((st) => (
                    <MenuItem key={st.id} value={st.id} style={{}}>
                        <SideTournamentOption sideTournament={st} />
                    </MenuItem>
                ))}
            </Select>

            <InputLabel style={{marginTop: 20}}>בחר יום משחקים</InputLabel>
            <Select
                value={gameDay || ''}
                onChange={handleGameDayChange}
                fullWidth
                renderValue={(gameDay) => {
                    if (!gameDay) return
                    return (
                        <GameDayOption gameDay={gameDay} />
                    )
                }}
            >
                {gameDays.map((gd) => (
                    <MenuItem key={gd} value={gd} style={{}}>
                        <GameDayOption gameDay={gd} />
                    </MenuItem>
                ))}
            </Select>

            <LoadingButton action={submit} style={{marginTop: 24}}>
                עדכן
            </LoadingButton>
            <div className='goBackButton'>
                <Button
                    variant='outlined'
                    color='primary'
                    onClick={goToAdminIndex}
                    style={{marginTop: 24}}
                >
                    חזור
                </Button>
            </div>
        </div>
    )
}

export default AdminUpdateSideTournament 
