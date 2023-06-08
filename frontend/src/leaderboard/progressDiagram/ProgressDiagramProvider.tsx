import React from 'react';
import ScoreboardProgressDiagram from './ProgressDiagram';
import { useSelector } from 'react-redux';
import { Contestants, FetchedLeaderboardVersions, LeaderboardRows, LeaderboardVersionsDesc, LeaderboardVersionsWithGames, WinnerBetByUtlId } from '../../_selectors';
import { keyBy, map } from 'lodash';
import { useLeaderboard } from '../../hooks/useFetcher';
import './ProgressDiagram.scss'


function ScoreboardProgressDiagramProvider ({onClose}) {
	const winnerBetByUtlId = useSelector(WinnerBetByUtlId)
	const scoreboardsByVersionId = useSelector(LeaderboardRows)
	const utls = useSelector(Contestants)
	const versions = useSelector(LeaderboardVersionsWithGames)
	const latestVersion = versions[0];
	const versionsAsc = [...versions].reverse()

	const fetchedVersions = useSelector(FetchedLeaderboardVersions)
	const fetchedVersionsById = keyBy(fetchedVersions, id => id)
	const nonFetchedVersions = versionsAsc.filter(v => !fetchedVersionsById[v.id])
	const versionsToFetch = fetchedVersionsById[latestVersion?.id]
		? [latestVersion.id, ...nonFetchedVersions.slice(0,9)]
		: nonFetchedVersions.slice(0,10)
	

	const versionsIdsToFetch = map(versionsToFetch, 'id')
	useLeaderboard(undefined, versionsIdsToFetch)

	return (
		<ScoreboardProgressDiagram
			winnerBetByUtlId={winnerBetByUtlId}
			scoreboardsByVersionId={scoreboardsByVersionId}
			utls={utls}
			versions={versionsAsc}
			onClose={onClose}
		/>
	)
}

export default ScoreboardProgressDiagramProvider;

