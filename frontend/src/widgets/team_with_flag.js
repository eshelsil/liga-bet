import React from "react";

function TeamAndSymbol(props) {
    const {name, crest_url, align_left, is_loser_bg, is_winner_bg, is_underlined, is_bold} = props;
    return <div className={`team-and-flag ${align_left ? 'left-aligned' : ''}`}>
        {
            crest_url &&
            <div className="flag-wrapper">
                <img className="team_flag" src={crest_url}/>
            </div>
        }
        {
            name &&
            <span className={`team_with_flag-span
                ${is_loser_bg ? "bet-loser-bg" : ''}
                ${is_winner_bg ? "bet-winner-bg" : ''}
                ${is_underlined ? "underlined" : ''}
                ${is_bold ? "bolded" : ''}
            `}>
                {name}
            </span>
        }
    </div>
}

export default TeamAndSymbol