import React from 'react'
import { useSelector, connect } from 'react-redux'
import { DialogName, ToggleDialogStateFunction } from '../types'
import { closeDialog } from '../../_actions/dialogs'
import { NoSelector, IsOpenGameScoreInfoDialog, Games, FormattedMatchBetScoreConfig, IsCurrentTournamentKnockoutBracket } from '@/_selectors'
import GameScoreInfoDialog from './GameScoreInfoDialog'
import BracketGameScoreInfoDialog from '@/bracket/BracketGameScoreInfoDialog'
import { useBracketScores, useBracketSpecialBets } from '@/bracket/useBracket'
import { bracketSpecialRole, knockoutStageToSubType } from '@/utils'
import useDialogData from '@/hooks/useDialogData'

interface Props {
    closeDialog: ToggleDialogStateFunction
}

function GameScoreInfoDialogProvider({ closeDialog }: Props) {

    const onClose = () => {
        closeDialog(DialogName.GameScoreInfo)
    }

    const isOpen = useSelector(IsOpenGameScoreInfoDialog)
    const data = useDialogData(DialogName.GameScoreInfo)
    const scoreConfig = useSelector(FormattedMatchBetScoreConfig)
    const isBracket = useSelector(IsCurrentTournamentKnockoutBracket)
    const bracketScores = useBracketScores()
    const { winner, runnerUp } = useBracketSpecialBets()
    const {gameId} = data ?? {}
    const gamesById = useSelector(Games)
    const game = gamesById[gameId]
    if (!game) return null;

    // Bracket tournaments score by round (qualifier / exact-result / advance bonus), not by the
    // classic gameBets config — show the bracket dialog (works for result-on and result-off).
    if (isBracket) {
        const round = knockoutStageToSubType(game.subType)
        const homeRole = bracketSpecialRole(game.home_team, winner.teamId, runnerUp.teamId)
        const awayRole = bracketSpecialRole(game.away_team, winner.teamId, runnerUp.teamId)
        
        return (
            <BracketGameScoreInfoDialog
                open={isOpen}
                onClose={onClose}
                qualifierPoints={(round && bracketScores.qualifier?.[round]) || 0}
                resultPoints={(round && bracketScores.result?.[round]) || 0}
                advancePoints={(round && bracketScores.specialAdvance?.[round]) || 0}
                role={'any'}
            />
        )
    }

    if (!scoreConfig) return null;

    return (
        <GameScoreInfoDialog
            open={isOpen}
            onClose={onClose}
            game={game}
            scoreConfig={scoreConfig}
        />
    )
}

const mapDispatchToProps = {
    closeDialog,
}

export default connect(
    NoSelector,
    mapDispatchToProps
)(GameScoreInfoDialogProvider)
