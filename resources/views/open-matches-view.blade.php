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
            <th style="width: 120px;">
                תאריך
            </th>
            <th>
                משחק
            </th>
            <th style="width: 90px">
                הימור
            </th>
            <th>

            </th>
        </tr>
        </thead>
        <tbody>
        @foreach($matches->sortBy("start_time") as $match)
            <tr>
                <td class="admin">{{ $match->id }}</td>
                <td>
                    {{ DateTime::createFromFormat("U", $match->start_time)->setTimezone(new DateTimeZone("Asia/Jerusalem"))->format("Y/m/d H:i") }}
                </td>

                <td>
                    @include('widgets.teamWithFlag', $teamsByExtId[$match->team_home_id])
                    <br>
                    @include('widgets.teamWithFlag', $teamsByExtId[$match->team_away_id])
                </td>
                <td>
                    <input onfocus="inputChange({{$match->id}})" class="form-control" id="result-home-{{ $match->id }}" type="number" value="{{ $match->bet ? $match->bet->getData("result-home") : "" }}">
                    <input onfocus="inputChange({{$match->id}})" class="form-control" id="result-away-{{ $match->id }}" type="number" value="{{ $match->bet ? $match->bet->getData("result-away") : "" }}">
                </td>
                <td>
                    <button class="btn btn-primary" id="save-match-{{ $match->id }}" onclick="sendMatchBet({{ $match->id }})">שלח</button>
                </td>
            </tr>
        @endforeach
        </tbody>
    </table>
    @endif
    <script>
        function inputChange(matchId){
            $("#save-match-" + matchId).removeClass("btn-success").addClass("btn-primary");
        }
        
        function sendMatchBet(matchID) {
            // TODO: Validated
            $.ajax({
                type: 'POST',
                url: '/user/update',
                contentType: 'application/json',
                data: JSON.stringify({
                    bets: [{
                        type: {{ \App\Enums\BetTypes::Match }},
                        data: {
                            type_id: matchID,
                            "result-home": $("#result-home-" + matchID).val(),
                            "result-away": $("#result-away-" + matchID).val()
                        }
                    }]
                }),
                dataType: 'json',
                success: function (data) {
                    $("#save-match-" + matchID).removeClass("btn-primary").addClass("btn-success");
                },
                error: function(data) {
                    toastr["error"](data.responseJSON.message);
                }
            });

        }
    </script>
@endsection