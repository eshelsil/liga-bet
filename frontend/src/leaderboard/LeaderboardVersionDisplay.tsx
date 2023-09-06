import React from 'react'
import TeamFlag from '../widgets/TeamFlag/TeamFlag';
import { LeaderboardVersionWithGame } from '../types';
import { getHebGameStage, getHebTeamName } from '../strings';


interface Props {
    version: LeaderboardVersionWithGame
}

function LeaderboardVersionDisplay({version}: Props) {
    const {game, description, order} = version

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
                <div className='VersionDisplay-game'>
                    <div className='VersionDisplay-gameHeader'>
                        <span>
                            סוף משחק - <b>{getHebGameStage(game)}</b>
                        </span>
                        <span className='VersionDisplay-order'>
                            <span>.</span><span>{order}</span>
                        </span>
                    </div>
                    <div className='VersionDisplay-gameContent'>
                        <div className='VersionDisplay-teamWrapper'>
                            <div className='VersionDisplay-team'>
                                <span className='VersionDisplay-score'>{game.full_result_home || game.result_home}</span>
                                <TeamFlag team={game.home_team} size={24} />
                                <div className='VersionDisplay-teamName'>{getHebTeamName(game.home_team.name)}</div>
                            </div>
                        </div>
                        <span className='VersionDisplay-delimiter'>-</span>
                        <div className='VersionDisplay-teamWrapper'>
                            <div className='VersionDisplay-team'>
                                <span className='VersionDisplay-score'>{game.full_result_away || game.result_away}</span>
                                <TeamFlag team={game.away_team} size={24} />
                                <div className='VersionDisplay-teamName'>{getHebTeamName(game.away_team.name)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default LeaderboardVersionDisplay
