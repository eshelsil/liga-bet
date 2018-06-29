@extends('layouts.home')

@section('content')
    <h1>הטופס שלי</h1>

    <table class="table table-striped">
        <thead>
        <tr>
            <th class="admin">מזהה</th>
            <th>
                סוג
            </th>
            <th>
                הימור
            </th>
            <th>
                תוצאה
            </th>
        </tr>
        </thead>
        <tbody>
        @foreach($user->getSpecialBets() as $bet)
            <tr>
                <td class="admin">{{ $bet->type_id }}</td>

                <td>
                    {!! $bet->specialBet->getQuestion() !!}
                </td>
                <td>
                    {!! implode(",", $bet->getData("answers")) !!}
                </td>
                <td>
                    {!! $bet->specialBet->getAnswers() ? implode(",", $bet->specialBet->getAnswers()) : "" !!}
                </td>
            </tr>
        @endforeach

        </tbody>
    </table>

    <table class="table table-striped">
        <thead>
        <tr>
            <th class="admin">מזהה</th>
            <th>
                משחק
            </th>
            <th>
                הימור
            </th>
            <th>
                תוצאה
            </th>
        </tr>
        </thead>
        <tbody>
        @foreach($matches as $match)
            <tr>
                <td class="admin">{{ $match->id }}</td>

                <td>
                    {{ __("teams.{$match->team_home_id}") }} - {{ __("teams.{$match->team_away_id}") }}
                </td>
                <td>
                    @if($user->getBet($match)) {{ $user->getBet($match)->getData("result-away") }}:{{ $user->getBet($match)->getData("result-home") }} @endif
                </td>
                <td>
                    @if(!is_null($match->result_away)) {{ $match->result_away }}:{{ $match->result_home }} @endif
                </td>
            </tr>
        @endforeach
        </tbody>
    </table>
@endsection