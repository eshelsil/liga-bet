import React, { useEffect, useState } from 'react'
import ConfettiGenerator from 'confetti-js'
import { UtlBase } from '../../types';
import { Button } from '@mui/material';
import { useIsSmScreen, useIsXsScreen } from '../../hooks/useMedia';
import { getSummaryMsg } from './utils';
import { useSelector } from 'react-redux';
import { IsOurTournament } from '../../_selectors';


interface Props {
    currentUtl: UtlBase
    rank: number
    onSeenAnimation: () => void
}

function CongratsAnimation({ currentUtl, rank, onSeenAnimation }: Props) {
    
    const isOurTournament = useSelector(IsOurTournament)
    const isXsScreen = useIsXsScreen()
    const isSmScreen = useIsSmScreen()
    const [takenPrize, setTakenPrize] = useState(false)
    const [showDiploma, setShowDiploma] = useState(false)
    const [showTrophy, setShowTrophy] = useState(false)
    const [showDollar, setShowDollar] = useState(false)
    const [showCenterMoneyBag, setShowCenterMoneyBag] = useState(false)
    const [showLeftMoneyBag, setShowLeftMoneyBag] = useState(false)
    const [showRightMoneyBag, setShowRightMoneyBag] = useState(false)
    const [seenDiploma, setSeenDiploma] = useState(false)
    const [readDiploma, setReadDiploma] = useState(false)
    const [showConfetti, setShowConfetti] = useState(false)
    const [confettiFadingOut, setConfettiFadingOut] = useState(false)
    const [doneConfetti, setDoneConfetti] = useState(false)
    const [finished, setFinished] = useState(false)

    const hasPrize = rank <= 4
    const showClaimPrize = hasPrize && !takenPrize && readDiploma
    const hasMoneyBags = showCenterMoneyBag || showLeftMoneyBag || showRightMoneyBag
    const hasConfetti = rank === 1

    const {title, msg} = getSummaryMsg(rank, isOurTournament);

    const finishAnimation = () => setFinished(true)

    function takeTrophy(){
        setTakenPrize(true)
        if (hasConfetti){
            setTimeout(() => {
                closeConfetti()
                setTimeout(finishAnimation, 6000)
            }, 1000)
        } else {
            setTimeout(finishAnimation, 1000)
        }
    }


    function closeDiploma(){
        setShowDiploma(false)
        setReadDiploma(true)
        if (!hasPrize) {
            finishAnimation()
        }
        onSeenAnimation()
    }

    function closeConfetti(){
        setConfettiFadingOut(true)
        setTimeout(() => setDoneConfetti(true), 8000)
    }

    function renderDiploma(){
        setShowDiploma(true)
        setTimeout(()=>{
            setSeenDiploma(true)
        }, 1000)
    }

    function renderDollar(){
        setShowDollar(true)
    }

    function renderCenterMoneyBag(){
        setShowCenterMoneyBag(true)
    }

    function renderTwoMoneyBags(){
        setShowRightMoneyBag(true)
        setTimeout(()=>{
            setShowLeftMoneyBag(true)
        }, 500)
    }

    function renderAllTrophies(){
        setShowRightMoneyBag(true)
        setTimeout(()=>{
            setShowLeftMoneyBag(true);
        }, 1000)
        setTimeout(()=>{
            setShowCenterMoneyBag(true)
        }, 2000)
        setTimeout(()=>{
            setShowTrophy(true)
            setTimeout(renderDiploma, 2000)
        }, 3000)
    }

    function renderConfetti(){
        const confettiSettings = {
            target: 'confetti-canvas',
            clock: 35,
            max: isXsScreen ? 150 : (isSmScreen ? 300 : 500),
            size: 1.6,
            rotate: true,
            props: ['square'],
        };
        const confetti = new ConfettiGenerator(confettiSettings);
        confetti.render();
    }


    function renderCongrats(){
        if (rank === 1){
            setShowConfetti(true)
            setTimeout(renderAllTrophies, 2500);
        } else if (rank === 2){
            renderTwoMoneyBags();
            setTimeout(renderDiploma, 2000);
        } else if (rank === 3){
            renderCenterMoneyBag()
            setTimeout(renderDiploma, 1500);
        } else if (rank === 4){
            renderDollar()
            setTimeout(renderDiploma, 7000);
        } else {
            renderDiploma();
        }
    }

    useEffect(() => {
        renderCongrats()
    }, [rank])

    useEffect(() => {
        if (showConfetti){
            renderConfetti()
        }
    }, [showConfetti])


    return (
        <>
        {!finished && (
            <div className={`LB-CongratsAnimation ${takenPrize ? 'prize-taken' : ''}`}>
                {!doneConfetti && (
                    <canvas id="confetti-canvas" className={`${showConfetti ? 'max-height' : ''} ${confettiFadingOut ? 'fold-down' : ''}`}></canvas>
                )}
                <div id="money_bags_container" className={`fix-bg-wrapper ${hasMoneyBags ? 'shown' : ''}`}> 
                    <img className={`money_bag_img right-bag ${showRightMoneyBag ? 'shown' : ''}`} src="/img/money.png" />
                    <img className={`money_bag_img left-bag ${showLeftMoneyBag ? 'shown' : ''} `} src="/img/money.png" />
                    <div id="center_money_bag_wrap" className={`center-wrap ${showCenterMoneyBag ? 'shown' : ''}`}>
                        <img className={`money_bag_img center-bag`} src="/img/money.png" />
                    </div>
                </div>

                <div id="trophy_container" className={`fix-bg-wrapper ${showTrophy ? 'shown' : ''}`}>
                    <div className="center-trophy-wrap">
                        <img className="trophy_img" src="/img/trophy.png" />
                        <div className="center-writing">
                            <p id="trophy_writing">{currentUtl.name}</p>
                        </div>
                    </div>
                </div>

                <div id="dollar_container" className={`fix-bg-wrapper ${showDollar ? 'shown' : ''}`}>
                    <div className="center-wrap dollar-wrap ">
                        <img className="dollar-img" src="/img/dollar.png" />
                    </div>
                </div>

                {showClaimPrize && (
                    <div className='cliamPrizeButtonContainer'>
                        <Button
                            variant='contained'
                            color='primary'
                            className='cliamPrizeButton'
                            onClick={takeTrophy}
                        >
                                אחלה 👍
                        </Button>
                    </div>
                )}

                <div id="fixed-wrapper" className={`${showDiploma ? 'shown' : ''}`}>
                    <div className={`summary_container ${showDiploma ? 'shown' : ''}`}>   
                        <img className="diploma_img" src="/img/diploma.jpg" />
                        <div className="diploma-content">
                            <h4 className="diploma-title">{title}</h4>
                            <p className="diploma-msg">{msg}</p>
                            <div className="diploma-close-wrap">
                                <Button
                                    variant='outlined'
                                    color='inherit'
                                    className="diploma-close"
                                    onClick={seenDiploma ? closeDiploma : null}
                                >
                                        אחלה 👍
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
        </>
    )
}

export default CongratsAnimation
