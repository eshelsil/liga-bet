import React, { useState } from 'react'
import SimpleTabs from '../widgets/Tabs/Tabs'
import GameView from './GameView'
import { Pagination } from '@mui/material'
import { GameBetsFetchType, GameWithBetsAndGoalsData } from '../types'
import { map } from 'lodash'
import { useGameBets } from '../hooks/useFetcher'
import { LoadingButton } from '../widgets/Buttons'
import { useLiveUpdate } from '../hooks/useLiveUpdate'
import '../styles/closedBets/GumblersTable.scss'
import './GamesView.scss'


const GAMES_PER_PAGE = 10

function DoneGamesView({games}: {games: GameWithBetsAndGoalsData[]}){
    const pagesCount = Math.ceil(games.length / GAMES_PER_PAGE)
    const [page, setPage] = React.useState(1);
    
    const startIndex = (page - 1) * GAMES_PER_PAGE
    const gamesToShow = games.slice(startIndex, startIndex + GAMES_PER_PAGE)

    useGameBets({type: GameBetsFetchType.Games, ids: map(gamesToShow, 'id')})
    
    const handlePageChange = (event: any, value: number) => {
        setPage(value);
    };

    return (
        <div className='LB-DoneGamesView'>
            {pagesCount > 1 && (
                <div className='LB-FloatingFrame DoneViewGames-pagination'>
                    <Pagination color='primary' count={pagesCount} onChange={handlePageChange}/>
                </div>
            )}
            {gamesToShow.map((game) => (
                <GameView key={game.id} match={game} withExpand />
            ))}
        </div>
    )
}

function LiveGamesView({games}: {games: GameWithBetsAndGoalsData[]}){
    const { refresh } = useLiveUpdate()

    
    return (
        <div>
            <LoadingButton
                action={refresh}
            >
                רענן משחקים
            </LoadingButton>
            {games.map((game) => (
                <GameView key={game.id} match={game} isLive={true} />
            ))}
        </div>
    )
}

const MatchesView = ({
    done_matches,
    live_matches,
}: {
    done_matches: GameWithBetsAndGoalsData[]
    live_matches: GameWithBetsAndGoalsData[]
}) => {
    const [selectedTab, setSelectedTab] = useState(0)
    
    return (
        <div className='LB-GamesView'>
            <h2 className='LB-TitleText'>רשימת משחקים</h2>
            <div>
                <SimpleTabs
                    tabs={[
                        {
                            id: 'live',
                            label: 'משחקים נוכחיים',
                            children: (
                                <LiveGamesView games={live_matches} />
                            )
                        },
                        {
                            id: 'finished',
                            label: 'משחקים שנגמרו',
                            children: (
                                <DoneGamesView games={done_matches} />
                            )
                        }
                    ]}
                    index={selectedTab}
                    onChange={setSelectedTab}
                />
            </div>
        </div>
    )
}

export default MatchesView
