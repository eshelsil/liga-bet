import React from 'react';
import { LeaderboardVersionWithGame} from '../../types';
import LeaderboardVersionDisplay from '../LeaderboardVersionDisplay';


interface DiagramVersionsDisplayProps {
	versions: LeaderboardVersionWithGame[],
	currentIndex: number,
	chooseVersion: (index: number) => void,
}

const VERSION_WIDTH = 300

function DiagramVersionsDisplay ({ chooseVersion, currentIndex, versions }: DiagramVersionsDisplayProps) {
	const versionsCount = versions.length
	const MORE_VERSIONS = Math.floor(versionsCount / 2)

	const currentVersions = []
	for (let i = currentIndex - MORE_VERSIONS; i <= currentIndex + MORE_VERSIONS; i++){
		const version = (i >= 0 && i <= versionsCount - 1 ) ? versions[i] : undefined
		currentVersions.push(version)
	}

  	return (
		<div className={`LB-DiagramVersionsDisplay ${currentIndex < 0 ? 'emptyVersions' : ''}`}>
			{currentVersions.map((version, index) => (
				version && (
					<div
						key={version.id}
						className={`DiagramVersionsDisplay-versionWrapper ${index === MORE_VERSIONS ? 'currentVersion' : ''}`}
						style={{left: `calc(50% + ${(index - MORE_VERSIONS) * VERSION_WIDTH}px)`}}
					>
						<div className='DiagramVersionsDisplay-version' onClick={() => chooseVersion(version.order - 1)}>
							<LeaderboardVersionDisplay version={version} />
						</div>
					</div>
				)
			))}
			<div className='spaceKeeper'/>
		</div>
  	);
};

export default DiagramVersionsDisplay;

