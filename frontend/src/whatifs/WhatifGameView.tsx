import React, { useState } from 'react'
import { Match } from '../types'
import { DEFAULT_DATE_FORMAT, DEFAULT_TIME_FORMAT, keysOf } from '@/utils'
import dayjs from 'dayjs'
import { cn } from '@/utils'
import InfoIcon from '@mui/icons-material/InfoOutlined'
import { DialogName } from '@/dialogs/types'
import useOpenDialog from '@/hooks/useOpenDialog'
import {
    ScrorerType,
    UpdateWhatifBetterPayload,
    UpdateWhatifResultPayload,
    UpdateWhatifScorerPayload,
    WhatifResult,
} from '@/_reducers/whatif'
import { Contestants, PlayersWithTeams, WinnerBetByUtlId } from '@/_selectors'
import AddCircle from '@mui/icons-material/AddCircle'
import { NameWithWinnerFlag } from '@/leaderboard/LeaderboardTable'
import RemoveIcon from '@mui/icons-material/RemoveCircle'
import UtlsInput from './UtlsInput'
import PlayerInput from '@/openQuestionBets/PlayerInput'
import PlayerWithImg from '@/widgets/Player'
import { eventToNumber, getPlayersData } from './utils'
import WhatifBetInput from './WhatIfBetInput'
import { Collapse } from '@mui/material'
import ArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { useSelector } from 'react-redux'

function WhatifGameView({
    game,
    resultData = {},
    bettersData = {},
    scorersData = {},
    assistsData = {},
    onResultUpdate,
    onBetUpdate,
    onScorerUpdate,
    addedScorePerUtlPerGame,
}: {
    game: Match
    resultData?: WhatifResult
    bettersData?: Record<number, WhatifResult>
    assistsData?: Record<number, number>
    scorersData?: Record<number, number>
    onResultUpdate: (data: UpdateWhatifResultPayload) => void
    onBetUpdate: (data: UpdateWhatifBetterPayload) => void
    onScorerUpdate: (data: UpdateWhatifScorerPayload) => void
    addedScorePerUtlPerGame: Record<number, Record<number, number>>
}) {
    const { id, start_time, home_team, away_team } = game
    const [newBetter, setNewBetter] = useState<number | null>(null)
    const [newPlayer, setNewPlayer] = useState<number | null>(null)
    const [expandScrores, setExpandScrores] = useState(false)
    const [expandBets, setExpandBets] = useState(true)

    const openInfoDialog = useOpenDialog(DialogName.GameScoreInfo)
    const playersData = getPlayersData({ assistsData, scorersData })

    const winnerBetByUtlId = useSelector(WinnerBetByUtlId)
    const playersById = useSelector(PlayersWithTeams)
    const utlsById = useSelector(Contestants)
    const utlsToInclude = keysOf(utlsById).filter(utlId => !bettersData[utlId])

    return (
        <div
            className={cn(
                'shadow-basic bg-white/95 max-w-full w-[400px] rounded-2xl'
            )}
        >
            <div
                className={cn(
                    'relative flex items-center py-2 px-3 bg-primaryGradient text-white  rounded-t-2xl'
                )}
            >
                <div className={cn('')}>
                    {dayjs(start_time).format(DEFAULT_DATE_FORMAT)}
                </div>
                <div className={cn('mr-2 text-lg')}>
                    {dayjs(start_time).format(DEFAULT_TIME_FORMAT)}
                </div>
                <div
                    className={cn(
                        'absolute top-0 left-0 flex items-center h-full'
                    )}
                >
                    <InfoIcon
                        onClick={() => openInfoDialog({ gameId: id })}
                        className={cn('ml-2 fill-white/80 cursor-pointer')}
                    />
                </div>
            </div>
            <WhatifBetInput
                game={game}
                resultData={resultData}
                onResultUpdate={onResultUpdate}
            />
            <div
                className={cn(
                    'w-full px-2 relative mt-2 border-0 border-t border-slate-400 border-solid'
                )}
            >
                <div
                    className={cn(
                        'flex items-center gap-5 mt-2 cursor-pointer'
                    )}
                    onClick={() => setExpandBets(!expandBets)}
                >
                    <div className={cn('text-lg font-bold cursor-pointer')}>
                        ניחושים
                    </div>
                    <ArrowDownIcon
                        className={cn('transition-all duration-200', {
                            'rotate-180': expandBets,
                        })}
                    />
                </div>
                <Collapse in={expandBets}>
                    <div>
                        {Object.entries(bettersData).map(
                            ([betterId, betterData]) =>
                                betterData ? (
                                    <div key={betterId} className={cn('')}>
                                        <div className={cn('pt-4')}>
                                            <NameWithWinnerFlag
                                                winnerBet={
                                                    winnerBetByUtlId[betterId]
                                                }
                                                name={utlsById[betterId]?.name}
                                                flagSize={24}
                                            />
                                        </div>
                                        <div
                                            key={betterId}
                                            className={cn(
                                                'mt-1 flex items-center gap-4'
                                            )}
                                        >
                                            <WhatifBetInput
                                                small
                                                game={game}
                                                resultData={betterData}
                                                onResultUpdate={(data) =>
                                                    onBetUpdate({
                                                        ...data,
                                                        utlId: Number(betterId),
                                                    })
                                                }
                                            />
                                            <div className={cn("text-sm")}>
                                                {addedScorePerUtlPerGame[game.id] ? (addedScorePerUtlPerGame[game.id][betterId] ?? '') : ''}
                                            </div>
                                            <div>
                                                <RemoveIcon
                                                    color="error"
                                                    className={cn(
                                                        'cursor-pointer'
                                                    )}
                                                    onClick={() =>
                                                        onBetUpdate({
                                                            gameId: game.id,
                                                            utlId: Number(
                                                                betterId
                                                            ),
                                                            result: undefined,
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ) : null
                        )}
                    </div>
                    <div>
                        <div className={cn('flex items-center gap-3 pt-4')}>
                            <AddCircle
                                color="primary"
                                onClick={
                                    newBetter
                                        ? () =>
                                              onBetUpdate({
                                                  gameId: game.id,
                                                  utlId: newBetter,
                                                  result: { home: 0, away: 0 },
                                              })
                                        : null
                                }
                            />
                            <UtlsInput
                                value={newBetter}
                                onChange={setNewBetter}
                                utlsToInclude={utlsToInclude.map(id => Number(id))}
                            />
                        </div>
                    </div>
                </Collapse>
            </div>
            <div
                className={cn(
                    'w-full relative p-2 mt-4 border-0 border-solid border-t border-t-slate-400'
                )}
            >
                <div
                    className={cn(
                        'flex items-center gap-5 mt-2 cursor-pointer'
                    )}
                    onClick={() => setExpandScrores(!expandScrores)}
                >
                    <div className={cn('text-lg font-bold cursor-pointer')}>
                        שערים
                    </div>
                    <ArrowDownIcon
                        className={cn('transition-all duration-200', {
                            'rotate-180': expandScrores,
                        })}
                    />
                </div>
                <Collapse in={expandScrores}>
                    <div>
                        {Object.entries(playersData).map(
                            ([playerId, playerData]) => (
                                <div
                                    key={playerId}
                                    className={cn(
                                        'flex items-center justify-between'
                                    )}
                                >
                                    <div
                                        className={cn('flex-grow flex-shrink')}
                                    >
                                        <PlayerWithImg
                                            player={playersById[playerId]}
                                        />
                                    </div>
                                    <div
                                        className={cn(
                                            'flex items-center flex-shrink-0 gap-2 mt-2'
                                        )}
                                    >
                                        <img
                                            className={cn('w-6 h-6')}
                                            src="https://cdn-icons-png.flaticon.com/512/1165/1165187.png"
                                        />
                                        <input
                                            onChange={(v) =>
                                                onScorerUpdate({
                                                    gameId: game.id,
                                                    playerId: Number(playerId),
                                                    amount: eventToNumber(v),
                                                    type: ScrorerType.GOAL,
                                                })
                                            }
                                            className={cn(
                                                'w-8 h-8 rounded-md border-solid border border-slate-400'
                                            )}
                                            type="tel"
                                            onClick={(e: any) =>
                                                e.target.select()
                                            }
                                            value={playerData.goals ?? ''}
                                        />
                                        <img
                                            className={cn('w-6 h-6')}
                                            src="https://cdn-icons-png.flaticon.com/512/5107/5107693.png"
                                        />
                                        <input
                                            onChange={(v) =>
                                                onScorerUpdate({
                                                    gameId: game.id,
                                                    playerId: Number(playerId),
                                                    amount: eventToNumber(v),
                                                    type: ScrorerType.ASSIST,
                                                })
                                            }
                                            className={cn(
                                                'w-8 h-8 rounded-md border-solid border border-slate-400'
                                            )}
                                            type="tel"
                                            onClick={(e: any) =>
                                                e.target.select()
                                            }
                                            value={playerData.assists ?? ''}
                                        />
                                        <RemoveIcon
                                            color="error"
                                            className={cn('cursor-pointer')}
                                            onClick={() => {
                                                onScorerUpdate({
                                                    gameId: game.id,
                                                    playerId: newPlayer,
                                                    amount: -Infinity,
                                                    type: ScrorerType.GOAL,
                                                })
                                                onScorerUpdate({
                                                    gameId: game.id,
                                                    playerId: newPlayer,
                                                    amount: -Infinity,
                                                    type: ScrorerType.ASSIST,
                                                })
                                            }}
                                        />
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                    <div>
                        <div className={cn('flex items-center gap-2 pt-4')}>
                            <AddCircle
                                color="primary"
                                onClick={
                                    newPlayer
                                        ? () => {
                                              onScorerUpdate({
                                                  gameId: game.id,
                                                  playerId: newPlayer,
                                                  amount: 0,
                                                  type: ScrorerType.GOAL,
                                              })
                                              onScorerUpdate({
                                                  gameId: game.id,
                                                  playerId: newPlayer,
                                                  amount: 0,
                                                  type: ScrorerType.ASSIST,
                                              })
                                          }
                                        : null
                                }
                            />
                            <div className={cn('relative flex-grow')}>
                                <PlayerInput
                                    value={newPlayer}
                                    onChange={setNewPlayer}
                                    withLabel={false}
                                    selectedTeam={home_team.id}
                                    relevantTeams={[home_team, away_team]}
                                />
                            </div>
                        </div>
                    </div>
                </Collapse>
            </div>
        </div>
    )
}

export default WhatifGameView
