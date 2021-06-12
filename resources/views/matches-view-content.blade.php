<?php 
    $matches = $matches;
    $teamsByExtId = $teamsByExtId;
    $show_fetch_button = $with_api_fetch_button ?? false;
?>
@if(count($matches) > 0 && $show_fetch_button)
    <script>
        function fetchFromAPI(){
            $.ajax({
                type: 'GET',
                url: '/api-fetch-games',
                success: function (data) {
                    toastr["success"]("העדכון בוצע בהצלחה");
                },
                error: function(error) {
                    console.log("error", error)
                    const error_text = error.responseText;
                    const server_error_divider = "SERVER_ERROR_MSG:";
                    if (error_text.indexOf(server_error_divider) > -1){
                        const error_msg = error_text.split(server_error_divider)[1];
                        toastr["error"](error_msg);
                    } else {
                        toastr["error"](error_text);
                    }
                }
            });
        }
    </script>
    <button class="btn btn-primary" onclick="fetchFromAPI()" style="margin-right: 10px; margin-top: 15px;">עדכן תוצאות</button>
@endif
@foreach($matches as $match)
    <?php
        $home_team = $teamsByExtId[$match->team_home_id];
        $away_team = $teamsByExtId[$match->team_away_id];
    ?>
    <h3>
        <table style="margin-bottom: 5px;">
            <tbody>
                <tr class="flex-row center-items">
                    <td class="around-huge-flag">
                        @include('widgets.teamWithFlag', $home_team)
                    </td>
                    <td style="padding: 5px;">
                        -
                    </td>
                    <td class="around-huge-flag">
                        @include('widgets.teamWithFlag', $away_team)
                    </td>
                </tr>
            </tbody>
        </table>
        <div style="font-size: 75%">
            <div style="margin-bottom: 5px;">
            {{ DateTime::createFromFormat("U", $match->start_time)->setTimezone(new DateTimeZone("Asia/Jerusalem"))->format("Y/m/d H:i") }}
            </div>
            @if($match->is_done)
            <div class="flex-row center-items" style="margin-bottom: 5px;">
                <span class="label label-success" style="margin-left: 5px; font-size: 12px;">הסתיים</span>
                <span>{{$match->result_home}} - {{$match->result_away}} </span>
            </div>
            @endif
        </div>
    </h3>

    <div class="float-right">
        <ul class="nav nav-tabs float-right">
            <li class="float-right active">
                <a data-toggle="tab" href="#by-bet-{{$match->getID()}}">
                    לפי הימור
                </a>
            </li>
            <li class="float-right">
                <a data-toggle="tab" href="#by-user-{{$match->getID()}}">
                    לפי משתמש
                </a>
            </li>
        </ul>
    </div>
    <div class="tab-content" style="margin-top: 25px; margin-bottom: 70px;">
        <div id="by-bet-{{$match->getID()}}" class="tab-pane fade active in" style="padding: 20px;">
            <table class="table">
                <thead>
                    <tr>
                    @if($match->is_done)
                        <td class="admin">מזהה מוכר</td>
                        <th class="col-xs-3">הימור</th>
                        <th class="col-xs-6">מהמרים</th>
                        <th class="col-xs-3">ניקוד</th>
                    @else
                        <td class="admin">מזהה מוכר</td>
                        <th class="col-xs-6">הימור</th>
                        <th class="col-xs-6">מהמרים</th>
                    @endif
                    </tr>
                </thead>
                <tbody>
                <?php
                    $bettersByBetValue = [];
                    foreach($match->getBets() as $bet){
                        $betVal = "".$bet->getData("result-away").":".$bet->getData("result-home");
                        if (!array_key_exists($betVal, $bettersByBetValue)){
                            $bettersByBetValue[$betVal] = ["names" => [], "score" => $bet->score];
                        }
                        $bettersByBetValue[$betVal]["names"][] = $bet->user->name;
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
                        <td class="admin">{{$bet->user->id}}</td>
                        <td>{{$betVal}}</td>
                        <td>{!! implode('<br>', $betData['names']) !!}</td>
                        @if($match->is_done)
                            <td>{{$betData['score']}}</td>
                        @endif
                    </tr>
                @endforeach
                </tbody>
            </table>
        </div>
        <div id="by-user-{{$match->getID()}}" class="tab-pane fade" style="padding: 20px;">
            <table class="table">
                <thead>
                    <tr>
                    @if($match->is_done)
                        <td class="admin">מזהה מוכר</td>
                        <th class="col-xs-3">שם</th>
                        <th class="col-xs-6">הימור</th>
                        <th class="col-xs-3">ניקוד</th>
                    @else
                        <td class="admin">מזהה מוכר</td>
                        <th class="col-xs-6">שם</th>
                        <th class="col-xs-6">הימור</th>
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
                        <td class="admin">{{$bet->user->id}}</td>
                        <td>{{$bet->user->name}}</td>
                        <td>{{$bet->getData("result-away")}}:{{$bet->getData("result-home")}}</td>
                        @if($match->is_done)
                            <td>{{$bet->score}}</td>
                        @endif
                    </tr>
                @endforeach
                </tbody>
            </table>
        </div>
    </div>

    
@endforeach
