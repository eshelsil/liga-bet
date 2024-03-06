import React, { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { Button, MenuItem, Select, SelectChangeEvent, TextField, TextareaAutosize } from '@mui/material'
import { cn, getGameScoreConfig, getGameStage, keysOf, sortBetSlices } from '@/utils'
import { GameBetScoreConfig, MatchApiModel, MatchBetWithRelations, MatchBetsScoreConfig, MatchCommonBase, UTL } from '@/types'
import { getHebBetSliceName, getHebStageName } from '@/strings'



interface Props {
    open: boolean
    onClose: () => void
    gifs: string[]
    bet: MatchBetWithRelations
    targetUtl: UTL
    onSubmit: (text: string, gif: string) => Promise<void>
}



export default function NihusStickerDialog({
    open,
    onClose,
    onSubmit,
    gifs,
    bet,
    targetUtl,
}: Props) {
    const [gif, setGif] = useState(gifs[0] ?? null)
    const [text, setText] = useState('')
    const submit = async () => {
        onSubmit(text, gif)
    }
    return (
        <Dialog classes={{root: cn('tn-m-3')}} open={open} onClose={onClose}>
            
            <div className={cn("w-[400px] max-w-full")}>
                <DialogTitle>
                    <IconButton onClick={onClose} className={cn("absolute top-2 left-2")}>
                        <CloseIcon />
                    </IconButton>
                    שלח ניחוש
                </DialogTitle>
                <DialogContent>
                    
                    <div className={cn('mt-10')}>
                        <TextareaAutosize
                            value={text}
                            onChange={(e) => {setText(e.target.value)}}
                            minRows={3}
                            maxRows={8}
                            className={cn("w-full p-2 rounded-[12px]")}
                        />
                        {gifs.length > 0 && (

                            <Select
                            value={gif}
                            onChange={(e: SelectChangeEvent<string>) => {
                                setGif(e.target.value)
                            }}
                            fullWidth
                            MenuProps={{
                                classes: {
                                    paper: 'TeamInput-paper',
                                    list: 'TeamInput-list',
                                }
                            }}
                        >
                            {gifs.map((gif) => (
                                <MenuItem key={gif} value={gif}>
                                    <div className={cn("flex items-center")}>
                                        <div className={cn("h-12 w-16 ml-2")}>

                                            <img src={`/img/stickers/${gif}`} className={cn("h-full w-fit max-w-full mx-auto")} />
                                        </div>
                                        <p className={cn("tex-lg m-0")}>
                                            {gif.split('.')[0]}
                                        </p>
                                    </div>
                                </MenuItem>
                            ))}
                                
                            </Select>
                        )}
                        <Button
                            variant='contained'
                            color='primary'
                            onClick={submit}
                        >
                            שלח
                        </Button>
                    </div>
                </DialogContent>
            </div>
        </Dialog>
    )
}
