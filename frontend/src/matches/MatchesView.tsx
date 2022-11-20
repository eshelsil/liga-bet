import React, { useState } from 'react'
import { MatchWithBets } from '../_selectors'
import SimpleTabs from '../widgets/Tabs/Tabs'
import GameGumblersList from './GameGumblersList'
import { Pagination } from '@mui/material'
import { GameBetsFetchType } from '../types'
import { map } from 'lodash'
import { useGameBets, useGames } from '../hooks/useFetcher'
import { LoadingButton } from '../widgets/Buttons'
import './GamesView.scss'
import '../styles/closedBets/GumblersTable.scss'
import { pingUpdateCompetition } from '../api/matches'


const GAMES_PER_PAGE = 10

function DoneGamesView({games}: {games: MatchWithBets[]}){
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
                <GameGumblersList key={game.id} match={game} withExpand />
            ))}
        </div>
    )
}

function LiveGamesView({games}: {games: MatchWithBets[]}){
    useGameBets({type: GameBetsFetchType.Games, ids: map(games, 'id')})
    const { refresh } = useGames()
    const onRefresh = async() => {
        pingUpdateCompetition()
        await refresh()
    }

    
    return (
        <div>
            <LoadingButton
                action={onRefresh}
            >
                רענן משחקים
            </LoadingButton>
            {games.map((game) => (
                <GameGumblersList key={game.id} match={game} />
            ))}
        </div>
    )
}

const MatchesView = ({
    done_matches,
    live_matches,
}: {
    done_matches: MatchWithBets[]
    live_matches: MatchWithBets[]
}) => {
    const [selectedTab, setSelectedTab] = useState(0)
    
    return (
        <div className='LB-GamesView'>
            <h1 className='LB-TitleText'>רשימת משחקים</h1>
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
