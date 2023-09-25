import React, { useCallback, useRef } from 'react';
import { QuestionBetWithRelations, ScoreboardRowDetailed, Team, UTLsById } from '../../types';
import { keysOf } from '../../utils';
import { keyBy, map, sortBy } from 'lodash';
import UserDetails from './UserDetails';
import ProgressDiagramScoresSection from './ScoresSection';
import { getHeightByUtlId, getUserColors } from './utils';



const paddingForAxis = 16
const hslMax = 350
const hslMin = 190


interface DiagramDataSectionProps {
	winnerBetByUtlId: Record<number,QuestionBetWithRelations>,
	scoreboardRows: ScoreboardRowDetailed[],
	utls: UTLsById,
	showChange: boolean,
}


function DiagramDataSection ({ showChange, winnerBetByUtlId, scoreboardRows, utls }: DiagramDataSectionProps) {
	const userContainerRef = useRef(null);
	const dataSectionRef = useRef<HTMLDivElement>(null);

	const utlIds = keysOf(utls)
	const utlsCount = utlIds.length

	const sortedScoreboard = map(sortBy(scoreboardRows, 'rank'), (row, index) => ({...row, index}) )
	const maxScore = Math.max(sortedScoreboard[0]?.score ?? 0, 25)
	
	const userColors = getUserColors({hslMax, hslMin, utlIds})	
	const rowByUtlId = keyBy(sortedScoreboard, 'user_tournament_id')
	const heightByUtlId = getHeightByUtlId(sortedScoreboard)

	const maxUtlsHeight = (utlsCount * 36)


	const setUserContainerWidth = useCallback(() => {
		const dataSectionContainer = dataSectionRef.current;
		const userContainer = userContainerRef.current;
		if (!userContainer || !dataSectionContainer){
			return
		}
		const children = userContainer.children;
	
		let maxWidth = 0;
		for (let i = 0; i < children.length; i++) {
		  const childWidth = children[i].offsetWidth;
		  if (childWidth > maxWidth) {
			maxWidth = childWidth;
		  }
		}
		userContainer.style.width = `${maxWidth}px`;
		dataSectionContainer.style.opacity = '1';
	}, [])
	const setDataContainerRef = useCallback((node) => {
		dataSectionRef.current = node;
		setUserContainerWidth()
	}, [])
	const setUserContainerRef = useCallback((node) => {
		userContainerRef.current = node;
		setUserContainerWidth()
	}, [])



  	return (
		<div className='LB-DigramDataSection' ref={setDataContainerRef} style={{height: maxUtlsHeight + paddingForAxis}}>
			<div className='usersSection' ref={setUserContainerRef}>
				{utlIds.map(
					utlId => (
						!!rowByUtlId[utlId] ? (
							<UserDetails
								key={utlId}
								utl={utls[utlId]}
								top={heightByUtlId[utlId]}
								winnerTeam={winnerBetByUtlId[utlId]?.answer as Team}
								userColor={userColors[utlId]}
							/>
						): null
					)
				)}
			</div>
			<ProgressDiagramScoresSection
				heightByUtlId={heightByUtlId}
				userColors={userColors}
				rowByUtlId={rowByUtlId}
				showChange={showChange}
				maxScore={maxScore}
			/>
		</div>
  	);
};

export default DiagramDataSection;