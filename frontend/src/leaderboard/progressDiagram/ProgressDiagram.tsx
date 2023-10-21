import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import { LeaderboardVersionWithGame, QuestionBetWithRelations, ScoreboardRowsByVersionId, UTLsById } from '../../types';
import { IconButton, Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'
import DiagramMediaPlayer from './DiagramMediaPlayer';
import DiagramVersionsDisplay from './VersionsDisplay';
import DiagramDataSection from './DigramDataSection';
import { calcScoreboardRows } from './utils';



interface ProgressDiagramProps {
	winnerBetByUtlId: Record<number,QuestionBetWithRelations>,
	scoreboardsByVersionId: ScoreboardRowsByVersionId,
	versions: LeaderboardVersionWithGame[],
	utls: UTLsById,
	onClose: () => void,
}


function ScoreboardProgressDiagram ({ onClose, winnerBetByUtlId, scoreboardsByVersionId, utls, versions }: ProgressDiagramProps) {
	const [currentIndex, setCurrentIndex] = useState(-1)
	const [prevIndex, setPrevIndex] = useState(-1)
	const [play, setPlay] = useState(false)
	const [showChange, setShowChange] = useState(true)
	const [hasTimeout, setHasTimeout] = useState(false)
	const togglePlay = () => setPlay(!play)
	const versionsCount = versions.length


	const scoreboardRows = calcScoreboardRows({scoreboardsByVersionId, versions, utls, currentIndex, prevIndex})

	const chooseVersion = (index: number) => {
		setPrevIndex(currentIndex)
		setCurrentIndex(index)
	}

	const goNext = () => chooseVersion(currentIndex + 1)
	const goPrev = () => chooseVersion(currentIndex - 1)
	const hasNextVersion = currentIndex < versionsCount - 1
	const hasPrevVersion = currentIndex >= 0

	useEffect(() => {
		// Versions movment
		const goNext = () => hasNextVersion && chooseVersion(currentIndex + 1)
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
		// clear change after animation finished
		setShowChange(true)
		const t = setTimeout(() => setShowChange(false), 1000)
		return () => {
			clearTimeout(t)
		}
	}, [currentIndex])

	useEffect(() => {
		// init play
		const t = setTimeout(() => setPlay(true), 800)
		return () => {
			clearTimeout(t)
		}
	}, [])


  	return (
    <Modal open={true} onClose={onClose}>
		<div className='LB-ProgressDiagram'>
			<Paper elevation={3}>
				<IconButton onClick={onClose} className={'closeButton'}>
					<CloseIcon />
				</IconButton>
				<div className='ProgressDiagram-content'>
					<DiagramMediaPlayer {...{hasNextVersion, hasPrevVersion, play, goNext, goPrev, togglePlay}}/>
					<DiagramVersionsDisplay {...{chooseVersion, currentIndex, versions}} />
					<DiagramDataSection {...{scoreboardRows, utls, winnerBetByUtlId, showChange}} />
				</div>
			</Paper>
		</div>
	</Modal>
  	);
};

export default ScoreboardProgressDiagram;

