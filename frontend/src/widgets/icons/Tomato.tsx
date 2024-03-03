import { cn } from '@/utils'
import React, { useState } from 'react'



function TomatoIcon({className, ...props}: React.HTMLAttributes<HTMLImageElement>) {
    const [loaded, setLoaded] = useState(false)

    return (
        <img className={cn("w-8 h-8", {'hidden': !loaded}, className)} onLoad={() =>setLoaded(true)} src='/img/smashed_tomato_4.png' {...props}/>
    )
}

export default TomatoIcon
