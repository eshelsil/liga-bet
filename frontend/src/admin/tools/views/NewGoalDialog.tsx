import React, { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { GameGoalsData, Match, Player } from '../../../types'
import PlayerWithImg from '../../../widgets/Player'
import { Dictionary, pickBy, sortBy } from 'lodash'
import { cn, valuesOf } from '../../../utils'
import TeamWithFlag from '../../../widgets/TeamFlag/TeamWithFlag'
import { useSelector } from 'react-redux'
import { PlayersWithTeams } from '../../../_selectors'
import { LoadingButton } from '../../../widgets/Buttons'
import { useTranslation } from 'react-i18next'


const alephBet = 'אבגדהוזחטיכלמנסעפצקרשת'

function PlayerInput({
    value,
    onChange,
    playersById,
    label,
}: {
    value: number
    onChange: (team: number) => void
    playersById: Dictionary<Player>
    label: string
}) {
    const { t } = useTranslation('admin')
    const selectedPlayer = playersById[value]
    const players = sortBy(
        (valuesOf(playersById) ?? []),
        [
            (player) => (alephBet.indexOf(player.name[0]) > -1 ? 0 : 1),
            'name',
        ],
    )

    const handleChange = (e: SelectChangeEvent<number>) => {
        const playerId = e.target.value as number
        onChange(playerId)
    }

    return (
        <div className={'LB-PlayerInput'}>
            <InputLabel id={`team-input-label`}>{label}</InputLabel>
            <Select
                placeholder={t('newGoalDialog.selectPlayer')}
                label={label}
                labelId="team-input-label"
                value={value || ''}
                onChange={handleChange}
                renderValue={(playerId) => {
                    const player = playersById[playerId]
                    if (!player) return
                    return (
                        <PlayerWithImg
                            player={player}
                            size={56}
                        />
                    )
                }}
                fullWidth
                MenuProps={{
                    classes: {
                        paper: 'PlayerInput-paper',
                        list: 'PlayerInput-list',
                    }
                }}
            >
                {players.map((player) => (
                    <MenuItem key={player.id} value={player.id}>
                        <PlayerWithImg
                            player={player}
                            size={48}
                        />
                    </MenuItem>
                ))}
            </Select>
        </div>
    )
}


type SubmitFunc = (scorer: {id: number, goals: number}, assister?: {id: number, assists: number}) => Promise<void>

interface Props {
    open: boolean
    onClose: () => void
    submit: SubmitFunc
    game: Match
    goalsDataByPlayerId: Record<number, GameGoalsData>
}

export default function NewGoalDialog({
    open,
    onClose,
    submit,
    game,
    goalsDataByPlayerId,
}: Props) {
    const { t } = useTranslation('admin')
    const { home_team, away_team } = game
    const allPlayersById = useSelector(PlayersWithTeams)

    const [teamId, setTeamId] = useState(home_team.id)
    const [scorerId, setScorerId] = useState<number>(null)
    const [assisterId, setAssisterId] = useState<number>(null)

    const teams = [home_team, away_team]
    const homeTeamPlayers = pickBy(allPlayersById, player => player.team.id === home_team.id)
    const awayTeamPlayers = pickBy(allPlayersById, player => player.team.id === away_team.id)
    const playersById = teamId === home_team.id ? homeTeamPlayers : awayTeamPlayers

    const scorer = goalsDataByPlayerId[scorerId]
    const assister = goalsDataByPlayerId[assisterId]
    const scorerTotalGoals = (scorer?.goals ?? 0) + 1
    const assisterTotalAssists = (assister?.assists ?? 0) + 1

    const onSubmit = async () => {
        if (!scorerId) {
            throw new Error('Must select the scorer of new goal')
        }
        await submit(
            {id: scorerId, goals: scorerTotalGoals},
            (assisterId
                ? {id: assisterId, assists: assisterTotalAssists}
                : undefined
            ),
        )
        onClose()
    }

    useEffect(() => {
        setScorerId(null)
        setAssisterId(null)
    }, [teamId])

    return (
        <Dialog classes={{root: 'LB-NewGoalDialog'}} open={open} onClose={onClose}>
            <DialogTitle>
                <IconButton onClick={onClose} className={'closeButton'}>
                    <CloseIcon />
                </IconButton>
                {t('newGoalDialog.title')}
            </DialogTitle>
            <DialogContent className={'NewGoalDialog-content'}>
                <div>
                    <InputLabel>{t('newGoalDialog.whichTeamScored')}</InputLabel>
                    <Select
                        value={teamId}
                        onChange={(e: SelectChangeEvent<number>) => {
                            const teamId = e.target.value as number
                            setTeamId(teamId)
                        }}
                        renderValue={(teamId) => {
                            const team = teams.find(t => t.id === teamId)
                            if (!team) return
                            return (
                                <TeamWithFlag
                                    team={team}
                                    size={32}
                                />
                            )
                        }}
                        fullWidth
                        MenuProps={{
                            classes: {
                                paper: cn('mt-2'),
                                list: cn('max-h-[400px]'),
                            }
                        }}
                    >
                        {teams.map((team) => (
                            <MenuItem key={team.id} value={team.id}>
                                <TeamWithFlag
                                    team={team}
                                    size={32}
                                />
                            </MenuItem>
                        ))}
                    </Select>
                </div>
                <div style={{marginTop: 20}}>
                    <PlayerInput
                        value={scorerId}
                        onChange={setScorerId}
                        playersById={playersById}
                        label={t('newGoalDialog.scorerLabel')}
                    />
                    {scorerId && (
                        <h5>{t('newGoalDialog.scorerTotalGoals', { count: scorerTotalGoals })}</h5>
                    )}
                </div>
                <div style={{marginTop: 20}}>
                    <PlayerInput
                        value={assisterId}
                        onChange={setAssisterId}
                        playersById={playersById}
                        label={t('newGoalDialog.assisterLabel')}
                    />
                    {assisterId && (
                        <h5>{t('newGoalDialog.assisterTotalAssists', { count: assisterTotalAssists })}</h5>
                    )}
                </div>
                <div style={{marginTop: 20}}>
                    <LoadingButton
                        action={onSubmit}
                    >
                        {t('buttons.update')}
                    </LoadingButton>
                </div>

            </DialogContent>
        </Dialog>
    )
}
