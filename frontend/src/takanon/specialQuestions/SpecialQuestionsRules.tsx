import React from 'react'
import TeamAchivementRules from './TeamAchivementRules'
import TopScorerRules from './TopScorerRules'
import MostAssistsRules from './MostAssistsRules'
import MvpRules from './MvpRules'
import OffensiveTeamRules from './OffensiveTeamRules'

function SpecialQuestionsRules({ config }) {
    return (
        <div className="text-part">
            <h4>הימורים מיוחדים</h4>
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
            {config?.mostAssits && (<>
                <MostAssistsRules score={config.mostAssits} />
                <br/>
            </>)}
            {config?.mvp && (<>
                <MvpRules score={config.mvp} />
                <br/>
            </>)}
            {config?.offensiveTeamGroupStage && (<>
                <OffensiveTeamRules score={config.offensiveTeamGroupStage} />
                <br/>
            </>)}
        </div>
    )
}

export default SpecialQuestionsRules
