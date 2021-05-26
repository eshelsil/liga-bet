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
        @foreach($user->getSpecialBetsById() as $specialBetId => $specialBet)
            @if($specialBet->bet)
            <tr>
                <td class="admin">{{ $specialBet->getID() }}</td>

                <td>
                    {!! $specialBet->getTitle() !!}
                </td>
                <td>
                    {!! $specialBet->formatDescription($specialBet->bet->getAnswer()) !!}
                </td>
                <td>
                    {!! $specialBet->formatDescription($specialBet->getAnswer()) !!}
                </td>
            </tr>
            @endif
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
            <?php
                $home_team = $teams->where('external_id', $match->team_home_id)->first();
                $away_team = $teams->where('external_id', $match->team_away_id)->first();
            ?>
            <tr>
                <td class="admin">{{ $match->id }}</td>

                <td class="flex-row v-align-center">
                    <table>
                        <tbody>
                            <td>
                                @include('widgets.teamWithFlag', $home_team)
                            </td>
                            <td style="padding: 5px;">
                                -
                            </td>
                            <td>
                                @include('widgets.teamWithFlag', $away_team)
                            </td>
                        </tbody>
                    </table>
                </td>
                <td class="v-align-center">
                    @if($user->getBet($match)) {{ $user->getBet($match)->getData("result-away") }}:{{ $user->getBet($match)->getData("result-home") }} @endif
                </td>
                <td class="v-align-center">
                    @if(!is_null($match->result_away)) {{ $match->result_away }}:{{ $match->result_home }} @endif
                </td>
            </tr>
        @endforeach
        </tbody>
    </table>

    <?php
        $teamsById = $teams->groupBy('id')->map(function($t){
            return $t->first();
        });
    ?>

    <table class="table table-striped">
        <thead>
        <tr>
            <th class="admin">מזהה</th>
            <th>
                בית
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
        @foreach($groups as $group)
            <tr>
                  <td class="admin">{{ $group->getID() }}</td>

                <td>
                    {{ $group->getName() }}
                </td>
                <td>
                    @if ($group->bet)
                    <div class="col pull-right">
                        @foreach (range(1,4) as $position)
                            @php
                                $bet_team_id = $group->bet->getData($position);
                                $bet_team = $teamsById[$bet_team_id];
                            @endphp
                            <div class="flex-row">
                                <span>({{$position}}) </span>
                                @include('widgets.teamWithFlag', $bet_team)
                            </div>
                        @endforeach
                    </div>
                    @endif
                </td>
                <td>
                    @if ($group->isComplete())
                        @foreach(range(1,4) as $position)
                            @php
                                $res_team_id = $group->getTeamIDByPosition($position);
                                $res_team = $teamsById[$res_team_id];
                            @endphp
                            <div class="flex-row">
                                <span>({{$position}}) </span>
                                @include('widgets.teamWithFlag', $res_team)
                            </div>
                        @endforeach
                    @endif
                </td>
            </tr>
        @endforeach
        </tbody>
    </table>
@endsection