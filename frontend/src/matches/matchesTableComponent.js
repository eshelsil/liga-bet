import React from 'react';

const DUMMY_DATA = {};

const MatchesTableComponent = (props) => {
// @if(count($matches) > 0 && $show_fetch_button)
//     <script>
//         function fetchFromAPI(){
//         $.ajax({
//             type: 'GET',
//             url: '/api-fetch-games',
//             success: function (server_msg) {
//                 const server_success_divider = "SERVER_SUCCESS_MSG:";
//                 const msg = server_msg.split(server_success_divider)[1];
//                 toastrsuccess"](msg);
//                 setTimeout(()=>{window.location.reload()}, 3000);
//             },
//             error: function(error) {
//                 console.log("error", error)
//                 const error_text = error.responseText;
//                 const server_error_divider = "SERVER_ERROR_MSG:";
//                 if (error_text.indexOf(server_error_divider) > -1){
//                     const error_msg = error_text.split(server_error_divider)[1];
//                     toastrerror"](error_msg);
//                 } else {
//                     toastrerror"](error_text);
//                 }
//             }
//         });
//     }
//     </script>
//     <button class="btn btn-primary" onclick="fetchFromAPI()" style="margin-right: 10px; margin-top: 15px;">עדכן תוצאות</button>
// @endif

    // const {groupPositionBet} = props;
    const {matches} = DUMMY_DATA;

    return (
    <h3>
        <table style="margin-bottom: 5px;">
            <tbody>
            <tr className="flex-row center-items">
                <td className="around-huge-flag">
                    @include('widgets.teamWithFlag', $home_team)
                </td>
                <td style="padding: 5px;">
                    -
                </td>
                <td className="around-huge-flag">
                    @include('widgets.teamWithFlag', $away_team)
                </td>
            </tr>
            </tbody>
        </table>
        <div style="font-size: 75%">
            <div style="margin-bottom: 5px;">
                {{DateTime::createFromFormat("U", $match->start_time)->setTimezone(new DateTimeZone("Asia/Jerusalem"))->format("Y/m/d H:i")}}
            </div>
            @if($match->is_done)
            <div className="flex-row center-items" style="margin-bottom: 5px;">
                <span className="label label-success" style="margin-left: 5px; font-size: 12px;">הסתיים</span>
                <span>{{$match->result_home}} - {{$match->result_away}} </span>
            </div>
            @endif
        </div>
    </h3>
    <div className="float-right">
        <ul className="nav nav-tabs float-right">
            <li className="float-right active">
                <a data-toggle="tab" href="#by-bet-{{$match->getID()}}">
                    לפי הימור
                </a>
            </li>
            <li className="float-right">
                <a data-toggle="tab" href="#by-user-{{$match->getID()}}">
                    לפי משתמש
                </a>
            </li>
        </ul>
    </div>
    <div className="tab-content" style="margin-top: 25px; margin-bottom: 70px;">
        <div id="by-bet-{{$match->getID()}}" className="tab-pane fade active in" style="padding: 20px;">
            <table className="table">
                <thead>
                <tr>
                    @if($match->is_done)
                    <td className="admin">מזהה מוכר</td>
                    <th className="col-xs-3">הימור</th>
                    <th className="col-xs-6">מהמרים</th>
                    <th className="col-xs-3">ניקוד</th>
                    @else
                    <td className="admin">מזהה מוכר</td>
                    <th className="col-xs-6">הימור</th>
                    <th className="col-xs-6">מהמרים</th>
                    @endif
                </tr>
                </thead>
                <tbody>
                <?php
                    $bettersByBetValue = [];
                    foreach($match->getBets() as $bet){
                        if ($match->isKnockout()){
                            $betVal = $bet->formatMatchBet(winner_class" => "bolded", "only_if_tied" => true]);
                        } else {
                            $betVal = "".$bet->getData("result-away").":".$bet->getData("result-home");
                        }
                        if (!array_key_exists($betVal, $bettersByBetValue)){
                            $bettersByBetValue[$betVal] = names" => [], "score" => $bet->score];
                        }
                        $bettersByBetValue[$betVal]names"][] = $bet->user->name;
                    }
                    $bettersByBetValue = collect($bettersByBetValue)->sort(function ($a, $b) {
                        return count($b['names']) - count($a['names']);
                    });
                    if ($match->is_done){
                        $bettersByBetValue = $bettersByBetValue->sort(function ($a, $b) {
                            return $b['score'] - $a['score'];
                        });
                    }
                ?>
                @foreach($bettersByBetValue as $betVal => $betData)
                <tr>
                    <td className="admin">{{$bet->user->id}}</td>
                    <td>{!!$betVal !!}</td>
                    <td>{!!implode('<br>', $betData['names']) !!}</td>
                    @if($match->is_done)
                    <td>{{$betData['score']}}</td>
                    @endif
                </tr>
                @endforeach
                </tbody>
            </table>
        </div>
        <div id="by-user-{{$match->getID()}}" className="tab-pane fade" style="padding: 20px;">
            <table className="table">
                <thead>
                <tr>
                    @if($match->is_done)
                    <td className="admin">מזהה מוכר</td>
                    <th className="col-xs-3">שם</th>
                    <th className="col-xs-6">הימור</th>
                    <th className="col-xs-3">ניקוד</th>
                    @else
                    <td className="admin">מזהה מוכר</td>
                    <th className="col-xs-6">שם</th>
                    <th className="col-xs-6">הימור</th>
                    @endif
                </tr>
                </thead>
                <tbody>
                <?php
                    $bets = $match->getBets();
                    if ($match->is_done){
                        $bets = $bets->sort(function ($a, $b) {
                            return $b->score - $a->score;
                        });
                    }
                ?>
                @foreach($bets as $bet)
                <tr>
                    <td className="admin">{{$bet->user->id}}</td>
                    <td>{{$bet->user->name}}</td>
                    @if($match->isKnockout())
                    <td>{!!$bet->formatMatchBet(winner_class" => "bolded", "only_if_tied" => true]) !!}</td>
                    @else
                    <td>{{$bet->getData("result-away")}}:{{$bet->getData("result-home")}}</td>
                    @endif
                    @if($match->is_done)
                    <td>{{$bet->score}}</td>
                    @endif
                </tr>
                @endforeach
                </tbody>
            </table>
        </div>
    </div>
    );
};

export default MatchesTableComponent;