import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { sumBetsScore } from './utils'
import {
    GroupRankBetWithRelations,
    MatchBetWithRelations,
    QuestionBetWithRelations,
    SpecialQuestionAnswer,
    Team,
} from '../types'
import SimpleTabs from '../widgets/Tabs/Tabs'
import SpecialBetsTable from '../myBets/SpecialBetsTable'
import GameBetsTable from '../myBets/GameBetsTable'
import KnockoutGameBetsTable from '../myBets/KnockoutGameBetsTable'
import GroupRankBetsTable from '../myBets/GroupRankBetsTable'
import useGoTo from '../hooks/useGoTo'
import { Link } from '@mui/material'
import { useGameBetsOfUtl } from '../hooks/useFetcher'
import { ExpandedContestantContext } from './ExpandedContestantContext'
import { keyBy } from 'lodash'
import { useSelector } from 'react-redux'
import { IsCurrentTournamentKnockoutBracket } from '@/_selectors'


function GameBetsView({totalScore, bets, utlId, showLive}: {
    bets: MatchBetWithRelations[],
    totalScore: number,
    utlId: number,
    showLive?: boolean,
}) {
    const { t } = useTranslation('leaderboard')
    const isKnockoutBracket = useSelector(IsCurrentTournamentKnockoutBracket)
    useGameBetsOfUtl(utlId)

    return (
        <div>
            <h3>{t('expandedContestant.total')}{' '}{totalScore}</h3>
            {isKnockoutBracket
                ? <KnockoutGameBetsTable utlId={utlId} bets={bets} dropColumns={{date: true}} showLive={showLive} />
                : <GameBetsTable bets={bets} dropColumns={{date: true}} showLive={showLive} />
            }
        </div>
    )
}

interface Props {
    utlId: number
    matchBets: MatchBetWithRelations[]
    liveGameBets: MatchBetWithRelations[]
    groupStandingsBets: GroupRankBetWithRelations[]
    liveGroupRankBets: GroupRankBetWithRelations[]
    questionBets: QuestionBetWithRelations[]
    liveQuestionBets: QuestionBetWithRelations[]
    liveStandingsByGroupId: Record<number, Team[]>
    liveSpecialAnswers: Record<number, SpecialQuestionAnswer[]>
    isSideTournament: boolean
    isLive?: boolean
}

export function ExpandedContestantView({
    utlId,
    matchBets,
    liveGameBets,
    groupStandingsBets,
    liveGroupRankBets,
    questionBets,
    liveStandingsByGroupId,
    liveQuestionBets,
    liveSpecialAnswers,
    isSideTournament,
    isLive,
}: Props) {
    const { t } = useTranslation('leaderboard')
    const { goToHisBets } = useGoTo()
    const { selectedTab, setSelectedTab } = useContext(ExpandedContestantContext);
    const isKnockoutBracket = useSelector(IsCurrentTournamentKnockoutBracket)
    
    const liveGroupRankBetsById = keyBy(liveGroupRankBets, 'id')
    const liveQuestionBetsById = keyBy(liveQuestionBets, 'id')
    const gameBetsToShow = isLive ? [...liveGameBets, ...matchBets] : matchBets
    const groupRankBetsToShow = isLive
        ? groupStandingsBets.map(
            bet => ({
                ...bet,
                score: liveGroupRankBetsById[bet.id]?.score ?? bet.score
            })
        )
        : groupStandingsBets
    const questionBetsToSum = isLive
        ? questionBets.map(
            bet => ({
                ...bet,
                score: !!liveQuestionBetsById[bet.id] ? liveQuestionBetsById[bet.id].score : bet.score,
            })
        )
        : questionBets

    const matchesScore = sumBetsScore(gameBetsToShow)
    const groupStandingsScore = sumBetsScore(groupRankBetsToShow)
    const specialBetScore = sumBetsScore(questionBetsToSum)

    
    const tabs = [
        {
            id: 'games',
            label: t('expandedContestant.tabs.games'),
            children: (
                <GameBetsView
                    bets={gameBetsToShow}
                    totalScore={matchesScore}
                    utlId={utlId}
                    showLive={isLive}
                />
            )
        },
        {
            id: 'questions',
            label: t('expandedContestant.tabs.specialQuestions'),
            children: (
                <div>
                    <h3>{t('expandedContestant.total')}{' '}{specialBetScore}</h3>
                    <SpecialBetsTable
                        bets={questionBets}
                        showLive={isLive}
                        liveBetsById={liveQuestionBetsById}
                        liveAnswersByQuestionId={liveSpecialAnswers}
                    />
                </div>
            )
        },
        ...(isKnockoutBracket
            ? []
            : [
                  {
                      id: 'groups',
                      label: t('expandedContestant.tabs.groupRanks'),
                      children: (
                          <div>
                              <h3>
                                  {t('expandedContestant.total')}{' '}
                                  {groupStandingsScore}
                              </h3>
                              <GroupRankBetsTable
                                  bets={groupRankBetsToShow}
                                  liveStandings={liveStandingsByGroupId}
                                  showLive={isLive}
                              />
                          </div>
                      ),
                  },
              ]),
        
    ]


    return (
        <div className='LB-ExpanededContestantView'>
            <div className='hisBetsLink'>
                <Link onClick={() => goToHisBets(utlId)}>
                    {t('expandedContestant.fullFormLink')}
                </Link>
            </div>
            {isSideTournament && (
                <GameBetsView
                    bets={gameBetsToShow}
                    totalScore={matchesScore}
                    utlId={utlId}
                    showLive={isLive}
                />
            )}
            {!isSideTournament && (
                <SimpleTabs
                    tabs={tabs}
                    index={selectedTab}
                    onChange={setSelectedTab}
                />
            )}
        </div>
    )
}

export default ExpandedContestantView
