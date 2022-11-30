import React from 'react'
import { WinnerSide } from '../../types'
import './KoWinnerInput.scss'


interface Props {
    value: WinnerSide
    setValue: (side: WinnerSide | null) => void
    onlyDisplay?: boolean
}

function KoWinnerInput({ value, setValue, onlyDisplay = false }: Props) {
    console.log({value});
    const onChange = (winner: WinnerSide) => {
        setValue(winner)
    }
    const setHomeWinner = () => onChange(WinnerSide.Home)
    const setAwayWinner = () => onChange(WinnerSide.Away)

    const isHomeWinner = value === WinnerSide.Home
    const isAwayWinner = value === WinnerSide.Away

    return (
        <div className={`LB-KoWinnerInput ${onlyDisplay ? 'KoWinnerInput-displayOnly' : ''}`}>
            <div className="KoWinnerInput-content">
                <div
                    className={`KoWinnerInput-side KoWinnerInput-home ${isHomeWinner ? 'KoWinnerInput-selected' : ''}`}
                    onClick={onlyDisplay ? null : setHomeWinner}
                >
                    <div className='KoWinnerInput-button'>
                        ✌️
                    </div>
                </div>
                <div className={`KoWinnerInput-delimiter`}>
                    מעפילה
                </div>
                <div
                    className={`KoWinnerInput-side KoWinnerInput-away ${isAwayWinner ? 'KoWinnerInput-selected' : ''}`}
                    onClick={onlyDisplay ? null : setAwayWinner}
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
