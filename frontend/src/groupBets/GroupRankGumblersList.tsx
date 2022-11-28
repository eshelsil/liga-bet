import React, { useState } from 'react'
import { useTournamentThemeClass } from '../hooks/useThemeClass'
import { getStandingsBetValue, keysOf } from '../utils'
import { GroupRankBetWithRelations, GroupWithTeams, Team } from '../types'
import GroupStandingsResult from '../widgets/GroupStandings'
import TeamFlag from '../widgets/TeamFlag/TeamFlag'
import { getHebGroupName } from '../strings'
import CustomTable from '../widgets/Table/CustomTable'
import { Collapse } from '@mui/material'
import ArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { groupBy, orderBy } from 'lodash'
import GumblersList from '../gumblersList/GumblersList'


interface BetInstance {
    id: string,
    score: number,
    standings: Team[],
    gumblers: string[],
}

interface Props {
    group: GroupWithTeams
    bets: GroupRankBetWithRelations[]
}

function GroupRankGumblersList({ group, bets }: Props) {
    const { teams = [] } = group
    const tournamentClass = useTournamentThemeClass()
    const [open, setOpen] = useState(false)
    const toggleOpen = () => setOpen(!open)
    const betsByAnswer = groupBy(bets, (bet) =>
        getStandingsBetValue(bet.standings)
    )

    const models = keysOf(betsByAnswer).map((betVal: string): BetInstance => {
        const bets = betsByAnswer[betVal]
        const betSample = bets[0]
        return {
            id: betVal,
            standings: betSample.standings,
            score: betSample.score,
            gumblers: bets.map((bet) => bet.utlName),
        }
    })
    const sortedModels = orderBy(
        models,
        [
            'score',
            ({gumblers}) => gumblers.length,
        ],
        [
            'desc',
            'desc',
        ]
    )

    const cells = [
        {
            id: 'admin',
            classes: {
                header: 'admin',
                cell: 'admin',
            },
            header: '',
            getter: (bet: BetInstance) => bet.id,
        },
        {
            id: 'betValue',
            classes: {
            },
            header: 'ניחוש',
            getter: (bet: BetInstance) => (
                <GroupStandingsResult
                    standings={bet.standings}
                />
            ),
        },
        {
            id: 'gumblers',
            classes: {
                cell: 'gumblersCell'
            },
            header: 'מנחשים',
            getter: (bet: BetInstance) => (
                <GumblersList gumblers={bet.gumblers} />
            ),
        },
        {
            id: 'score',
            classes: {
                cell: 'scoreCell',
                header: 'scoreHeaderCell',
            },
            header: 'ניקוד',
            getter: (bet: BetInstance) => bet.score,
        },
    ]

    return (
        <div className={`LB-GroupRankGumblersList ${tournamentClass} ${open ? 'GroupRankGumblersList-expanded' : ''}`}>
            <div className='GroupRankGumblersList-header' onClick={toggleOpen}>
                <div className='GroupRankGumblersList-title'>{getHebGroupName(group.name)}</div>
                <div className='GroupRankGumblersList-teams'>
                    {teams.map(team => (
                        <TeamFlag key={team.id} name={team.name} size={48} />
                    ))}
                </div>
                <div className='GroupRankGumblersList-expandIconContainer'>
                    <ArrowDownIcon className={`arrowDownIcon`} />
                </div>
            </div>
            <Collapse in={open}>
                <div className='LB-GumblersTable'>
                    <CustomTable models={sortedModels} cells={cells}/>
                </div>
            </Collapse>
        </div>
    )
}

export default GroupRankGumblersList
