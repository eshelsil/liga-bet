import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@mui/material'
import { BracketScoreConfig, GameSubType, TournamentScoreConfig } from '../../types'
import { subTypeToKnockoutStage } from '../../utils'
import { getStageName } from '../../strings/stages'
import { LoadingButton } from '../../widgets/Buttons'
import useGoTo from '../../hooks/useGoTo'
import { useBracketScores } from '../../bracket/useBracket'
import SectionTitle from './SectionTitle'
import ScoreInput from './ScoreInput'
import './ScoresConfig.scss'

const ROUND_ORDER = Object.values(GameSubType) as GameSubType[]

interface Props {
    updateScoreConfig: (config: TournamentScoreConfig) => Promise<void>
}

type RoundScores = Record<string, number>
type SetScores = (updater: (prev: RoundScores) => RoundScores) => void

// Admin editor for knockout_bracket scoring (contract F). Same look as the classic
// Scores Config page — just fewer sections: points-per-round for the qualifier pick
// (incl. THIRD_PLACE) and the Winner/Runner-Up advance bonus (no THIRD_PLACE). The set
// of rounds is competition-derived (from the existing config), not editable here.
function BracketScoresConfigPage({ updateScoreConfig }: Props) {
    const { t } = useTranslation('tournamentConfig')
    const { goToTournamentConfig } = useGoTo()
    const scores = useBracketScores()

    const [qualifier, setQualifier] = useState<RoundScores>(() => ({ ...scores.qualifier }))
    const [specialAdvance, setSpecialAdvance] = useState<RoundScores>(() => ({ ...scores.specialAdvance }))

    const qualifierRounds = ROUND_ORDER.filter((r) => r in qualifier)
    const advanceRounds = ROUND_ORDER.filter((r) => r in specialAdvance)

    const save = async () => {
        const bracket: BracketScoreConfig = { qualifier, specialAdvance }
        // knockout scores carry only `bracket`; the backend stores it under scores.bracket.
        await updateScoreConfig({ bracket } as TournamentScoreConfig)
        ;(window as any).toastr['success'](t('scoreConfigForm.updateSuccess'))
    }

    const scoresTable = (rounds: GameSubType[], values: RoundScores, setValues: SetScores) => (
        <table className="LB-simpleTable">
            <tbody>
                {rounds.map((round) => (
                    <tr key={round}>
                        <td className="configLabel">{getStageName(subTypeToKnockoutStage(round))}</td>
                        <td>
                            <ScoreInput
                                value={values[round] ?? 0}
                                onChange={(e) =>
                                    setValues((prev) => ({
                                        ...prev,
                                        [round]: Math.max(0, Number(e.target.value)),
                                    }))
                                }
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )

    return (
        <div className="LB-ScoresConfigPage">
            <div className="ScoresConfigPage-header">
                <h1 className="title LB-TitleText">{t('bracketScoresConfig.title')}</h1>
                <div className="LB-FloatingFrame" style={{ paddingRight: 0, paddingBottom: 2 }}>
                    <ul>
                        <li>{t('scoresConfigPage.warning')}</li>
                    </ul>
                </div>
                <div className="scoreFormContainer">
                    <h3 className="scoreFormTitle LB-TitleText">{t('scoresConfigPage.scoreSettings')}</h3>

                    {/* Same wrapper as the classic form so the shared section/input styles apply. */}
                    <div className="LigaBet-ScoreConfigFormView">
                        <div className="LigaBet-BracketScoresConfig LB-ConfigBox">
                            <SectionTitle
                                title={t('bracketScoresConfig.qualifier')}
                                tooltipContent={t('bracketScoresConfig.qualifierTooltip')}
                            />
                            {scoresTable(qualifierRounds, qualifier, setQualifier)}
                        </div>

                        <div className="LigaBet-BracketScoresConfig LB-ConfigBox">
                            <SectionTitle
                                title={t('bracketScoresConfig.specialAdvance')}
                                tooltipContent={t('bracketScoresConfig.specialAdvanceTooltip')}
                            />
                            {scoresTable(advanceRounds, specialAdvance, setSpecialAdvance)}
                        </div>

                        <div className="saveScoresButton">
                            <LoadingButton action={save}>{t('scoreConfigForm.update')}</LoadingButton>
                        </div>
                    </div>

                    <Button
                        variant="contained"
                        onClick={goToTournamentConfig}
                        style={{ backgroundColor: 'rgb(200,200,200)', color: '#000' }}
                    >
                        {t('scoresConfigPage.back')}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default BracketScoresConfigPage
