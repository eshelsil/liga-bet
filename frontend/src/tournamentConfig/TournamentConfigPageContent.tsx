import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from '@mui/material'
import PrizesConfig from './prizes/PrizesConfigProvider'
import EnableAutoBetSelection from '../manageContestants/EnableAutoBetSelection'
import TakanonPreviewModal from './takanonPreview/TakanonPreviewModal'
import AutoBetExplanation from '../takanon/AutoBetExplanation'
import { updateAutoBetPreference } from '../_actions/tournament'
import { IsTournamentStarted } from '../_selectors'
import { AppDispatch } from '../_helpers/store'

interface Props {
    onGoToScoresClick: () => void
}

function TournamentConfigPageContent({ onGoToScoresClick }: Props) {
    const { t } = useTranslation('tournamentConfig')
    const dispatch = useDispatch<AppDispatch>()
    const isTournamentStarted = useSelector(IsTournamentStarted)
    const updateAutoBetPref = (value: boolean) =>
        dispatch(updateAutoBetPreference(value))

    return (
        <div className="LB-TournamentConfigPageContent">
            <PrizesConfig />

            {!isTournamentStarted && (
                <>
                    <div className="LB-FloatingFrame autoBetConfigFrame">
                        <EnableAutoBetSelection
                            updateAutoBetPref={updateAutoBetPref}
                        />
                        <TakanonPreviewModal label={t('pageContent.whatDoesThisMean')} className='!m-0 whitespace-nowrap'>
                            <AutoBetExplanation />
                        </TakanonPreviewModal>
                    </div>

                    <div className="forgotSomething LB-FloatingFrame">
                        <h5>{t('pageContent.forgotSomething')}</h5>
                        <Link
                            className={'linkToScoresConfig'}
                            onClick={onGoToScoresClick}
                        >
                            {t('pageContent.editScoreSettings')}
                        </Link>
                    </div>
                </>
            )}
        </div>
    )
}

export default TournamentConfigPageContent
