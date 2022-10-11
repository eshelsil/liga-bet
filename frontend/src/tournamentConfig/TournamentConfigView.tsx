import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { TournamentConfig } from '../types';
import PrizesConfig from './prizes/PrizesConfig';
import ScoreConfig from './scores/ScoreConfig';



export type TournamentConfigParams = Partial<TournamentConfig>

interface Props {
	config: TournamentConfig,
	updateConfig: (params: TournamentConfigParams) => Promise<void>,
}

function TournamentConfigView({
	config,
	updateConfig,
}: Props){
	const {prizes, ...scroeConfig} = config;

	const updatePrizes = async (config: TournamentConfig['prizes']) => {
		return await updateConfig({prizes: config});
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
					<PrizesConfig prizes={config.prizes} updatePrizes={updatePrizes} />
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
					<ScoreConfig config={scroeConfig} updateConfig={updateConfig}/>
				</AccordionDetails>
      		</Accordion>
		</div>
	);
}


export default TournamentConfigView;