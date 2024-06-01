import React from 'react'
import { Match } from '../types'
import { getWinnerSide } from '../utils/index'
import { cn } from '@/utils'
import TeamFlag from '@/widgets/TeamFlag/TeamFlag'
import { UpdateWhatifResultPayload, WhatifResult } from '@/_reducers/whatif'
import KoWinnerInputNullable from '@/widgets/koWinnerInput/KoWinnerInputNullable'
import { eventToNumber } from './utils'



function WhatifBetInput({
    game,
    resultData,
    onResultUpdate,
    small = false,
}: {
    game: Match
    small?: boolean
    resultData?: WhatifResult,
    onResultUpdate: (data: UpdateWhatifResultPayload) => void,
}) {
    const { id, home_team, away_team, } = game
    const { home: homeScore, away: awayScore, qualifier } = resultData ?? {};

    const winnerSide = getWinnerSide(homeScore, awayScore, qualifier)
    const onEditScore = (data: Partial<WhatifResult>) => {
        onResultUpdate({gameId: id, result: {...resultData, qualifier: winnerSide, ...data, }})
    }




    return (
        <div className={cn('flex items-center justify-between gap-4 p-4', {'p-0 gap-2': small})}>
            <TeamFlag team={home_team} size={small ? 24 : 50}/>
            <input
                onChange={(v) => onEditScore({home: eventToNumber(v)})}
                className={cn('w-8 h-8 rounded-md border-solid border border-slate-400')}
                type="tel"
                onClick={(e: any) => e.target.select()}
                value={homeScore ?? ''}
            />
            <KoWinnerInputNullable disabled={homeScore > awayScore || homeScore < awayScore} value={winnerSide ?? qualifier} setValue={(qualifier) => {onEditScore({qualifier: qualifier ?? undefined})}}/>
            <input
                onChange={(v) => onEditScore({away: eventToNumber(v)})}
                className={cn('w-8 h-8 rounded-md border-solid border border-slate-400')}
                type="tel"
                onClick={(e: any) => e.target.select()}
                value={awayScore ?? ''}
            />
            <TeamFlag team={away_team} size={small ? 24 : 50}/>
        </div>
    )
}

export default WhatifBetInput
