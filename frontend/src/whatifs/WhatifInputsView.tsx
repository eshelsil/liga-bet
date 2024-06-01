import React from 'react'
import { MatchWithABet } from '../types'
import TakanonPreviewModal from '../tournamentConfig/takanonPreview/TakanonPreviewModal'
import MatchBetRules from '../takanon/matches/MatchBetRulesProvider'
import { groupBy } from 'lodash'
import { cn, getGameDayString } from '../utils'
import { Link } from '@mui/material'
import useGoTo from '@/hooks/useGoTo'
import { useAppDispatch } from '@/_helpers/store'
import { UpdateWhatifBetterPayload, UpdateWhatifResultPayload, UpdateWhatifScorerPayload } from '@/_reducers/whatif'
import { updateWhatifBetter, updateWhatifGameResult, updateWhatifScorerData } from '@/_actions/whatifs'
import { useSelector } from 'react-redux'
import { WhatifAddedScorePerUtlPerGame, WhatifsGamesData } from '@/_selectors'
import WhatifGameView from './WhatifGameView'



interface Props {
    matches: MatchWithABet[]
}

const WhatifInputs = ({ matches = [],  }: Props) => {
    const dispacth = useAppDispatch()
    const { goToTakanon } = useGoTo()
    const whatIfGamesData = useSelector(WhatifsGamesData)
    const addedScorePerUtlPerGame = useSelector(WhatifAddedScorePerUtlPerGame)
    const gamesWithWhatifData = matches.map((m) => ({...m, whatif:whatIfGamesData[m.id]}))
    const gamesByGameDay = groupBy(gamesWithWhatifData, g => getGameDayString(g))

    const onGameResultUpdate = (data: UpdateWhatifResultPayload) => {
        dispacth(updateWhatifGameResult(data))
    }
    const onScorerUpdate = (data: UpdateWhatifScorerPayload) => {
        dispacth(updateWhatifScorerData(data))
    }
    const onBetUpdate = (data: UpdateWhatifBetterPayload) => {
        dispacth(updateWhatifBetter(data))
    }
    return (
        <div>
            <h1 className='LB-TitleText'>ניחושים ותוצאות</h1>
            <div className='LB-FloatingFrame'>
                <ul style={{margin: 0}}>
                    <li >
                        ניתן לראות את שיטת הניקוד
                        <TakanonPreviewModal className={cn("mt-0 inline-block mr-2")} label={'בלחיצה כאן'}>
                            <MatchBetRules />
                        </TakanonPreviewModal>
                    </li>
                    <li className={cn("mt-2")}>
                        או לעבור{' '}
                        <Link
                            onClick={goToTakanon}
                        >
                            לעמוד התקנון המלא
                        </Link>
                    </li>
                </ul>
            </div>
            <div>
                {Object.entries(gamesByGameDay).map(
                    ([gameDay, games]) => {
                        const date = new Date(`${gameDay}T00:00:00`)
                        return (
                            <div key={gameDay} className={cn("py-8")}>
                                <h3 className={cn('LB-TitleText m-0 mb-2 z-index-1')}>
                                    {date.toLocaleDateString('he-IL', {weekday: 'long'})} {date.toLocaleDateString('he-IL')}
                                </h3>
                                <div className={cn("relative flex flex-wrap gap-3")}>
                                    {games.map((game) => (
                                        <WhatifGameView
                                            key={game.id}
                                            game={game}
                                            resultData={game.whatif?.result}
                                            onResultUpdate={onGameResultUpdate}
                                            bettersData={game.whatif?.betters}
                                            assistsData={game.whatif?.assists}
                                            scorersData={game.whatif?.scorers}
                                            onBetUpdate={onBetUpdate}
                                            onScorerUpdate={onScorerUpdate}
                                            addedScorePerUtlPerGame={addedScorePerUtlPerGame}
                                        />
                                    ))}
                                </div>
                            </div>
                        )
                    }
                )}
            </div>
        </div>
    )
}

export default WhatifInputs
