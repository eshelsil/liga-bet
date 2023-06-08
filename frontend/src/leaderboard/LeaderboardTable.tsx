import React, { useContext } from 'react'
import { useSelector } from 'react-redux';
import { QuestionBetWithRelations, ScoreboardRowDetailed } from '../types'
import CustomTable from '../widgets/Table/CustomTable'
import ArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AddIcon from '@mui/icons-material/Add';
import ExpandedContestant from './ExpandedContestantProvider'
import { usePrizesThemeClass } from '../hooks/useThemeClass'
import { getRankDisplayById } from './utils';
import TeamFlag from '../widgets/TeamFlag/TeamFlag';
import { WinnerBetByUtlId } from '../_selectors';
import { ExpandedContestantContext } from './ExpandedContestantContext';


export function NameWithWinnerFlag({
    name,
    winnerBet,
} : {
    name: string,
    winnerBet: QuestionBetWithRelations,
}){
    return (
        <div className='LB-NameWithWinnerFlag'>
            {winnerBet && (
                <TeamFlag name={winnerBet.answer.name} size={32} />
            )}
            {!winnerBet && (
                <div className='NameWithWinnerFlag-noWinner' />
            )}
            <div className="NameWithWinnerFlag-name">
                {name}
            </div>
        </div>
    )
}

interface Props {
    rows: ScoreboardRowDetailed[]
    currentUtlId: number
    isLive?: boolean
}

function LeaderboardTable({ rows, currentUtlId, isLive }: Props) {
    const winnerBetByUtlId = useSelector(WinnerBetByUtlId)
    const { expandedUtl: expand, setExpandedUtl: setExpand } = useContext(ExpandedContestantContext);

    const getPrizeTheme = usePrizesThemeClass()
    const hasScores = !!rows.find(row => row.score > 0)
    const rankDisplayById = getRankDisplayById(rows)

    const cells = [
		{
			id: 'rankChange',
			header: '',
            classes: {
                header: 'rankChangeCell',
                cell: 'rankChangeCell',
            },
            getter: (model: ScoreboardRowDetailed) => (
                <>
                    {!!model.change && (
                        <div className={`rankChange ${model.change < 0 ? 'isNegative' : ''}`}>
                            <span className='rankChange-value'>{Math.abs(model.change)}</span>
                            <ArrowDownIcon className='rankChange-direction'/>
                        </div>
                    )}
                </>
            ),
		},
		{
			id: 'rank',
			header: '',
            classes: {
                header: 'rankCell',
                cell: 'rankCell',
            },
            getter: (model: ScoreboardRowDetailed) => rankDisplayById[model.id],
		},
		{
			id: 'name',
			header: 'שם',
            classes: {
                cell: 'nameCell',
            },
			getter: (model: ScoreboardRowDetailed) => (
                <NameWithWinnerFlag
                    name={model.name}
                    winnerBet={winnerBetByUtlId[model.user_tournament_id]}
                />
            ),
		},
		{
			id: 'score',
			header: 'ניקוד',
            classes: {
                header: 'scoreCell',
            },
			getter: (model: ScoreboardRowDetailed) => (
                <div className='scoreCell-container'>
                    <div className='scoreCell-total'>
                        {model.score}
                    </div>
                    {!!model.addedScore && (
                        <div className='scoreCell-added'>
                            <span>{model.addedScore}</span>
                            <AddIcon className='scoreCell-addIcon'/>
                        </div>
                    )}
                </div>
            ),
		},
    ]

    const getRowClassName = (model: ScoreboardRowDetailed) => {
        const currentUtl = model.user_tournament_id === currentUtlId ? 'currentUtl' : ''
        const index = rows.findIndex(row => row.id === model.id)
        const prizeClass = hasScores ? getPrizeTheme(index + 1) : ''
        return `${currentUtl} ${prizeClass}`
    }
    
    const onRowClick = (model: ScoreboardRowDetailed) => {
        if (expand === model.user_tournament_id){
            setExpand(null)
        } else {
            setExpand(model.user_tournament_id)
        }
    }

    const getExpandContent = (model: ScoreboardRowDetailed) => (
        model.user_tournament_id === expand
        ? (
            <ExpandedContestant utlId={model.user_tournament_id} isLive={isLive} />
        ) : null
    )
    

    return (
        <CustomTable
            models={rows}
            cells={cells}
            getRowClassName={getRowClassName}
            onModelRowClick={onRowClick}
            getExpandContent={getExpandContent}
        />
    )
}

export default LeaderboardTable
