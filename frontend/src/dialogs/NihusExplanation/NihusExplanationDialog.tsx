import React, { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { Button } from '@mui/material'
import { BetType, NihusGrant, UtlRole } from '@/types'
import { cn, valuesOf } from '@/utils'
import { GumblerRow } from '@/gumblersList/GumblersList'
import NihusimItemContent from '@/appHeader/NihusimItemContent'
import { MatchResultV2 } from '@/widgets/MatchResult'
import { useSelector } from 'react-redux'
import { CurrentTournamentUser, MatchesWithTeams } from '@/_selectors'
import { LOCK_SCREEN_SECONDS } from '@/nihusim/NihusSticker'
import SendNihusDialog from '../SendNihus/SendNihusDialog'
import { fetchNihusGifs } from '@/api/nihusim'

interface Props {
    open: boolean
    onClose: () => void
    onConfirm: () => void
    grant?: NihusGrant
}

export default function NihusGrantExplanationDialog({
    open,
    onClose,
    onConfirm,
    grant,
}: Props) {
    const {amount, grant_reason} = grant ?? {};
    const currentUtl = useSelector(CurrentTournamentUser)
    const gamesById = useSelector(MatchesWithTeams)
    const exampleGame = valuesOf(gamesById)[0]
    const [nihusOpen, setNihusOpen] = useState(false)
    const [gifs, setGifs] = useState(null)
    const tournamentId = currentUtl?.tournament.id

    useEffect(()=>{
        if (gifs === null && tournamentId && open) {
            fetchNihusGifs(tournamentId).then(setGifs)
        }
    },[gifs, tournamentId])

    if (!exampleGame) return null;

    return (
        <Dialog classes={{paper: cn('tn-m-4')}} open={open} onClose={onClose}>
            <SendNihusDialog
                open={nihusOpen}
                onClose={() => setNihusOpen(false)}
                bet={{
                    id: -1,
                    relatedMatch: exampleGame,
                    result_home: 1,
                    result_away: 1,
                    winner_side: null,
                    score: null,
                    user_tournament_id: -1,
                    type_id: -1,
                    type: BetType.Match,
                }}
                targetUtl={{id: -1, name: 'יוסי מהכבדים', user_id: -1, role: UtlRole.Contestant}}
                gifs={gifs ? gifs : []}
                currentUtl={currentUtl}
            />
            <div>
                <DialogTitle>
                    <IconButton onClick={onClose} className={cn("absolute left-2 top-2")}>
                        <CloseIcon />
                    </IconButton>
                    {!!grant ? `זכית ב-${amount} ניחוסים!` : 'הסבר על ניחוסים'}
                </DialogTitle>
                <DialogContent className={'dialogContent'}>
                    {!!grant && (<>
                        <h4 className={cn("mt-0")}>הפיצ'ר הסודי כבר כאן!<br/>ואתה זכית להשתמש בו {amount} פעמים</h4>
                        <h5><span className={cn("underline")}>הזכייה הוענקה לך בעקבות:</span> <span className={cn("text-md mr-1")}>{grant_reason}</span></h5>
                    </>)}
                    <div className={cn("mt-5", {'mt-0': !grant})}>
                        <h5 className={cn("mb-1")}>בזמן משחקים בלייב, תוכל ללחוץ על הגבנייה שליד מי שתרצה לנחס וייפתח טופס שליחת ניחוס:</h5>
                        <div className={cn("flex items-center border-t border-b border-solid border-black/20 gap-2")}>
                            {exampleGame && (
                                <MatchResultV2 
                                    home={{team: exampleGame.home_team, score: 2}}
                                    away={{team: exampleGame.away_team, score: 1}}
                                    isKnockout={false}
                                />
                            )}
                            <GumblerRow gumbler={{id: -1, name: 'יוסי מהכבדים'}} showNihusable onNihusClick={() => setNihusOpen(true)}/>
                        </div>
                        <h5 className={cn("italic pr-3")}><span className={cn("underline")}>שים לב!</span> משתמש שיקבל ניחוס יישאר תקוע איתו על המסך ולא יוכל להתעלם ממנו למשך <b>{LOCK_SCREEN_SECONDS} שניות</b></h5>
                    </div>
                    <div className={cn("mt-5")}>
                        <h5 className={cn("mb-0")}>:במידה ונמאס לך לראות מלא עגבניות, תוכל לכבות את מתג הניחוסים בתפריט המשתמש והעבניות יעלמו</h5>
                        <div className={cn("pointer-events-none bg-primaryGradient px-4 py-2 w-[200px] text-white")}>
                            <NihusimItemContent />
                        </div>
                        <h5 className={cn("pr-3 italic")}>בליחצה על תפריט הניחוסים תוכל גם לראות כמה ניחוסים נשארו לך ולפתוח שוב הסבר זה</h5>
                    </div>

                    <h5 className={cn("font-bold mt-4 mb-0")}>הניחוסים כבר הוכחו פעמים רבות כקלף חזק מאוד. השתמש בהם בתבונה...</h5>
                    <h5 className={cn("font-bold m-0 mt-1")}>בהצלחה!</h5>
                    <div className={cn('mt-6 flex items-center justify-center')}>
                        <Button
                            variant='contained'
                            color='primary'
                            onClick={onConfirm}
                        >
                            אוקיי, הבנתי
                        </Button>
                    </div>
                </DialogContent>
            </div>
        </Dialog>
    )
}
