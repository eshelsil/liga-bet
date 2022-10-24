import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { TournamentConfig, TournamentScoreConfig } from '../types';
import PrizesConfig from './prizes/PrizesConfig';
import ScoreConfig from './scores/ScoreConfig';




interface Props {
	prizes: TournamentConfig['prizes'],
	scoreConfig: TournamentScoreConfig,
	updateScoreConfig: (params: TournamentScoreConfig) => Promise<void>,
}

function TournamentConfigView({
	prizes,
	scoreConfig,
	updateScoreConfig,
}: Props){

	const updatePrizes = async (config: TournamentConfig['prizes']) => {
		// return await updateConfig({prizes: config});
		return ;
	}

	return (
		<div className='LigaBet-TournamentConfig'>
			<h1 className='title'>חוקי הטורניר</h1>
			<ul>
				<li>לאחר שתיקבע את הגדרות הטורניר תוכל להתחיל את הטורניר</li>
				<li>לאחר שתתחיל את הטורניר, ההימורים יפתחו ותוכל לאשר משתתפים רשומים</li>
				<li>שים לב! לאחר שתאשר לפחות משתתף אחד - לא יהיה ניתן יותר לערוך את חוקי הטורניר</li>
			</ul>
			<Accordion className={'tournamentConfigAccordion'}>
        		<AccordionSummary
					expandIcon={<ExpandMoreIcon />}
					id="prizes-config"
				>
					<h4>
						הגדרות פרסים
					</h4>
        		</AccordionSummary>
				<AccordionDetails>
					<PrizesConfig prizes={prizes} updatePrizes={updatePrizes} />
				</AccordionDetails>
      		</Accordion>
			<Accordion className={'tournamentConfigAccordion'}>
        		<AccordionSummary
					expandIcon={<ExpandMoreIcon />}
					id="scores-config"
				>
					<h4>
						הגדרות ניקוד
					</h4>
        		</AccordionSummary>
				<AccordionDetails>
					<ScoreConfig config={scoreConfig} updateConfig={updateScoreConfig}/>
				</AccordionDetails>
      		</Accordion>
		</div>
	);
}


export default TournamentConfigView;