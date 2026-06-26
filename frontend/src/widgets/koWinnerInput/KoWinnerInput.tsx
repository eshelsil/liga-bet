import React from 'react'
import { useTranslation } from 'react-i18next'
import { WinnerSide } from '../../types'
import './KoWinnerInput.scss'


interface Props {
    value: WinnerSide
    setValue: (side: WinnerSide | null) => void
    isTwoLegKo?: boolean
    isMissing?: boolean
    disabled?: boolean
    onlyDisplay?: boolean
}

function KoWinnerInput({ value, setValue, isTwoLegKo = false, isMissing = false, disabled = false, onlyDisplay = false }: Props) {
    const { t } = useTranslation('widgets')
    const onChange = (winner: WinnerSide) => {
        setValue(winner)
    }
    const setHomeWinner = () => onChange(WinnerSide.Home)
    const setAwayWinner = () => onChange(WinnerSide.Away)

    const isHomeWinner = value === WinnerSide.Home
    const isAwayWinner = value === WinnerSide.Away

    return (
        <div className={`LB-KoWinnerInput ${onlyDisplay ? 'KoWinnerInput-displayOnly' : ''} ${isTwoLegKo ? 'KoWinnerInput-twoLegKo' : ''} ${disabled ? 'KoWinnerInput-disabled' : ''}`}>
            <div className="KoWinnerInput-content">
                <div
                    className={`KoWinnerInput-side KoWinnerInput-home ${isHomeWinner ? 'KoWinnerInput-selected' : ''}`}
                    onClick={(disabled || onlyDisplay) ? null : setHomeWinner}
                >
                    <div className='KoWinnerInput-button'>
                        ✌️
                    </div>
                </div>
                <div className={`KoWinnerInput-delimiter`}>
                    {t('koWinnerInput.qualifier')} {
                        isMissing ? (
                            <span style={{position: 'absolute', fontSize: 12, opacity:0.5, marginInlineStart: 12, lineHeight: '24px'}}>{t('koWinnerInput.missing')}</span>
                        ): null
                    }
                </div>
                <div
                    className={`KoWinnerInput-side KoWinnerInput-away ${isAwayWinner ? 'KoWinnerInput-selected' : ''}`}
                    onClick={(disabled || onlyDisplay) ? null : setAwayWinner}
                >
                    <div className='KoWinnerInput-button'>
                        ✌️
                    </div>
                </div>
            </div>
        </div>
    )
}

export default KoWinnerInput
