import React, { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { Button, InputLabel, MenuItem, Select, SelectChangeEvent, TextareaAutosize } from '@mui/material'
import { cn } from '@/utils'
import { MatchBetWithRelations, UtlBase } from '@/types'
import { MatchResultV2, betToMatchResultProps } from '@/widgets/MatchResult'
import NihusSticker, { NihusStickerProps } from '@/nihusim/NihusSticker'



interface Props {
    open: boolean
    onClose: () => void
    gifs: string[]
    bet: MatchBetWithRelations
    targetUtl: UtlBase
    currentUtl: UtlBase
    onSubmit: (text: string, gif: string) => Promise<void>
}



export default function SendNihusDialog({
    open,
    onClose,
    onSubmit,
    gifs,
    bet,
    targetUtl,
    currentUtl,
}: Props) {
    const [gif, setGif] = useState(gifs[0] ?? null)
    const [text, setText] = useState('')
    const [previewOn, setPreviewOn] = useState(false)

    const submit = async () => {
        onSubmit(text, gif).then(()=>{
            (window as any).toastr["success"]('הניחוס נשלח בהצלחה!')
            onClose()
        })
    }

    const reset = () => {
        setText('')
        setGif(gifs[0] ?? null)
        setPreviewOn(false)
    }
    
    useEffect(()=>{
        if (gifs.length > 0 && gif == null){
            setGif(gifs[0])
        }
    }, [gifs, gif])

    useEffect(()=>{
        if (!open){
            reset();
        }
    }, [open])

    const disabled = text.length === 0 || gif == null

    const generatedNihus: NihusStickerProps['nihus'] = {
        gif: gif,
        text: text,
        targetedUtl: targetUtl,
        senderUtl: currentUtl,
        bet,
        game: bet.relatedMatch,
        id: -1,
    }

    return (
        <Dialog classes={{root: cn('tn-m-3')}} open={open} onClose={onClose}>
            
            <div className={cn("w-[400px] max-w-full")}>
                <DialogTitle>
                    <IconButton onClick={onClose} className={cn("absolute top-2 left-2")}>
                        <CloseIcon />
                    </IconButton>
                    <div className={cn("text")} style={{fontSize: 20}}>
                        שלח ניחוס ל{targetUtl.name}!
                    </div>
                </DialogTitle>
                <DialogContent>
                    {previewOn && (
                        <NihusSticker
                            nihus={generatedNihus}
                            blocking={false}
                            showTargetUtl={false}
                            onQuit={() => setPreviewOn(false)}
                        />
                    )}
                    <div className={cn('')}>
                        <InputLabel >עבור הימור:</InputLabel>
                        <MatchResultV2 {...betToMatchResultProps(bet)} />
                        <InputLabel className={cn('mt-3')}>הוסף כמה מילים:</InputLabel>
                        <TextareaAutosize
                            value={text}
                            onChange={(e) => {setText(e.target.value)}}
                            minRows={2}
                            maxRows={8}
                            className={cn("w-full p-2 rounded-[12px]")}
                        />
                        <InputLabel className={cn('mt-3')}>בחר סטיקר:</InputLabel>

                        {gif && (

                            
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
                        <div className={cn('mt-3 w-full flex justify-center')}>
                            <Button
                                variant='outlined'
                                color='primary'
                                onClick={() => setPreviewOn(true)}
                                disabled={disabled}
                                className={cn("mx-auto")}
                                style={{fontSize: 20}}
                            >
                                תצוגה מקדימה
                            </Button>
                        </div>
                        <Button
                            variant='contained'
                            color='primary'
                            onClick={submit}
                            disabled={disabled}
                            className={cn("mt-5")}
                        >
                            שלח
                        </Button>
                    </div>
                </DialogContent>
            </div>
        </Dialog>
    )
}
