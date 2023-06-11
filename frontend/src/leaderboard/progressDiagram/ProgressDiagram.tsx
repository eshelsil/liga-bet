import React, { useCallback, useEffect, useRef, useState } from 'react';
import Paper from '@mui/material/Paper';
import { LeaderboardVersionWithGame, QuestionBetWithRelations, UTLsById } from '../../types';
import { ScoreboardRowsByVersionId } from '../../_reducers/leaderboardRows';
import { calcLeaderboardDiff, generateEmptyScoreboardRow, keysOf, valuesOf } from '../../utils';
import { map, mapValues, sortBy, zipObject } from 'lodash';
import LeaderboardVersionDisplay from '../LeaderboardVersionDisplay';
import TeamFlag from '../../widgets/TeamFlag/TeamFlag';
import { IconButton, Modal } from '@mui/material';
import SkipPreviousRoundedIcon from '@mui/icons-material/SkipPreviousRounded';
import SkipNextRoundedIcon from '@mui/icons-material/SkipNextRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import CloseIcon from '@mui/icons-material/Close'
import YAxes from './YAxes';



interface ProgressDiagramProps {
	winnerBetByUtlId: Record<number,QuestionBetWithRelations>,
	scoreboardsByVersionId: ScoreboardRowsByVersionId,
	versions: LeaderboardVersionWithGame[],
	utls: UTLsById,
	onClose: () => void,
}


function ScoreboardProgressDiagram ({ onClose, winnerBetByUtlId, scoreboardsByVersionId, utls, versions }: ProgressDiagramProps) {
	const userContainerRef = useRef(null);
	const dataSectionRef = useRef(null);
	const [currentIndex, setCurrentIndex] = useState(-1)
	const [play, setPlay] = useState(false)
	const [showChange, setShowChange] = useState(true)
	const [hasTimeout, setHasTimeout] = useState(false)
	const togglePlay = () => setPlay(!play)
	const versionsCount = versions.length
	const utlsCount = keysOf(utls).length
	const MORE_VERSIONS = Math.floor(versionsCount / 2)


	const getScoreboardRowsByUtlId = (index: number) => {
		if (index < 0 || index > versionsCount - 1 ){
			return mapValues(utls, generateEmptyScoreboardRow)
		}
		const version = versions[index]
		return scoreboardsByVersionId[version.id] ?? {}
	}
	const getVersion = (index: number) => (index >= 0 && index <= versionsCount - 1 ) ? versions[index] : undefined

	const currentLeaderboard = getScoreboardRowsByUtlId(currentIndex)
	const prevLeaderboard = getScoreboardRowsByUtlId(currentIndex - 1)
	const scoreboardRows = valuesOf(calcLeaderboardDiff(currentLeaderboard, prevLeaderboard))

	const currentVersions = []
	for (let i = currentIndex - MORE_VERSIONS; i <= currentIndex + MORE_VERSIONS; i++){
		currentVersions.push(getVersion(i))
	}
	const goNext = () => setCurrentIndex(currentIndex + 1)
	const goPrev = () => setCurrentIndex(currentIndex - 1)


	const hasNextVersion = currentIndex < versionsCount - 1
	const hasPrevVersion = currentIndex > 0

	useEffect(() => {
		const goNext = () => hasNextVersion && setCurrentIndex(currentIndex + 1)
		if (play && !hasTimeout){
			goNext()
		}
		const timer = setTimeout(goNext, 1000)
		setHasTimeout(true)
		if (!play){
			setHasTimeout(false)
			clearTimeout(timer)
		}
		if (!hasNextVersion){
			clearTimeout(timer)
			setPlay(false)
		}
		return () => {
			clearTimeout(timer)
		}
	}, [currentIndex, play, hasNextVersion, hasTimeout])

	useEffect(() => {
		setShowChange(true)
		const t = setTimeout(() => setShowChange(false), 1000)
		return () => {
			clearTimeout(t)
		}
	}, [currentIndex])

	useEffect(() => {
		setPlay(true)
	}, [])


  	// const maxScore = Math.max(...scoreboard.map((row) => row.scores));
    const colorDiff = Math.min(360 / utlsCount, 30)
	const sortedScoreboard = map(sortBy(scoreboardRows, 'rank'), (row, index) => ({...row, index}) )
	const maxScore = Math.max(sortedScoreboard[0]?.score ?? 0, 50)

	const colors = valuesOf(sortedScoreboard).map((utl, index) => `hsl(${Math.floor(colorDiff * index)}, 70%, 50%)`)
  	const userColors = zipObject(keysOf(utls), colors)
	const rowByUtlId = {}
	const heightByUtlId = {}
	let lastRank = -1
	let equalRanksCount = 0
	for(const row of sortedScoreboard) {
		rowByUtlId[row.user_tournament_id] = row

		if (lastRank === row.rank){
			equalRanksCount++
		}
		heightByUtlId[row.user_tournament_id] = row.index * 36 - (equalRanksCount * 12)
		lastRank = row.rank
	}


	const VERSION_WIDTH = 300

	const setUserContainerWidth = useCallback(() => {
		const dataSectionContainer = dataSectionRef.current;
		const userContainer = userContainerRef.current;
		console.log('aqui3 ', userContainer, dataSectionContainer)
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
		dataSectionContainer.style.opacity = 1;
	}, [])
	const setDataContainerRef = useCallback((node) => {
		dataSectionRef.current = node;
		console.log('aqui1 ', dataSectionRef.current)
		setUserContainerWidth()
	}, [])
	const setUserContainerRef = useCallback((node) => {
		userContainerRef.current = node;
		console.log('aqui2 ', userContainerRef.current)
		setUserContainerWidth()
	}, [])

  	return (
    <Modal open={true} onClose={onClose}>
		<div className='eshel'>
        <Paper elevation={3} className={'LB-ProgressDiagram'}>
		<IconButton onClick={onClose} className={'closeButton'}>
			<CloseIcon />
		</IconButton>
		<div className=''>

			<div className='mediaPlayerContainer'>
				<div className={`mediaPlayer`}>
					<IconButton className='icon' disabled={!hasNextVersion} onClick={goNext}>
						<SkipNextRoundedIcon fontSize='large' />
					</IconButton>
					<IconButton className='icon' disabled={!hasNextVersion} onClick={togglePlay}>
						{ play
							? <PauseRoundedIcon fontSize='large' />
							: <PlayArrowRoundedIcon fontSize='large' />
						}
					</IconButton>
					<IconButton className='icon' disabled={!hasPrevVersion} onClick={goPrev}>
						<SkipPreviousRoundedIcon fontSize='large' />
					</IconButton>
				</div>
			</div>
			<div className={`versions ${currentIndex < 0 ? 'emptyVersions' : ''}`}>
				{currentVersions.map((version, index) => (
					version && (
						<div
							key={version.id}
							className={`version ${index === MORE_VERSIONS ? 'currentVersion' : ''}`}
							style={{left: `calc(50% + ${(index - MORE_VERSIONS) * VERSION_WIDTH}px)`}}
						>
							<div onClick={() => setCurrentIndex(version.order - 1)} style={{cursor: 'pointer'}}>
								<LeaderboardVersionDisplay version={version} />
							</div>
						</div>
					)
				))}
			</div>
		  	<div className='dataSection' ref={setDataContainerRef} style={{height: utlsCount * 36}}>
				<div className='usersSection' ref={setUserContainerRef}>
					{keysOf(utls).map( utlId => {
						const row = rowByUtlId[utlId]
						if (!row) {
							return
						}
						const userColor = userColors[row.user_tournament_id];
						const top = heightByUtlId[utlId];
						const winnerTeam = winnerBetByUtlId[row.user_tournament_id]?.answer?.name
            			return (
							<div
								className={`userContainer`}
								style={{top}}
								key={utlId}
							>
								<div >
									<TeamFlag name={winnerTeam ?? ''} size={24} />
								</div>
								<div className={'userName'} style={{ color: userColor }}>{utls[row.user_tournament_id]?.name}</div>
							</div>
						)
          			})}
		  		</div>
				<div className='scoresSection'>
					<div>
						<YAxes maxScore={maxScore}/>
						{keysOf(utls).map( utlId => {
							const row = rowByUtlId[utlId]
							if (!row) {
								return
							}
							const userColor = userColors[row.user_tournament_id];
							const top = heightByUtlId[utlId];
							return (
								<div className={'barContainer'}
									style={{top}}
									key={utlId}
								>
									<div
										className={'bar'}
										style={{ width: `${(row.score / maxScore) * 100}%`, backgroundColor: userColor}}
									>
										<div className={'addedScore'}>
											{showChange && row.addedScore > 0 ? `${row.addedScore} +` : ''}
										</div>
										<div className={'scores'} style={{ color: userColor }}>{row.score}</div>
									</div>
								</div>
							)
						})}
					</div>
		  		</div>
		  	</div>
			</div>
        </Paper>
		</div>
	</Modal>
  	);
};

export default ScoreboardProgressDiagram;

