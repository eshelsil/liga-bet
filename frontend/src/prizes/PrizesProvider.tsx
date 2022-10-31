import React from 'react';
import { useSelector } from 'react-redux';
import { PrizesSelector, HasCurrentUtl } from '../_selectors';
import Prizes from './Prizes';
import './Prizes.scss';


function PrizesProvider(){
	const hasCurrentUtl = useSelector(HasCurrentUtl);
	const prizes = useSelector(PrizesSelector);
	if (!hasCurrentUtl || prizes.length === 0) {
		return null;
	}
	return (
		<Prizes prizes={prizes}/>
	);
}

export default PrizesProvider;