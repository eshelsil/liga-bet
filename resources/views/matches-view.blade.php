@extends('layouts.home')

@section('content')
    <h1>רשימת משחקים</h1>

    @foreach($matches as $match)
        {{--<h3>{{ $match->team_home_id }} - {{ $match->team_away_id }}</h3>--}}
        <h3>{{ __("teams.{$match->team_home_id}") }} - {{ __("teams.{$match->team_away_id}")  }} - {{ DateTime::createFromFormat("U", $match->start_time)->setTimezone(new DateTimeZone("Asia/Jerusalem"))->format("Y/m/d H:i") }}</h3>
        <table class="table">
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