@extends('layouts.home')

@section('content')
            <h1>טבלה עדכנית</h1>
                <div class="row">
                    <div class="col-sm-2 pull-right">מקום</div>
                    <div class="col-sm-8 pull-right">שם</div>
                    <div class="col-sm-2 pull-right">ניקוד</div>
                </div>
                @foreach($table as $row)
                <div class="panel-group" style="margin-bottom: 0;">
                    <div class="panel panel-default">
                        <div class="panel-heading row rank-{{$row->rank}}" style="margin-right: 0;margin-left: 0;">
                            <div class="col-sm-2 pull-right">{{$row->rank}}</div>
                            <div class="col-sm-8 pull-right">
                                <h4 class="panel-title">
                                    <a data-toggle="collapse" href="#collapserank-{{$row->rank}}"><span class="admin">{{$row->id}} </span>{{$row->name}}</a>
                                </h4>
                            </div>
                            <div class="col-sm-2 pull-right">{{$row->total_score}}</div>
                        </div>
                        <div id="collapserank-{{$row->rank}}" class="panel-collapse collapse">
                            <ul class="list-group">
                                <li class="list-group-item row">
                                    <div class="col-sm-2 pull-right">ניקוד</div>
                                    <div class="col-sm-3 pull-right">הימור</div>
                                    <div class="col-sm-3 pull-right">תוצאה</div>
                                </li>
                                @foreach($row->bets->filter(function ($bet) { return $bet->score > 0 || $bet->type == \App\Enums\BetTypes::GroupsRank; })->sortBy("type") as $bet)
                                    <?php
                                        /** @var App\Bet $bet */
                                        /** @var App\Match $match */
                                        /** @var \Illuminate\Database\Eloquent\Collection $matches */
                                        $betEntity = null;
                                        switch ($bet->type) {
                                            case \App\Enums\BetTypes::Match:
                                                $match = $matches->first(function(App\Match $match) use ($bet) { return $match->getID() == $bet->type_id; });
                                                $betDescription = __("teams.{$match->team_home_id}") . " ({$bet->getData("result-home")}) - " . __("teams.{$match->team_away_id}") . " ({$bet->getData("result-away")})";
                                                $resultDescription = "{$match->result_home} - {$match->result_away}";
                                                break;
                                            case \App\Enums\BetTypes::GroupsRank:
                                                $group = App\Groups\Group::find($bet->type_id);
                                                $betDescription = "(1) " . __("teams.{$bet->getData("team-a")}") ."<br>(2) " . __("teams.{$bet->getData("team-b")}") ."<br>(3) " . __("teams.{$bet->getData("team-c")}") ."<br>(4) " . __("teams.{$bet->getData("team-d")}") ;
                                                $resultDescription = "(1) " . __("teams.{$group->getTeamIDByRank(1)}") ."<br>(2) " . __("teams.{$group->getTeamIDByRank(2)}") ."<br>(3) " . __("teams.{$group->getTeamIDByRank(3)}") ."<br>(4) " . __("teams.{$group->getTeamIDByRank(4)}") ;
                                        }
                                    ?>
                                    <li class="list-group-item row">
                                        <div class="col-sm-2 pull-right">{{ $bet->score }}</div>
                                        <div class="col-sm-3 pull-right">{!! $betDescription !!}</div>
                                        <div class="col-sm-3 pull-right">{!! $resultDescription !!}</div>
                                    </li>
                                @endforeach
                            </ul>
                        </div>
                    </div>
                </div>
                @endforeach
                </tbody>
            </table>
@endsection