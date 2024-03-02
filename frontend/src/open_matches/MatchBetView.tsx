import React, { useEffect, useState } from 'react'
import { useTournamentThemeClass } from '../hooks/useThemeClass'
import { MatchWithABet, WinnerSide } from '../types'
import { DEFAULT_DATE_FORMAT, DEFAULT_TIME_FORMAT, isFinalGame } from '../utils/index'
import TeamWithFlag from '../widgets/TeamFlag/TeamWithFlag'
import CurrentBetView from './CurrentBetView'
import EditMatchBetView from './EditMatchBetView'
import dayjs from 'dayjs'
import useCancelEdit from '../hooks/useCancelEdit'
import { useSelector } from 'react-redux'
import { IsMultiBetDefaultForAll, IsOurTournament, MyOtherBettableUTLs } from '../_selectors'
import { Switch } from '@mui/material'
import '../styles/openBets/EditableBetView.scss'
import DaShubi from './DaShubi'
import { cn } from '@/utils'
import InfoIcon from '@mui/icons-material/InfoOutlined';
import { useAppDispatch } from '@/_helpers/store'
import { openDialog } from '@/_actions/dialogs'
import { DialogName } from '@/dialogs/types'
import useOpenDialog from '@/hooks/useOpenDialog'



function OpenMatchBetView({
    match,
    sendBet,
}: {
    match: MatchWithABet
    sendBet: (...args: any) => Promise<void>
}) {
    const { id, start_time, home_team, away_team, is_knockout, bet, isFirstLeg, isTwoLeggedTie } = match


    const openInfoDialog = useOpenDialog(DialogName.GameScoreInfo)
    const isOurTournament = useSelector(IsOurTournament);
    const [showShubi, setShowShubi] = useState(false);

    const otherTournaments = useSelector(MyOtherBettableUTLs);
    const hasOtherTournaments = otherTournaments.length > 0;
    const isMultiBetDefault = useSelector(IsMultiBetDefaultForAll)
    const tournamentClass = useTournamentThemeClass()
    const [edit, setEdit] = useState(false)
    const [forAllTournaments, setForAllTournaments] = useState(isMultiBetDefault)
    const { getLastEditTs, cancelEdit } = useCancelEdit({edit, setEdit})
    const [editOpener, setEditOpener] = useState(null)
    const hasNoBet = [undefined, null].includes(bet?.result_away)
    const showEdit = edit || hasNoBet

    const saveBet = async ({ homeScore, awayScore, koWinner }) => {
        setShowShubi(false)
        const ts = getLastEditTs()
        await sendBet({
            matchId: id,
            is_knockout,
            isTwoLeggedTie,
            isFirstLeg,
            homeScore,
            awayScore,
            koWinner,
            forAllTournaments,
        })
        .then(function (data) {
            let text = 'הניחוש נשלח'
            if (forAllTournaments){
                text += ` עבור ${otherTournaments.length + 1} טורנירים`
            }
            window['toastr']['success'](text)
            cancelEdit(ts)
            if (isFinalGame(match) && isOurTournament) {
                setShowShubi(true)
            }
        })
        .catch(function (error) {
            console.log('FAILED updating bet', error)
        })
    }

    const goToEditMode = (opener?: WinnerSide) => {
        setEditOpener(opener ?? null)
        setEdit(true)
    }

    const exitEditMode = () => {
        setEditOpener(null)
        setEdit(false)
    }

    useEffect(()=> {
        setForAllTournaments(isMultiBetDefault)
    }, [edit, isMultiBetDefault, setForAllTournaments])


    // const isHomeKoWinner = winnerSide === WinnerSide.Home
    // const isAwayKoWinner = winnerSide === WinnerSide.Away

    return (
        <div className={`
            LB-OpenMatchBet LB-EditableBetView ${tournamentClass}
            ${(showEdit && forAllTournaments) ? 'sendingforAllTournaments' : ''}
            ${is_knockout ? 'OpenMatchBet-knockout' : ''}
            ${showEdit ? 'OpenMatchBet-edit' : ''}
            ${isTwoLeggedTie ? 'OpenMatchBet-twoLegsKo' : ''}
        `}>
            <div className={`EditableBetView-header`}>
                <div className='dateLabel'>{dayjs(start_time).format(DEFAULT_DATE_FORMAT)}</div>
                <div className='timeLabel'>{dayjs(start_time).format(DEFAULT_TIME_FORMAT)}</div>
                <div className={cn("absolute top-0 left-0 flex items-center h-full")}>
                    {showEdit && hasOtherTournaments && (
                        <Switch
                            className='forAllTournamentsInput'
                            checked={forAllTournaments}
                            onChange={(e, value) => setForAllTournaments(value)}
                        />
                    )}
                    <InfoIcon onClick={()=>openInfoDialog({gameId:id})} className={cn("ml-2 fill-white/80 cursor-pointer")} />
                </div>
            </div>
            <div className='OpenMatchBet-body'>
                <TeamWithFlag team={home_team} size={50} classes={{root: 'verticalTeam sideRight', name: 'verticalTeamName'}}/>
                <div className='scoreForm'>
                    {showEdit && (
                        <EditMatchBetView
                            bet={bet}
                            isKnockout={is_knockout}
                            isTwoLegsKo={isTwoLeggedTie}
                            isFirstLeg={isFirstLeg}
                            onClose={exitEditMode}
                            onSave={saveBet}
                            opener={editOpener}
                        />
                    )}
                    {!showEdit && (
                        <CurrentBetView bet={bet} onEdit={goToEditMode} />
                    )}
                </div>
                <TeamWithFlag team={away_team} size={50} classes={{root: 'verticalTeam sideLeft', name: 'verticalTeamName'}}/>
            </div>
            {showShubi && isOurTournament && (
                <DaShubi dismiss={()=> setShowShubi(false)}/>
            )}
        </div>
    )
}

export default OpenMatchBetView
