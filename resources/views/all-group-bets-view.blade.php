@extends('layouts.home')

@section('content')
    <h1>הימורי בתים</h1>
    <div class="row">
        <div class="col-xs-4 pull-right">בית</div>
        <div class="col-xs-7 pull-right">קבוצות</div>
    </div>
@foreach($groups as $group)
<div class="panel-group" style="margin-bottom: 0;">
    <div class="panel panel-default">
        <div class="panel-heading row" style="margin-right: 0;margin-left: 0;">
            <div class="col-xs-4 pull-right">
                <h4 class="panel-title">
                    <a data-toggle="collapse" href="#collapserank-{{$group->id}}">{{$group->name}}</a>
                </h4></div>
            <div class="col-xs-7 pull-right">
                @foreach($group->teams as $index => $team)
                    @include('widgets.teamWithFlag', $team)
                @endforeach
                
            </div>
        </div>
        <div id="collapserank-{{$group->id}}" class="panel-collapse collapse">
            

            <div class="float-right">
                <ul class="nav nav-tabs float-right">
                    <li class="float-right active">
                        <a data-toggle="tab" href="#by-bet-{{$group->id}}">
                            לפי הימור
                        </a>
                    </li>
                    <li class="float-right">
                        <a data-toggle="tab" href="#by-user-{{$group->id}}">
                            לפי משתמש
                        </a>
                    </li>
                </ul>
            </div>
            <div class="tab-content" style="margin-top: 25px">
                <div id="by-bet-{{$group->id}}" class="tab-pane fade active in" style="padding: 20px; margin-bottom: 30px;">
                        <?php
                            $bettersByBetValue = [];
                            foreach($usersWhoBet as $user){
                                $bet = $user->bets->where('type_id', $group->id)->first();
                                if (!$bet){
                                    continue;
                                }
                                $bet_data = $bet->getData();
                                $bet_value = json_encode($bet_data);
                                if (!array_key_exists($bet_value, $bettersByBetValue)){
                                    $bettersByBetValue[$bet_value] = ["names" => [], "score" => $bet->score];
                                }
                                $bettersByBetValue[$bet_value]["names"][] = $user->name;
                            }
                            $bettersByBetValue = collect($bettersByBetValue)->sort(function ($a, $b) {
                                if ($b['score'] !== $a['score'] ){
                                    return $b['score'] - $a['score'];
                                }
                                return count($b['names']) - count($a['names']);
                            })->toArray();
                        ?>
                    <table class="table">
                        <thead>
                            <tr>
                                <th class="col-xs-4">
                                    הימור
                                </th>
                                <th class="col-xs-7">
                                    מהמרים
                                </th>
                                <th class="col-xs-1">
                                    נק'
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($bettersByBetValue as $betValue => $bettersData)
                                <?php    
                                    $bet_data = json_decode($betValue);
                                    $names = $bettersData["names"];
                                    $score = $bettersData["score"];
                                ?>
                                <tr>
                                    <td>
                                    @foreach (range(1,4) as $position)
                                        <?php
                                            $bet_team_id = data_get($bet_data, $position);
                                            $bet_team = $group->teams->find($bet_team_id);
                                        ?>
                                        <div class="flex-row">
                                            <span>({{$position}}) </span>
                                            @include('widgets.teamWithFlag', $bet_team)
                                        </div>
                                    @endforeach
                                    </td>
                                    <td>{!! implode('<br>', $names) !!}</td>
                                    <td>{{ $score }}</td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
                <div id="by-user-{{$group->id}}" class="tab-pane fade" style="padding: 20px; margin-bottom: 30px;">
                    <table class="table">
                        <thead>
                            <tr>
                                <th class="col-xs-4">
                                    שם
                                </th>
                                <th class="col-xs-7">
                                    הימור
                                </th>
                                <th class="col-xs-1">
                                    נק'
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php    
                                $bet = $user->bets->where('type_id', $group->id)->first();
                                $rows = collect($usersWhoBet)->map(function($user) use($group){
                                    $bet = $user->bets->where('type_id', $group->id)->first();
                                    return ["user" => $user, "bet" => $bet, "score" => $bet->score ?? null];
                                });
                                $rows = collect($rows)->sortByDesc("score")->toArray();
                            ?>
                            @foreach($rows as $row)
                                <?php    
                                    $bet = $row['bet'];
                                    $user = $row['user'];
                                    $score = $row['score'];
                                ?>
                                @if ($bet)
                                    <tr>
                                        <td>{{ $user->name }}</td>
                                        <td>
                                        @foreach (range(1,4) as $position)
                                            <?php
                                                $bet_team_id = $bet->getData($position);
                                                $bet_team = $group->teams->find($bet_team_id);
                                            ?>
                                            <div class="flex-row">
                                                <span>({{$position}}) </span>
                                                @include('widgets.teamWithFlag', $bet_team)
                                            </div>
                                        @endforeach
                                        </td>
                                        <td>{{ $score }}</td>
                                    </tr>
                                @endif
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    </div>
</div>
@endforeach
</tbody>
</table>

@endsection