import React, { useEffect, useState } from 'react'
import { CurrentTournamentUser, EverGrantedNihus, MyActiveNihus, } from '../_selectors'
import { useSelector } from 'react-redux'
import { cn } from '@/utils'
import { useAppDispatch } from '@/_helpers/store'
import { Button } from '@mui/material'
import { markSeenNihus } from '@/_actions/nihusim'


const NihusSticker = () => {
    const nihus = useSelector(MyActiveNihus)
    const dispatch  = useAppDispatch()
    const [shown, setShown] = useState(false)
    const [imgLoaded, setImgLoaded] = useState(false)
    const [canQuit, setCanQuit] = useState(false)
    const [animationDone, setAnimationDone] = useState(false)
    const onQuit = () => dispatch(markSeenNihus(nihus?.id))

    useEffect(()=>{
        if (imgLoaded){
            setTimeout(()=>{
                setShown(true)
            }, 100)
            setTimeout(()=>{
                setCanQuit(true)
            }, 20 * 1000)
        }
            setTimeout(()=>{
                setAnimationDone(true)
            }, 4 * 1000)
        // setTimeout(()=>{
        //     setImgLoaded(!imgLoaded)
        // }, 2000)
    }, [imgLoaded])


    return (
        <>
            {nihus && (
                <div className={cn("fixed h-full w-full top-0 left-0 z-[3000] opacity-1 transition-opacity duration-500", {'opacity-0 z-[-1]': !shown})}>
                    <div className={cn("h-full w-full bg-black/90")}>
                        {/* <img src={`/img/stickers/${nihus.gif}`} onLoad={()=>{setImgLoaded(true)}} className={cn("absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 h-fit max-h-[90%] w-[90%] max-w-fit")} /> */}
                        <div className={cn(
                            "absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2",
                            "h-[90%] w-[90%]",
                            "transition-all duration-1000 ease-in ",
                            "scale-0 rotate-0",
                            {"scale-100 rotate-[1080deg]": shown}
                        )} style={{animationDuration: '2s'}}>
                            <div className={cn("relative h-full w-full")}>
                                <div className={cn("absolute h-fit max-h-full w-full top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 ")}>
                                    <div className={cn("relative flex flex-col ")}>
                                        {/* <div className={cn({hidden: !animationDone})}> */}
                                        <div >
                                            <p className={cn("text-2xl LB-TitleText text-center")}>
                                                {nihus.text}
                                            </p>
                                            <div className={cn("h-12 w-full")}></div>
                                        </div>
                                        <div className={cn("flex-grow relative max-h-fit")}>

                                            <img src={`/img/stickers/lewa.png`} onLoad={()=>setImgLoaded(true)} className={cn("h-fit w-full max-w-fit")} />
                                        </div>
                                        {canQuit && (
                                            <div className={cn("absolute bottom-[10%] flex justify-center")}>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={onQuit}
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
            )}
        </>
    )
}

export default NihusSticker
