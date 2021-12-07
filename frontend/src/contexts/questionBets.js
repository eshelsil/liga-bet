import React, { createContext, useState, useEffect } from 'react';

const QuestionBetsContext = createContext(null);
const QuestionBetsProvider = ({ children }) => {
	const [questions, setQuestions] = useState({});
	const [initialized, setInitialized] = useState(false);
    const initialize = () => {
		if (initialized) return;
		//get data from API
		const gotFromAPI = {
			3: {
				home_team: {
					name: "Israel",
					id: 4,
					crest_url: "https://localhost/1111"
				},
				away_team: {
					name: "Austria",
					id: 14,
					crest_url: "https://localhost/1111"
				},
				// change to only id
				result_home: 5,
				result_away: 2,
				winner_side: 'home',
				id: 3,
			},
		}
		setQuestions(gotFromAPI);
		setInitialized(true);
	};
    return <QuestionBetsContext.Provider value={{
        questions,
		initialize,
    }}>
        {children}
    </QuestionBetsContext.Provider>
}
export {QuestionBetsContext}
export {QuestionBetsProvider}