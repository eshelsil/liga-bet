import React, { useState } from 'react';
import { getStandingsBetValue } from '../utils/betValuesGenerators.ts';
import TeamWithFlag from '../widgets/TeamWithFlag.tsx';

function SingleGroupBets({
    group,
    bets,
}){
	const {standings: teams = []} = group;
	const [open, setOpen] = useState(false);
	const toggleOpen = () => setOpen(!open);
    const betsByAnswer = _.groupBy(bets, bet => getStandingsBetValue(bet.standings));
    return (
    <div className="panel-group" style={{marginBottom: 0}}>
        <div className="panel panel-default">
            <div
				className="panel-heading row"
				style={{marginRight: 0, marginLeft: 0, cursor: 'pointer'}}
				onClick={toggleOpen}
			>
                <div className="col-xs-4 pull-right">
                    <h4 className="panel-title">
                        {group.name}
                    </h4>
                </div>
                <div className="col-xs-7 pull-right">
                    <div style={{display: 'flex'}}>
                        {teams.map(team =>(
							<div  key={team.id} style={{width: 30, display: 'flex', justifyContent: 'center'}} >
                            	<img className="team_flag" src={team.crest_url} />
							</div>
                        ))}
                    </div>
                </div>
            </div>
			{open && (
					<div className="tab-content" style={{marginTop: 25}}>
						<table className="table">
							<thead>
								<tr>
									<th className="col-xs-4">
										הימור
									</th>
									<th className="col-xs-7">
										מהמרים
									</th>
									<th className="col-xs-1">
										נק'
									</th>
								</tr>
							</thead>
							<tbody>
								{Object.entries(betsByAnswer).map(([value, bets]) => {
									const betSample = bets[0];
									const { standings, score } = betSample;
									const gumblers = bets.map(bet => bet.user_name);
									return (
										<tr key={value}>
											<td>
											{standings.map((team, i) => (
												<div key={i} className="flex-row">
													<span>({i + 1}) </span>
													<TeamWithFlag key={team.id} name={team.name} crest_url={team.crest_url} />
												</div>
											))}
											</td>
											<td>
												{gumblers.map(name => (
													<div key={name}>
														{name}
													</div>
												))}
											</td>
											<td>{score}</td>
										</tr>
									);
								})}
							</tbody>
						</table>
				</div>
			)}
        </div>
    </div>
    );
}

const GroupStandingsBetsView = ({
	groups,
	betsByGroupId,
}) => {
    return (
    <div>
        <h1>הימורי בתים</h1>
        <div className="row">
            <div className="col-xs-4 pull-right">בית</div>
            <div className="col-xs-7 pull-right">קבוצות</div>
        </div>
		{groups.map(group => (
			<SingleGroupBets key={group.id} group={group} bets={betsByGroupId[group.id]} />
		))}
    </div>
    );
};

export default GroupStandingsBetsView;