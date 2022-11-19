import React from 'react'
import { useSelector } from 'react-redux';
import { MatchesWithTeams } from '../_selectors';
import TeamFlag from '../widgets/TeamFlag/TeamFlag';


interface Props {
    description: string,
    order: number,
}

function LeaderboardVersionDisplay({
    description,
    order,
}: Props) {
    const data = JSON.parse(description)
    const gamesById = useSelector(MatchesWithTeams)
    const { game: gameId } = data || {}
    const game = gamesById[gameId]

    if (!game) {
        return (
            <>
                {description}
            </>
        )
    }

    return (
        <div className={`LB-LeaderboardVersionDisplay`}>
            {!game && (<>
                {description}
            </>)}
            {game && (
                <div className='VersionDisplay'>
                    <span>({order}) </span>
                    <span>סוף משחק</span>
                    <TeamFlag name={game.home_team.name} size={24} />
                    <span>-</span>
                    <TeamFlag name={game.away_team.name} size={24} />
                </div>
            )}
        </div>
    )
}

export default LeaderboardVersionDisplay
