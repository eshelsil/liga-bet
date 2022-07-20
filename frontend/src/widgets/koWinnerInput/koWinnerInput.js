import moment from 'moment';
import React from 'react';
import { WINNER_SIDE } from '../../_enums/winnerSide';



let id=0;
function gen_id(){
    id++;
    return id;
}

function KoWinnerInput ({
    value,
    setValue,
}){

    const onChange = (e) => {
        setValue(e.target.value);
    };
    const id = gen_id();

    return (
        <div className="ko_switch_input">
            <div className="tw-toggle">
                <input type="radio" onChange={onChange} value={WINNER_SIDE.home}
                    name={`ko_winner_of_match_${id}`}
                    className="home-radio"
                    checked={value === WINNER_SIDE.home}
                />
                <label className="toggle"><i className="fa fa-star" aria-hidden="true"></i></label>
                <label className="arrow"><i className="fa fa-arrows-v arrow-icon"></i></label>
                <input type="radio" onChange={onChange} value={WINNER_SIDE.away}
                    name={`ko_winner_of_match_${id}`}
                    checked={value === WINNER_SIDE.away}
                />
                <label className="toggle"><i className="fa fa-star"></i></label>
                <span></span>
            </div>
        </div>
    );
}

export default KoWinnerInput;