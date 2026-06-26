import React from 'react'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import EditIcon from '@mui/icons-material/Edit'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import { useTranslation } from 'react-i18next'
import { BracketSide, BracketTeam } from '../types'
import { bracketTeamToTeam } from '../utils'
import TeamWithFlagVertical from '../widgets/TeamFlag/TeamWithFlagVertical'

interface Props {
    champion: BracketTeam | null
    leftTeam: BracketTeam | null
    rightTeam: BracketTeam | null
    winnerSide: BracketSide | null
    locked: boolean
    onEdit: () => void
    onReset: () => void
}

// Collapsed saved bet: the champion raised under the trophy, the two finalists inside a
// "Final"-labelled frame below. Edit / Reset are explicit icon buttons (no tap-to-edit).
function BracketPodium({ champion, leftTeam, rightTeam, winnerSide, locked, onEdit, onReset }: Props) {
    const { t } = useTranslation('knockout_bracket')

    const finalist = (team: BracketTeam | null, side: BracketSide) => (
        <div className={`Podium-finalist ${winnerSide === side ? 'is-champion' : ''}`}>
            {team ? (
                <TeamWithFlagVertical team={bracketTeamToTeam(team)} />
            ) : (
                <span className="Podium-empty">{t('select.notChosen')}</span>
            )}
        </div>
    )

    return (
        <div className='w-full mx-auto' style={{maxWidth: 360}}> 
            <h4 className='LB-TitleText'>{t('podium.heading')}</h4>
        <div className={`LB-BracketPodium ${locked ? 'is-locked' : ''}`}>
            {!locked && (
                <div className="Podium-actions">
                    <button className="Podium-action is-edit" onClick={onEdit} aria-label={t('summary.edit')}>
                        <EditIcon />
                    </button>
                    <button className="Podium-action is-reset" onClick={onReset} aria-label={t('summary.reset')}>
                        <RestartAltIcon />
                    </button>
                </div>
            )}

            <div className="Podium-champion">
                <EmojiEventsIcon className="Podium-trophy" />
                {champion ? (
                    <TeamWithFlagVertical team={bracketTeamToTeam(champion)} />
                ) : (
                    <span className="Podium-empty">{t('select.notChosen')}</span>
                )}
                <span className="Podium-championLabel">{t('special.winner')}</span>
            </div>

            {/* The two finalists, wrapped in a "Final"-labelled frame. Order is locked LTR
                (left side left, right side right) regardless of text direction. */}
            <div className="Podium-finalFrame">
                <span className="Podium-finalFrameTitle">{t('final.title')}</span>
                <div className="Podium-finalists">
                    {finalist(leftTeam, 'left')}
                    {finalist(rightTeam, 'right')}
                </div>
            </div>

            {locked && <div className="Podium-locked">🔒 {t('summary.locked')}</div>}
        </div>
        </div>
    )
}

export default BracketPodium
