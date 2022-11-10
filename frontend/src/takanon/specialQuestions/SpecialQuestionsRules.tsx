import React from 'react'
import TeamAchivementRules from './TeamAchivementRules'
import TopScorerRules from './TopScorerRules'
import MostAssistsRules from './MostAssistsRules'
import MvpRules from './MvpRules'
import OffensiveTeamRules from './OffensiveTeamRules'
import { SpecialQuestionBetScoreConfig } from '../../types'


interface Props {
    config: SpecialQuestionBetScoreConfig
}

function SpecialQuestionsRules({ config }: Props) {
    return (
        <div className="takanonTextSection">
            <h4 style={{marginBottom: 24}}>הימורים מיוחדים</h4>
            {config?.winner && (<>
                <TeamAchivementRules label={'זוכה'} scoreConfig={config.winner} />
                <br/>
            </>)}
            {config?.runnerUp && (<>
                <TeamAchivementRules label={'סגנית'} scoreConfig={config.runnerUp} />
                <br/>
            </>)}
            {config?.topScorer && (<>
                <TopScorerRules scoreConfig={config.topScorer} />
                <br/>
            </>)}
            {config?.topAssists && (<>
                <MostAssistsRules score={config.topAssists} />
                <br/>
            </>)}
            {config?.mvp && (<>
                <MvpRules score={config.mvp} />
                <br/>
            </>)}
            {config?.offensiveTeam && (<>
                <OffensiveTeamRules score={config.offensiveTeam} />
                <br/>
            </>)}
        </div>
    )
}

export default SpecialQuestionsRules
