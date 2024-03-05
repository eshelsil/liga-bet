import React from 'react'
import { useSelector } from 'react-redux'
import { CanSendNihus, CurrentTournamentUserId, CurrentUtlName, IsOnNihusim } from '../_selectors'
import './GumblersList.scss'
import { cn } from '@/utils'
import { TomatoIcon } from '@/widgets/icons'


interface Props {
    gumblers: {name: string, id: number}[],
    showNihusable?: boolean
    onNihusClick?: (targetUtlId: number) => void
}

function GumblersList({ gumblers, showNihusable, onNihusClick }: Props) {
    const utlId = useSelector(CurrentTournamentUserId)

    return (
        <div className='LB-GumblersList'>
            {gumblers.map(gumbler => (
                <div key={gumbler.id} className={`GumblersList-gumbler ${gumbler.id === utlId ? 'GumblersList-currentUtl' : ''}`}>
                    <div className={cn("flex items-center")}>
                        <div>
                            {gumbler.name}
                        </div>
                        {/* {showNihusable && (gumbler.id !== utlId) && ( */}
                        {showNihusable &&  (
                            <TomatoIcon
                                className={cn("w-8 h-8 mr-1 my-1 cursor-pointer")}
                                onClick={() => onNihusClick(gumbler.id)}
                            />
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default GumblersList