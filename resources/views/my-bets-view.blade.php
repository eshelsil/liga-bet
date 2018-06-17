@extends('layouts.home')

@section('content')
    <h1>הטופס שלי</h1>

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
                    {{ $match->getTeamHome()->name }} - {{ $match->getTeamAway()->name }}
                </td>
                <td>
                    {{ $user->getBet($match)->getData("result-away") }}:{{ $user->getBet($match)->getData("result-home") }}
                </td>
                <td>
                    @if($match->result_away) {{ $match->result_away }}:{{ $match->result_home }} @endif
                </td>
            </tr>
        @endforeach
        </tbody>
    </table>
@endsection