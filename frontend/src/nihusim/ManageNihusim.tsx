import React from 'react'
import { CurrentTournamentUser, EverGrantedNihus, MySentNihusim, } from '../_selectors'
import { useSelector } from 'react-redux'
import { cn, isGameLive, valuesOf } from '@/utils'
import { MatchResultV2, betToMatchResultProps } from '@/widgets/MatchResult'
import { sortBy } from 'lodash'
import { default as SeenIcon } from '../svgs/seen_msg.svg';
import { InfoOutlined } from '@mui/icons-material'
import { DialogName } from '@/dialogs/types'
import useOpenDialog from '@/hooks/useOpenDialog'


const ManageNihusim = () => {
    const {nihusimLeft = 0, nihusimGranted=0, nihusimUsed=0} = useSelector(CurrentTournamentUser)   
    const pageVisible = useSelector(EverGrantedNihus)
    const sentNihusim = useSelector(MySentNihusim)
    const openNihusExplanationDialog = useOpenDialog(DialogName.NihusGrantExplanation)

    return (
        <>
        {pageVisible && (
            <div>
                <div className={cn("flex items-center justify-between")}>
                    <h1 className='LB-TitleText'>הניחוסים שלי</h1>
                    <InfoOutlined className={cn("w-6 h-6 cursor-pointer fill-white")} onClick={() => openNihusExplanationDialog(undefined)} />
                </div>
                <h4 className='LB-TitleText'>כמות: {nihusimLeft}</h4>
                <h4 className='LB-TitleText'>סה"כ הוענקו: {nihusimGranted}</h4>
                <h4 className='LB-TitleText'>סה"כ נוצלו: {nihusimUsed}</h4>

                <div className={cn("w-full max-w-[400px]")}>
                    {sortBy(valuesOf(sentNihusim), 'created_at').reverse().map(nihus => (
                        <div key={nihus.id} className={cn("bg-white/80 rounded-xl p-2 text-black mb-5")}>
                            <div className={cn("flex items-center justify-evenly rounded-xl pb-1 gap-4 border-b border-black/50")}>
                                <div className={cn("flex flex-col gap-1")}>
                                    <div>נשלח ל:</div>
                                    <div className={cn("flex items-center")}>
                                        <div>
                                            {nihus.targetedUtl.name}
                                        </div>
                                        <SeenIcon className={cn("h-6 w-6", {hidden: !nihus.seen})}/>
                                    </div>
                                </div>
                                <MatchResultV2 {...betToMatchResultProps({...nihus.bet, relatedMatch: nihus.game})} title='הימור' />
                            </div>
                            <div className={cn("h-[1px] w-full bg-black/50")}/>
                            <div className={cn("flex items-center justify-evenly gap-4 pt-1")}>
                                <img className={cn("h-10 object-contain")} src={`/img/stickers/${nihus.gif}`}/>
                                <div className={cn("flex flex-col")}>
                                    <p>טקסט</p>
                                    <p className={cn("text-sm max-w-[200px] min-w-[90px] max-h-60px overflow-hidden text-ellipsis gap-2")}>
                                        {nihus.text}
                                    </p>
                                </div>
                                <div className={cn("scale-75")}>
                                    <MatchResultV2
                                        {...betToMatchResultProps({
                                            ...nihus.bet,
                                            relatedMatch: nihus.game,
                                            result_home: nihus.game.result_home,
                                            result_away: nihus.game.result_away
                                        })}
                                        title={isGameLive(nihus.game) ? 'מה קורה שם' : 'מה נגמר'}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        )}
        </>
    )
}

export default ManageNihusim
