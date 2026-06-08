import React from 'react'
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
                        <TakanonPreviewModal label="מזה אומר?" className='!m-0 whitespace-nowrap'>
                            <AutoBetExplanation />
                        </TakanonPreviewModal>
                    </div>

                    <div className="forgotSomething LB-FloatingFrame">
                        <h5>שכחת משהו?</h5>
                        <Link
                            className={'linkToScoresConfig'}
                            onClick={onGoToScoresClick}
                        >
                            ערוך הגדרות ניקוד
                        </Link>
                    </div>
                </>
            )}
        </div>
    )
}

export default TournamentConfigPageContent
