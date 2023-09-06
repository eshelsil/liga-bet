import React from 'react'
import { Team } from '../../types'
import BigTeamWithFlag from '../TeamFlag/BigTeamWithFlag'

function TeamAnswerView({ team }: { team: Team }) {
    return <BigTeamWithFlag team={team} />
}

export default TeamAnswerView
