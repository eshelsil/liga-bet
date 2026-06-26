import React from 'react'
import { useTranslation } from 'react-i18next'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { Button } from '@mui/material'
import { cn, getGameScoreConfig, getGameStage, keysOf, sortBetSlices } from '@/utils'
import { GameBetScoreConfig, MatchApiModel, MatchBetsScoreConfig, MatchCommonBase } from '@/types'
import { getHebBetSliceName, getHebStageName } from '@/strings'



function ScorableRow({game, score, type}:{game: MatchCommonBase, score: number, type: keyof GameBetScoreConfig}){
    const { t } = useTranslation('dialogs')
    if (score === 0){
        return null;
    }
    let delayedScore = false;
    let extraText: string
    if (type === 'qualifier' && game.isTwoLeggedTie){
        if (game.isFirstLeg){
            delayedScore = true;
            extraText = t('gameScoreInfo.delayedScore')
        }
    }
    return (
        <div className={cn("mb-4 text-sm")}>
            <span className={cn("underline")}>{getHebBetSliceName(type)}</span><span>:</span>
            <span className={cn("ms-2 font-bold")}>{delayedScore ? '0' : score}</span>
            {extraText && (
                <span className={cn("ms-2")}>({extraText})</span>
            )}
        </div>
    )
}

interface Props {
    open: boolean
    onClose: () => void
    game: MatchApiModel
    scoreConfig: MatchBetsScoreConfig
}



export default function GameScoreInfoDialog({
    open,
    onClose,
    game,
    scoreConfig,
}: Props) {
    const { t } = useTranslation('dialogs')
    const stage = getGameStage(game)
    const betScoreConfig = getGameScoreConfig(game, scoreConfig)
    return (
        <Dialog classes={{root: cn('tn-m-3')}} open={open} onClose={onClose}>
            
            <div className={cn("w-[400px] max-w-full")}>
                <DialogTitle>
                    <IconButton onClick={onClose} className={cn("!absolute top-2 end-2")}>
                        <CloseIcon />
                    </IconButton>
                    <div className={cn("text-[24px]")}>
                        {t('gameScoreInfo.title')}
                    </div>
                </DialogTitle>
                <DialogContent>
                    <h5 className={cn("mb-5 text-base")}><span className={cn('underline')}>{t('gameScoreInfo.stageLabel')}</span> {getHebStageName(stage)}</h5>
                    {keysOf(betScoreConfig).sort(sortBetSlices).map((key) => (
                        <ScorableRow
                            key={key}
                            score={betScoreConfig[key]}
                            type={key}
                            game={game}
                        />
                    ))}
                    <div className={cn('mt-10')}>
                        <Button
                            variant='contained'
                            color='primary'
                            onClick={onClose}
                        >
                            {t('buttons.okGotIt')}
                        </Button>
                    </div>
                </DialogContent>
            </div>
        </Dialog>
    )
}
