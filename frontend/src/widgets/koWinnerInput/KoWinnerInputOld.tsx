import React from 'react'
import { WinnerSide } from '../../types'

let id = 0
function gen_id() {
    id++
    return id
}

interface Props {
    value: WinnerSide
    setValue: (side: WinnerSide | null) => void
}

function KoWinnerInput({ value, setValue }: Props) {
    const onChange = (e) => {
        setValue(e.target.value)
    }
    const id = gen_id()

    return (
        <div className="ko_switch_input">
            <div className="tw-toggle">
                <input
                    type="radio"
                    onChange={onChange}
                    value={WinnerSide.Home}
                    name={`ko_winner_of_match_${id}`}
                    className="home-radio"
                    checked={value === WinnerSide.Home}
                />
                <label className="toggle">
                    <i className="fa fa-star" aria-hidden="true"></i>
                </label>
                <label className="arrow">
                    <i className="fa fa-arrows-v arrow-icon"></i>
                </label>
                <input
                    type="radio"
                    onChange={onChange}
                    value={WinnerSide.Away}
                    name={`ko_winner_of_match_${id}`}
                    checked={value === WinnerSide.Away}
                />
                <label className="toggle">
                    <i className="fa fa-star"></i>
                </label>
                <span></span>
            </div>
        </div>
    )
}

export default KoWinnerInput
