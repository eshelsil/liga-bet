import { AppDispatch, GetRootState } from '../_helpers/store'
import { createTournament, getTournamentsOwnedByUser, updateTournamentPreferences, updateTournamentPrizesConfig, updateTournamentScoresConfig } from '../api/tournaments'
import ownedTournaments from '../_reducers/ownedTournament'
import tournamentUser from '../_reducers/tournamentUser'
import { CurrentTournamentId, CurrentTournamentUserId } from '../_selectors'
import { TournamentScoreConfig } from '../types'
import myUtlsSlice from '../_reducers/myUtls'
import { keyBy } from 'lodash'

function createNewTournament({
    name,
    competitionId,
}: {
    name: string
    competitionId: number
}) {
    return async (dispatch: AppDispatch) => {
        const tournament = await createTournament({
            name,
            competition: competitionId,
        })
        dispatch(ownedTournaments.actions.updateOne(tournament))
        dispatch(tournamentUser.actions.reset())
    }
}

function fetchOwnedTournaments() {
    return async (dispatch: AppDispatch) => {
        const tournaments = await getTournamentsOwnedByUser()
        dispatch(ownedTournaments.actions.set(keyBy(tournaments, 'id')))
    }
}

function updateScoreConfig(config: TournamentScoreConfig) {
    return async (dispatch: AppDispatch, getState: GetRootState) => {
        const utlId = CurrentTournamentUserId(getState())
        const tournamentId = CurrentTournamentId(getState())
        const tournament = await updateTournamentScoresConfig(tournamentId, config);
        dispatch(myUtlsSlice.actions.setTournament({utlId, tournament}))
    }
}

function updatePrizesConfig(prizes: string[]) {
    return async (dispatch: AppDispatch, getState: GetRootState) => {
        const utlId = CurrentTournamentUserId(getState())
        const tournamentId = CurrentTournamentId(getState())
        const tournament = await updateTournamentPrizesConfig(tournamentId, prizes);
        dispatch(myUtlsSlice.actions.setTournament({utlId, tournament}))
    }
}

function answerDefaultConfigQuestion() {
    return async (dispatch: AppDispatch, getState: GetRootState) => {
        const utlId = CurrentTournamentUserId(getState())
        const tournamentId = CurrentTournamentId(getState())
        const preferences = await updateTournamentPreferences(tournamentId, {use_default_config_answered: true}, true);
        dispatch(myUtlsSlice.actions.setTournamentPreferences({utlId, preferences}))
    }
}

function updateAutoConfirmPreference(shouldAutoConfirm: boolean) {
    return async (dispatch: AppDispatch, getState: GetRootState) => {
        const utlId = CurrentTournamentUserId(getState())
        const tournamentId = CurrentTournamentId(getState())
        const preferences = await updateTournamentPreferences(tournamentId, {auto_approve_users: shouldAutoConfirm});
        dispatch(myUtlsSlice.actions.setTournamentPreferences({utlId, preferences}))
    }
}


export {
    createNewTournament,
    fetchOwnedTournaments,
    updateScoreConfig,
    updatePrizesConfig,
    answerDefaultConfigQuestion,
    updateAutoConfirmPreference,
}
