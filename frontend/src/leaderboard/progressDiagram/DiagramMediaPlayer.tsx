import React from 'react';
import { IconButton } from '@mui/material';
import SkipPreviousRoundedIcon from '@mui/icons-material/SkipPreviousRounded';
import SkipNextRoundedIcon from '@mui/icons-material/SkipNextRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';


interface DiagramMediaPlayerProps {
	hasNextVersion: boolean
	hasPrevVersion: boolean
	play: boolean
	goNext: () => void
	goPrev: () => void
	togglePlay: () => void
}


function DiagramMediaPlayer ({ hasNextVersion, hasPrevVersion, goNext, togglePlay, goPrev, play }: DiagramMediaPlayerProps) {

  	return (
		<div className='LB-DiagramMediaPlayer'>
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
  	);
};

export default DiagramMediaPlayer;

