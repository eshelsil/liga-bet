import React from 'react';
import { useSelector } from 'react-redux';
import { CurrentTournament, HasCurrentUtl } from '../_selectors';
import Prizes from './Prizes';
import './Prizes.scss';


function PrizesProvider(){
	const hasCurrentUtl = useSelector(HasCurrentUtl);
	const tournament = useSelector(CurrentTournament);
	const prizes = tournament?.config?.prizes;
	if (!hasCurrentUtl) {
		return null;
	}
	return (
		<Prizes prizes={prizes}/>
	);
}

export default PrizesProvider;