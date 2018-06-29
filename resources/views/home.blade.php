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
                            <ul class="nav nav-tabs">
                                <li class="active" style="float: right"><a data-toggle="tab" href="#groups-{{$row->id}}">בתים</a></li>
                                <li style="float: right"><a data-toggle="tab" href="#group-ranks-{{$row->id}}">מיקומי בתים</a></li>
                                <li style="float: right"><a data-toggle="tab" href="#special-bets-{{$row->id}}">הימורים מיוחדים</a></li>
                            </ul>

                            <div class="tab-content">
                                <div id="groups-{{$row->id}}" class="tab-pane fade in active" style="padding: 20px;">
                                    <h3>סה"כ: {{ $row->betsByType[\App\Enums\BetTypes::Match]->sum("score") }}</h3>
                                    <ul class="list-group">
                                        <li class="list-group-item row" style="background: #d2d2d2;">
                                            <div class="col-sm-2 pull-right">ניקוד</div>
                                            <div class="col-sm-5 pull-right">הימור</div>
                                            <div class="col-sm-3 pull-right">תוצאה</div>
                                        </li>
                                        @foreach($row->betsByType[\App\Enums\BetTypes::Match]->filter(function ($bet) { return $bet->score > 0;})->sortBy("type_id") as $bet)
                                         <?php
                                            /** @var App\Bet $bet */
                                            /** @var App\Match $match */
                                            /** @var \Illuminate\Database\Eloquent\Collection $matches */
                                            $match = $matches->first(function(App\Match $match) use ($bet) { return $match->getID() == $bet->type_id; });
                                            $betDescription = __("teams.{$match->team_home_id}") . " ({$bet->getData("result-home")}) - " . __("teams.{$match->team_away_id}") . " ({$bet->getData("result-away")})";
                                            $resultDescription = "{$match->result_home} - {$match->result_away}";
                                         ?>
                                            <li class="list-group-item row">
                                                <div class="col-sm-2 pull-right">{{ $bet->score }}</div>
                                                <div class="col-sm-5 pull-right">{!! $betDescription !!}</div>
                                                <div class="col-sm-3 pull-right">{!! $resultDescription !!}</div>
                                            </li>
                                        @endforeach
                                    </ul>
                                </div>
                                <div id="group-ranks-{{$row->id}}" class="tab-pane fade" style="padding: 20px;">
                                    <h3>סה"כ: {{ $row->betsByType[\App\Enums\BetTypes::GroupsRank]->sum("score") }}</h3>
                                    <ul class="list-group">
                                        <li class="list-group-item row" style="background: #d2d2d2;">
                                            <div class="col-sm-2 pull-right">ניקוד</div>
                                            <div class="col-sm-5 pull-right">הימור</div>
                                            <div class="col-sm-3 pull-right">תוצאה</div>
                                        </li>
                                        @foreach($row->betsByType[\App\Enums\BetTypes::GroupsRank]->sortBy("type_id") as $bet)
                                        <?php
                                                $group = App\Groups\Group::find($bet->type_id);
                                                $betDescription = "(1) " . __("teams.{$bet->getData("team-a")}") ."<br>(2) " . __("teams.{$bet->getData("team-b")}") ."<br>(3) " . __("teams.{$bet->getData("team-c")}") ."<br>(4) " . __("teams.{$bet->getData("team-d")}") ;
                                                $resultDescription = "(1) " . __("teams.{$group->getTeamIDByRank(1)}") ."<br>(2) " . __("teams.{$group->getTeamIDByRank(2)}") ."<br>(3) " . __("teams.{$group->getTeamIDByRank(3)}") ."<br>(4) " . __("teams.{$group->getTeamIDByRank(4)}") ;
                                        ?>
                                        <li class="list-group-item row">
                                            <div class="col-sm-2 pull-right">{{ $bet->score }}</div>
                                            <div class="col-sm-5 pull-right">{!! $betDescription !!}</div>
                                            <div class="col-sm-5 pull-right">{!! $resultDescription !!}</div>
                                        </li>
                                    @endforeach
                                    </ul>
                                </div>
                                <div id="special-bets-{{$row->id}}" class="tab-pane fade" style="padding: 20px;">
                                    <h3>סה"כ: {{ $row->betsByType[\App\Enums\BetTypes::SpecialBet]->sum("score") }}</h3>
                                    <ul class="list-group">
                                        <li class="list-group-item row" style="background: #d2d2d2;">
                                            <div class="col-sm-1 pull-right">ניקוד</div>
                                            <div class="col-sm-3 pull-right">סוג</div>
                                            <div class="col-sm-3 pull-right">הימור</div>
                                            <div class="col-sm-3 pull-right">תשובה</div>
                                        </li>
                                    @foreach($row->betsByType[\App\Enums\BetTypes::SpecialBet]->sortBy("type_id") as $bet)
                                        <?php
                                        $specialBet = \App\SpecialBets\SpecialBet::find($bet->type_id);
                                        $betDescription = implode(", ", $bet->getData("answers"));
                                        $resultDescription = implode(", ", $specialBet->getAnswers() ?? []);
                                        ?>
                                        <li class="list-group-item row">
                                            <div class="col-sm-1 pull-right">{{ $bet->score }}</div>
                                            <div class="col-sm-3 pull-right">{{ $specialBet->getQuestion() }}</div>
                                            <div class="col-sm-3 pull-right">{!! $betDescription !!}</div>
                                            <div class="col-sm-3 pull-right">{!! $resultDescription !!}</div>
                                        </li>
                                    @endforeach
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                @endforeach
                </tbody>
            </table>
@endsection