import React, { useEffect, useState } from 'react'
import { MatchesWithTeams, MyActiveNihus, } from '../_selectors'
import { useSelector } from 'react-redux'
import { cn } from '@/utils'
import { useAppDispatch } from '@/_helpers/store'
import { Button } from '@mui/material'
import { markSeenNihus } from '@/_actions/nihusim'
import { Nihus, NihusWithRelations } from '@/types'
import { set } from 'lodash'
import TeamWithFlag from '@/widgets/TeamFlag/TeamWithFlag'
import TeamFlag from '@/widgets/TeamFlag/TeamFlag'


export const LOCK_SCREEN_SECONDS = 30
const GOT_IT_SECONDS = 0.5

export interface NihusStickerProps {
    nihus: Pick<NihusWithRelations, 'game' | 'bet' | 'targetedUtl' | 'senderUtl' | 'text' | 'gif' | 'id'>
    blocking: boolean
    showTargetUtl?: boolean
    onQuit: () => void
}

const NihusSticker = ({nihus, showTargetUtl = false, blocking = false, onQuit}: NihusStickerProps) => {
    const [shown, setShown] = useState(false)
    const [imgLoaded, setImgLoaded] = useState(false)
    const [canQuit, setCanQuit] = useState(false)
    const [animationDone, setAnimationDone] = useState(false)
    const [quitAnimation, setQuitAnimation] = useState(false)

    const {game, bet, targetedUtl, senderUtl, gif, text,  id: nihusId} = nihus

    const onAnimationExit = () => {
        setQuitAnimation(true);
        setTimeout(onQuit, 500);
    }

    useEffect(()=>{
        if (imgLoaded){
            setTimeout(()=>{
                setShown(true)
            }, 100)
            setTimeout(()=>{
                setCanQuit(true)
            }, (blocking ? LOCK_SCREEN_SECONDS : GOT_IT_SECONDS) * 1000)
            setTimeout(()=>{
                setAnimationDone(true)
            }, 2 * 1000)
        }
    }, [imgLoaded, nihusId])

    const reset = () => {
        setShown(false)
        setCanQuit(false)
        setAnimationDone(false)
        setQuitAnimation(false)
    
    }

    useEffect(()=>{
        if (nihusId){
            reset()
        }
    }, [nihusId])


    return (
        <>
            {nihusId && (
                <div key={nihusId} className={cn("fixed h-full w-full top-0 left-0 z-[3000] opacity-1 transition-all duration-500", {'opacity-0 z-[-1]': !shown, 'top-full opacity-50': quitAnimation})}>
                    <div className={cn("h-full w-full bg-black/90")}>
                        <div className={cn(
                            "absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2",
                            "h-[90%] w-[90%]",
                            "transition-all duration-1000 ease-in ",
                            "scale-0 rotate-0",
                            {"scale-100 rotate-[1080deg]": shown}
                        )} style={{animationDuration: '2s'}}>
                            <div className={cn("relative h-full w-full")}>
                                <div className={cn("absolute h-full max-h-fit w-full top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 ")}>
                                    <div className={cn("relative h-full flex flex-col")}>
                                        {showTargetUtl && (
                                        <div className={cn("relative w-full text-center text-white shadow-text underline mb-4")} style={{fontSize: 20}}>
                                            {targetedUtl.name} קיבל ניחוס
                                        </div>
                                        )}

                                        <div className={cn("relative w-full flex items-center justify-center gap-5")}>
                                            <div className={cn("flex items-center gap-3")}>
                                                <TeamFlag team={game.home_team} size={64} />
                                                <div className={cn("text-white shadow-text")} style={{fontSize: 32}}>
                                                    {bet.result_home}
                                                </div>
                                            </div>
                                            <div className={cn("text-white shadow-text")} style={{fontSize: 32}}>
                                                -
                                            </div>
                                            <div className={cn("flex items-center gap-3")}>
                                                <div className={cn("text-white shadow-text")} style={{fontSize: 32}}>
                                                    {bet.result_away}
                                                </div>
                                                <TeamFlag team={game.away_team} size={64} />
                                            </div>

                                        </div>
                                        <div>
                                            <p className={cn("mt-5 text-white shadow-text text-center mb-6")} style={{fontSize: 24}}>
                                                {text}
                                            </p>
                                        </div>

                                        <div className={cn("flex-grow relative")}>
                                            <div className={cn("relative h-full w-full")}>
                                            <div className={cn("absolute h-full w-full")}>
                                            <div className={cn("flex justify-center relative h-full w-full max-h-fit")}>

                                                <img src={`/img/stickers/${gif}`} onLoad={()=>setImgLoaded(true)} className={cn("w-fit h-full max-h-fit")} />
                                            </div>
                                            </div>
                                            </div>
                                        </div>
                                        <div className={cn("relative w-full mt-2")}>
                                            <p className={cn("text-white shadow-text ")} style={{fontSize:14}}>
                                                מאת: {senderUtl.name}
                                            </p>
                                            {animationDone && canQuit && (
                                                <div className={cn("absolute top-0 w-full flex justify-center")}>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={onAnimationExit}
                                                    >
                                                        נו.... יאללה
                                                    </Button>

                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default NihusSticker
