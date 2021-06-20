@extends('layouts.home')

@section('script')
    
@endsection

@section('content')
    <h1>רשימת משחקים</h1>
    <span class="admin">{{ DateTime::createFromFormat("U", time())->setTimezone(new DateTimeZone("Asia/Jerusalem"))->format("Y/m/d H:i") }}</span>

    @if($matches->isEmpty())
    <h3>אין משחקים פתוחים</h3>
    @else
    <table class="table table-striped">
        <thead>
        <tr>
            <th class="admin">מזהה</th>
            <th class="open-matches-date-header">
                תאריך
            </th>
            <th>
                משחק
            </th>
            <th class="open-matches-bet-header" style="padding-left: 30px;">
                הימור
            </th>
            <th>

            </th>
        </tr>
        </thead>
        <tbody>
        @foreach($matches->sortBy("start_time") as $match)
            <?php
                $m_type = $match->isKnockout() ? "knockout" : "groups";
                $showRadio = $match->isKnockout() && $match->bet && ($match->bet->getData("result-home") == $match->bet->getData("result-away"));
                $radioVal = $showRadio ? $match->bet->getData("ko_winner_side") : null;
                $homeRadioChecked = $radioVal == "home";
                $awayRadioChecked = $radioVal == "away";
                if ($homeRadioChecked){
                    $homeScoreInputClass = "winner_color";
                    $awayScoreInputClass = "loser_color";
                } else if ($awayRadioChecked){
                    $awayScoreInputClass = "winner_color";
                    $homeScoreInputClass = "loser_color";
                } else {
                    $homeScoreInputClass = "";
                    $awayScoreInputClass = "";
                }
                $bet_winner_side = ($match->bet && $match->isKnockout()) ? $match->bet->getWinnerSide() : null;
            ?>
            <tr id="row_match_{{$match->id}}">
                <td class="admin">{{ $match->id }}</td>
                <td class="v-align-center">
                    {{ DateTime::createFromFormat("U", $match->start_time)->setTimezone(new DateTimeZone("Asia/Jerusalem"))->format("d/m H:i") }}
                </td>
                <td class="open-match-teams-cell v-align-center">
                    @include('widgets.teamWithFlag', array_merge($teamsByExtId[$match->team_home_id]->toArray(), [
                        "is_winner_bg"=> $bet_winner_side === "home",
                        "is_loser_bg"=> $bet_winner_side === "away",
                    ]))
                    <br>
                    @include('widgets.teamWithFlag', array_merge($teamsByExtId[$match->team_away_id]->toArray(), [
                        "is_winner_bg"=> $bet_winner_side === "away",
                        "is_loser_bg"=> $bet_winner_side === "home",
                    ]))
                </td>
                <td class="open-matches-bet-cell">
                    <div id="ko_switch_input_{{$match->id}}" class="ko_switch_input" {{$showRadio ? '' : 'hidden'}}>
                        <div class="tw-toggle">
                            <input type="radio" onchange="koWinnerInputChange({{$match->id}})" value="home"
                                id="ko_winner_radio_{{$match->id}}_home" name="ko_winner_of_match_{{$match->id}}"
                                class="home-radio" {{$homeRadioChecked ? 'checked' : ''}}>
                            <label class="toggle"><i class="fa fa-star" aria-hidden="true"></i></label>
                            <label class="arrow"><i class="fa fa-arrows-v arrow-icon"></i></label>
                            <input type="radio" onchange="koWinnerInputChange({{$match->id}})" value="away"
                                id="ko_winner_radio_{{$match->id}}_away" name="ko_winner_of_match_{{$match->id}}"
                                class="away-radio" {{$awayRadioChecked ? 'checked' : ''}}>
                            <label class="toggle"><i class="fa fa-star"></i></label>
                            <span></span>
                        </div>
                    </div>
                    <div class="row full-row">
                        <div class ="spaced-row">
                            <input onchange="scoreInputChange({{$match->id}}, '{{$m_type}}')" class="form-control open-match-input {{$homeScoreInputClass}}"
                                    id="result-home-{{ $match->id }}" type="number" value="{{ $match->bet ? $match->bet->getData("result-home") : "" }}">
                        </div>
                        <div class="row full-row" style="height: 16px; font-size: 11px;">
                            <span id="ko_winner_note_{{$match->id}}" hidden>מעפילה:</span>
                        </div>
                        <div class="spaced-row">
                            <input onchange="scoreInputChange({{$match->id}}, '{{$m_type}}')" class="form-control open-match-input {{$awayScoreInputClass}}"
                                    id="result-away-{{ $match->id }}" type="number" value="{{ $match->bet ? $match->bet->getData("result-away") : "" }}">
                        </div>
                    </div>
                </td>
                <td class="v-align-center">
                    <button class="btn btn-sm btn-primary" id="save-match-{{ $match->id }}" onclick="sendMatchBet({{ $match->id }}, '{{$m_type}}')">שלח</button>
                </td>
            </tr>
        @endforeach
        </tbody>
    </table>
    @endif
    <script>

        function colorScoreInputs(matchId){
            const winner_side = $(`input[type="radio"][name="ko_winner_of_match_${matchId}"]:checked`).val();
            const home_input = $(`#result-home-${matchId}`);
            const away_input = $(`#result-away-${matchId}`);
            if (winner_side == "away"){
                away_input.addClass("winner_color").removeClass("loser_color")
                home_input.addClass("loser_color").removeClass("winner_color")
            } else if (winner_side == "home") {
                home_input.addClass("winner_color").removeClass("loser_color")
                away_input.addClass("loser_color").removeClass("winner_color")
            } else {
                home_input.removeClass("winner_color loser_color")
                away_input.removeClass("winner_color loser_color")
            }
            indicateCurrentWinner(matchId, winner_side);
        }
        
        function koWinnerInputChange(matchId){
            toggleKoWinnerNote(matchId, false);
            colorScoreInputs(matchId);
        }

        function indicateCurrentWinner(matchId, winner_side){
            const bet_row = $(`#row_match_${matchId}`);
            let [home_team_span, away_team_span] = bet_row.find("span.team_with_flag-span");
            home_team_span = $(home_team_span);
            away_team_span = $(away_team_span);

            if (winner_side === "home"){
                home_team_span.addClass('bet-winner-bg');
                home_team_span.removeClass('bet-loser-bg');
                away_team_span.addClass('bet-loser-bg');
                away_team_span.removeClass('bet-winner-bg');
            } else if (winner_side === "away"){
                home_team_span.addClass('bet-loser-bg');
                home_team_span.removeClass('bet-winner-bg');
                away_team_span.addClass('bet-winner-bg');
                away_team_span.removeClass('bet-loser-bg');
            } else {
                home_team_span.removeClass('bet-winner-bg bet-loser-bg');
                away_team_span.removeClass('bet-winner-bg bet-loser-bg');
            }
        }

        function scoreInputChange(matchId, matchType){
            $("#save-match-" + matchId).removeClass("btn-success").addClass("btn-primary");
            if (matchType !== "knockout"){
                return
            }

            let away_val = $("#result-away-" + matchId).val();
            let home_val = $("#result-home-" + matchId).val();
            if (home_val !== "" &&  home_val === away_val){
                toggleKoWinnerInput(matchId, true);
            } else {
                toggleKoWinnerInput(matchId, false);
            }

            if (away_val === "" || home_val === "" ){
                indicateCurrentWinner(matchId, null);
            } else {
                const away_score = Number(away_val);
                const home_score = Number(home_val);
                if ( isNaN(away_score) || isNaN(home_score) || away_score === home_score ){
                    indicateCurrentWinner(matchId, null);
                } else if (home_score > away_score){
                    indicateCurrentWinner(matchId, "home");
                } else {
                    indicateCurrentWinner(matchId, "away");
                }
            }
        }

        function toggleKoWinnerNote(matchId, shouldShow){
            $(`#ko_winner_note_${matchId}`).prop("hidden", !shouldShow);
        }
        function toggleKoWinnerInput(matchId, shouldShow){
            toggleKoWinnerNote(matchId, shouldShow);
            $(`#ko_switch_input_${matchId}`).prop("hidden", !shouldShow);
            if (!shouldShow){
                const radio_input = $(`input[type="radio"][name="ko_winner_of_match_${matchId}"]`);
                radio_input.prop("checked", false);
                colorScoreInputs(matchId);
            }
        }
        
        function sendMatchBet(matchID, matchType) {
            let home_val = $("#result-home-" + matchID).val();
            let away_val = $("#result-away-" + matchID).val();
            const valid_input_vals = [...Array(21).keys()];
            if (home_val === "" || valid_input_vals.indexOf(Number(home_val)) === -1){
                toastr["error"](`כמות שערים לקבוצה חייבת להיות מספר שלם בין 0 ל-20. הערך שהתקבל לקבוצת הבית: ${home_val}`)
                return
            }
            if (away_val === "" || valid_input_vals.indexOf(Number(away_val)) === -1){
                toastr["error"](`כמות שערים לקבוצה חייבת להיות מספר שלם בין 0 ל-20. הערך שהתקבל לקבוצת החוץ: ${away_val}`)
                return
            }
            let params = {
                type_id: matchID,
                "result-home": home_val,
                "result-away": away_val
            }
            if (matchType === "knockout" && home_val == away_val){
                const winner_side = $(`input[type="radio"][name="ko_winner_of_match_${matchID}"]:checked`).val();
                params['winner_side'] = winner_side;
                if (winner_side == undefined){
                    toastr["error"](`עלייך לבחור מעפילה (מכיוון שסימנת משחק נוקאאוט שייגמר בתיקו)`)
                    return
                }
            }
            $.ajax({
                type: 'POST',
                url: '/user/update',
                contentType: 'application/json',
                data: JSON.stringify({
                    bets: [{
                        type: {{ \App\Enums\BetTypes::Match }},
                        data: params
                    }]
                }),
                dataType: 'json',
                success: function (data) {
                    $("#save-match-" + matchID).removeClass("btn-primary").addClass("btn-success");
                    toastr["success"]("ההימור נשלח");
                },
                error: function(data) {
                    toastr["error"](data.responseJSON.message);
                }
            });

        }
    </script>
@endsection