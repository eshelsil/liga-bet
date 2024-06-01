import React from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/_helpers/store'
import { updateWhatifsIsOn } from '@/_actions/whatifs'
import LinkMenuItem from './LinkMenuItem'
import { default as WhatifIcon } from '@/svgs/thoughts_bubble.svg';
import { cn } from '@/utils'
import { Close } from '@mui/icons-material'
import { routesMap } from './routes'


function WhatifMenu() {
    const dispatch = useDispatch<AppDispatch>()
    const exitWhatif = () => {
        dispatch(updateWhatifsIsOn(false))
    }

    return (
        <div className={cn("w-full flex items-center justify-between py-2 bg-primaryGradient")}>
            
            <div className={cn("flex items-center")}>
                <LinkMenuItem
                    route={routesMap['open-matches']}
                    content="ניחושים ותוצאות"
                />
                <LinkMenuItem
                    route={routesMap['leaderboard']}
                    content="טבלה"
                />
            </div>
            <div className={cn("flex items-center gap-2 px-2")}>
                <Close onClick={exitWhatif} className={cn("cursor-pointer fill-white stroke-white")} />
                <WhatifIcon className={cn("w-6 h-6 stroke-white fill-white")} />
            </div>
        </div>
    )
}

export default WhatifMenu
