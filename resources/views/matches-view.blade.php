@extends('layouts.home')

@section('content')
    <h1>רשימת משחקים</h1>

    @foreach($matches as $match)
        <?php
            $home_team = $teamsByExtId[$match->team_home_id];
            $away_team = $teamsByExtId[$match->team_away_id];
        ?>
        <h3>
            <div>
                 {{ DateTime::createFromFormat("U", $match->start_time)->setTimezone(new DateTimeZone("Asia/Jerusalem"))->format("Y/m/d H:i") }}
            </div>
            <table>
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
        </h3>

        <table class="table" style="margin-bottom: 70px;">
            <thead>
            <tr>
                <td class="admin">מזהה מוכר</td>
                <th>שם</th>
                <th>תוצאה</th>
            </tr>
            </thead>
            <tbody>
            @foreach($match->getBets() as $bet)
                <tr>
                    <td class="admin">{{$bet->user->id}}</td>
                    <td>{{$bet->user->name}}</td>
                    <td>{{$bet->getData("result-away")}}:{{$bet->getData("result-home")}}</td>
                </tr>
            @endforeach
            </tbody>
        </table>
    @endforeach
@endsection