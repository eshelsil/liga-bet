import { createSelector } from 'reselect';
import { MyGroupStandingsBetsSelector, MyMatchBetsSelector, MyQuestionBetsSelector } from './logic';


export const MyBetsSelector = createSelector(
    MyMatchBetsSelector,
    MyGroupStandingsBetsSelector,
    MyQuestionBetsSelector,
    (matchBets, groupRankBets, questionBets) => {
        return {
            matchBets,
            groupRankBets,
            questionBets,
        }
    }
);