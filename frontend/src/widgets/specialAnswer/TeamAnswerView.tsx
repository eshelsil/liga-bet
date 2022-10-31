import React from 'react'
import { Team } from '../../types'
import BigTeamWithFlag from '../TeamFlag/BigTeamWithFlag'

function TeamAnswerView({ team }: { team: Team }) {
    const { name } = team
    return <BigTeamWithFlag name={name} />
}

export default TeamAnswerView
