@extends('layouts.home')

@section('content')
    <h1>רשימת משחקים</h1>

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
        @foreach($matches as $match)
            <tr>
                <td class="admin">{{ $match->id }}</td>
                <td>
                    {{ DateTime::createFromFormat("U", $match->start_time)->setTimezone(new DateTimeZone("Asia/Jerusalem"))->format("Y/m/d H:i") }}
                </td>

                <td>
                    {{ __("teams.{$match->team_home_id}") }} <br> {{ __("teams.{$match->team_away_id}") }}
                </td>
                <td>
                    <input class="form-control" id="result-home-{{ $match->id }}" type="number">
                    <input class="form-control" id="result-away-{{ $match->id }}" type="number">
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