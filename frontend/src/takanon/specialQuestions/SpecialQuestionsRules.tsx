import React from 'react'
import { useTranslation } from 'react-i18next'
import TeamAchivementRules from './TeamAchivementRules'
import TopScorerRules from './TopScorerRules'
import MostAssistsRules from './MostAssistsRules'
import MvpRules from './MvpRules'
import OffensiveTeamRules from './OffensiveTeamRules'
import { useSelector } from 'react-redux'
import { FormattedSpecialQuestionsScoreConfig } from '../../_selectors'


function SpecialQuestionsRules() {
    const { t } = useTranslation('takanon')
    const config = useSelector(FormattedSpecialQuestionsScoreConfig)
    return (
        <div className="takanonTextSection">
            <h4 style={{marginBottom: 24}}>{t('specialQuestions.heading')}</h4>
            {config?.winner && (<>
                <TeamAchivementRules label={t('specialQuestions.winnerLabel')} scoreConfig={config.winner} />
                <br/>
            </>)}
            {config?.runnerUp && (<>
                <TeamAchivementRules label={t('specialQuestions.runnerUpLabel')} scoreConfig={config.runnerUp} isRunnerUp />
                <br/>
            </>)}
            {config?.topScorer && (<>
                <TopScorerRules scoreConfig={config.topScorer} />
                <br/>
            </>)}
            {config?.topAssists && (<>
                <MostAssistsRules scoreConfig={config.topAssists} />
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
