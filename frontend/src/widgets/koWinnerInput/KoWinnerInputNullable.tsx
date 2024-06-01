import React from 'react'
import { WinnerSide } from '@/types'
import { cn } from '@/utils'
import { ArrowBack, ArrowLeft, ArrowRight } from '@mui/icons-material'

interface Props {
    value: WinnerSide | null
    setValue: (side: WinnerSide | null) => void
    disabled?: boolean
}

function WinnerSideButton({
    side,
    isOn,
    onChange,
    disabled,
}: {
    side: WinnerSide
    isOn: boolean
    disabled?: boolean
    onChange: (side: WinnerSide | null) => void
}) {
    const isHomeSide = side === WinnerSide.Home

    return (
        <div
            className={cn(
                'cursor-pointer border border-solid border-black/30',
                'flex items-center justify-center w-8 h-8',
                'transition-colors duration-300',
                {
                    'rounded-r-xl': isHomeSide,
                    'rounded-l-xl border-r-0': !isHomeSide,
                    'cursor-default': disabled,
                    'bg-primaryMain': isOn,
                }
            )}
        >
            <ArrowBack
                onClick={disabled ? null : () => onChange(isOn ? null : side)}
                className={cn(
                    'transition-colors duration-300',
                    { 'rotate-180': isHomeSide },
                    { 'fill-white stroke-white': isOn }
                )}
            />
        </div>
    )
}

function KoWinnerInputNullable({ value, setValue, disabled = false }: Props) {
    const onChange = (winner: WinnerSide | null) => {
        setValue(winner)
    }

    const isHomeWinner = value === WinnerSide.Home
    const isAwayWinner = value === WinnerSide.Away

    return (
        <div
            className={cn('flex items-center ', {
                'opacity-80 grayscale-[0.2]': disabled,
            })}
        >
            <WinnerSideButton
                side={WinnerSide.Home}
                isOn={isHomeWinner}
                onChange={onChange}
                disabled={disabled}
            />
            <WinnerSideButton
                side={WinnerSide.Away}
                isOn={isAwayWinner}
                onChange={onChange}
                disabled={disabled}
            />
        </div>
    )
}

export default KoWinnerInputNullable
