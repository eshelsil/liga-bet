import React from 'react'
import { useSelector } from 'react-redux'
import { CurrentTournamentUserId } from '../_selectors'
import { cn } from '@/utils'
import { TomatoIcon } from '@/widgets/icons'
import { Dictionary } from '@reduxjs/toolkit'
import { Nihus } from '@/types'
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useSelectNihusView } from '@/nihusim/context'
import './GumblersList.scss'



interface GumblerProps {
    gumbler: {name: string, id: number},
    showNihusable?: boolean
    onNihusClick?: (targetUtlId: number) => void
    showNihus?: (nihusId: number) => void
    nihusimByTargetUtlId?: Dictionary<Nihus[]>
}

export function GumblerRow({gumbler, showNihusable, showNihus, onNihusClick, nihusimByTargetUtlId = {}}: GumblerProps){
    const utlId = useSelector(CurrentTournamentUserId)
    return (
        <div className={`GumblersList-gumbler ${gumbler.id === utlId ? 'GumblersList-currentUtl' : ''}`}>
            <div className={cn("flex items-center")}>
                <div>
                    {gumbler.name}
                </div>
                {showNihusable && (gumbler.id !== utlId) && !(nihusimByTargetUtlId[gumbler.id]) && (
                    <TomatoIcon
                        className={cn("w-8 h-8 mr-1 my-1 cursor-pointer")}
                        onClick={() => onNihusClick && onNihusClick(gumbler.id)}
                    />
                )}
                {(nihusimByTargetUtlId[gumbler.id] ?? []).map(nihus =>  (
                    <VisibilityIcon
                        key={nihus.id}
                        className={cn("w-6 h-6 mr-1 my-1 cursor-pointer")}
                        onClick={() => showNihus(nihus.id)}
                    />
                ))}
            </div>
        </div>

    )
}

interface Props extends Omit<GumblerProps, 'gumbler' | 'showNihus'> {
    gumblers: {name: string, id: number}[],
}

function GumblersList({ nihusimByTargetUtlId, gumblers, showNihusable, onNihusClick }: Props) {
    const showNihus = useSelectNihusView()
    return (
        <div className='LB-GumblersList'>
            {gumblers.map(gumbler => (
                <GumblerRow key={gumbler.id} showNihus={showNihus} gumbler={gumbler} showNihusable={showNihusable} onNihusClick={onNihusClick} nihusimByTargetUtlId={nihusimByTargetUtlId} />
            ))}
        </div>
    )
}

export default GumblersList