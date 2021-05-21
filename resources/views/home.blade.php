@extends('layouts.home')

@php
    $show_table = $show_table ?? true;
@endphp
@section('content')
    @if ($show_table)
    
    <h1>טבלה עדכנית</h1>
        <div class="row">
            <div class="col-sm-2 pull-right">מקום</div>
            <div class="col-sm-8 pull-right">שם</div>
            <div class="col-sm-1 pull-right">ניקוד</div>
        </div>
        @foreach($table as $row)
        <div class="panel-group" style="margin-bottom: 0;">
            <div class="panel panel-default">
                <div class="panel-heading row rank-{{$row->rank}}" style="margin-right: 0;margin-left: 0;">
                    <div class="col-sm-1 pull-right">{{$row->rank}}</div>
                    <div class="col-sm-8 pull-right">
                        <h4 class="panel-title">
                            <a data-toggle="collapse" href="#collapserank-{{$row->rank}}"><span class="admin">{{$row->id}} </span>{{$row->name}}</a>
                        </h4>
                    </div>
                    <div class="col-sm-2 pull-right">{{$row->total_score}}</div>
                </div>
                <div id="collapserank-{{$row->rank}}" class="panel-collapse collapse">
                    <ul class="nav nav-tabs">
                        <li class="active" style="float: right"><a data-toggle="tab" href="#groups-{{$row->id}}">משחקים</a></li>
                        <li style="float: right"><a data-toggle="tab" href="#group-ranks-{{$row->id}}">מיקומי בתים</a></li>
                        <li style="float: right"><a data-toggle="tab" href="#special-bets-{{$row->id}}">הימורים מיוחדים</a></li>
                    </ul>

                    <div class="tab-content">
                        <div id="groups-{{$row->id}}" class="tab-pane fade in active" style="padding: 20px;">
                            @php
                                $betType = \App\Enums\BetTypes::Match;
                                $matchBets = $row->betsByType->has($betType) ? $row->betsByType[$betType] : collect();
                            @endphp
                            <h3>סה"כ: {{ $matchBets->sum("score") }}</h3>
                            <ul class="list-group">
                                <li class="list-group-item row" style="background: #d2d2d2;">
                                    <div class="col-sm-1 pull-right">ניקוד</div>
                                    <div class="col-sm-5 pull-right">הימור</div>
                                    <div class="col-sm-3 pull-right">תוצאה</div>
                                </li>
                                @foreach($matchBets->filter(function ($bet) { return $bet->score > 0;})->sortBy("type_id") as $bet)
                                    <?php
                                    /** @var App\Bet $bet */
                                    /** @var App\Match $match */
                                    /** @var \Illuminate\Database\Eloquent\Collection $matches */
                                    $match = $matches->first(function(App\Match $match) use ($bet) { return $match->getID() == $bet->type_id; });
                                    $betDescription = __("teams.{$match->team_home_id}") . " ({$bet->getData("result-home")}) - " . __("teams.{$match->team_away_id}") . " ({$bet->getData("result-away")})";
                                    $resultDescription = "{$match->result_home} - {$match->result_away}";
                                    ?>
                                    <li class="list-group-item row">
                                        <div class="col-sm-1 pull-right">{{ $bet->score }}</div>
                                        <div class="col-sm-5 pull-right">{!! $betDescription !!}</div>
                                        <div class="col-sm-3 pull-right">{!! $resultDescription !!}</div>
                                    </li>
                                @endforeach
                            </ul>
                        </div>
                        <div id="group-ranks-{{$row->id}}" class="tab-pane fade" style="padding: 20px;">
                            @php
                                $betType = \App\Enums\BetTypes::GroupsRank;
                                $groupRankBets = $row->betsByType->has($betType) ? $row->betsByType[$betType] : collect();
                            @endphp
                            <h3>סה"כ: {{ $groupRankBets->sum("score") }}</h3>
                            <ul class="list-group">
                                <li class="list-group-item row" style="background: #d2d2d2;">
                                    <div class="col-sm-1 pull-right">ניקוד</div>
                                    <div class="col-sm-5 pull-right">הימור</div>
                                    <div class="col-sm-5 pull-right">תוצאה</div>
                                </li>
                                @foreach($groupRankBets->sortBy("type_id") as $bet)
                                <?php
                                        $group = App\Group::find($bet->type_id);
                                        if ($group->isComplete()){
                                            $teamsById = $group->getGroupTeamsById();
                                            $betDescription = "" ;
                                            $resultDescription = "" ;
                                            foreach(range(1, 4) as $position){
                                                $res_team_id = $group->getTeamIDByPosition($position);
                                                $res_team = $teamsById[$res_team_id];
                                                $flag_html = "<img style='margin-left: 5px;' src=\"$res_team->crest_url\" width='15' height='15'>";
                                                $resultDescription .= "($position) " .$flag_html .$res_team->name;

                                                $bet_team_id = $bet->getData($position);
                                                $bet_team = $teamsById[$bet_team_id];
                                                $flag_html = "<img style='margin-left: 5px;' src=\"$bet_team->crest_url\" width='15' height='15'>";
                                                $betDescription .= "($position) ". $flag_html . $bet_team->name;
                                                if ($position < 4){
                                                    $betDescription .= "<br>";
                                                    $resultDescription .= "<br>";
                                                }

                                            }
                                        }
                                ?>
                                @if ($group->isComplete())
                                <li class="list-group-item row">
                                    <div class="col-sm-1 pull-right">{{ $bet->score }}</div>
                                    <div class="col-sm-5 pull-right">{!! $betDescription !!}</div>
                                    <div class="col-sm-5 pull-right">{!! $resultDescription !!}</div>
                                </li>
                                @endif
                            @endforeach
                            </ul>
                        </div>
                        <div id="special-bets-{{$row->id}}" class="tab-pane fade" style="padding: 20px;">
                            @php
                                $betType = \App\Enums\BetTypes::SpecialBet;
                                $specialBets = $row->betsByType->has($betType)  ? $row->betsByType[$betType] : collect();
                            @endphp
                            <h3>סה"כ: {{ $specialBets->sum("score") }}</h3>
                            <ul class="list-group">
                                <li class="list-group-item row" style="background: #d2d2d2;">
                                    <div class="col-sm-1 pull-right">ניקוד</div>
                                    <div class="col-sm-3 pull-right">סוג</div>
                                    <div class="col-sm-3 pull-right">הימור</div>
                                    <div class="col-sm-3 pull-right">תשובה</div>
                                </li>
                            @foreach($specialBets->sortBy("type_id") as $bet)
                                <?php
                                $specialBet = \App\SpecialBets\SpecialBet::find($bet->type_id);
                                $betDescription = $specialBet->formatDescription($bet->getData("answer"));
                                $answer = $specialBet->getAnswer();
                                if (is_array($answer)){
                                    $resultDescription = implode(', ', $answer);
                                } else {
                                    $resultDescription = $answer;
                                }
                                ?>
                                <li class="list-group-item row">
                                    <div class="col-sm-1 pull-right">{{ $bet->score }}</div>
                                    <div class="col-sm-3 pull-right">{{ $specialBet->getTitle() }}</div>
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

    @else
        <h2>האתר יהיה זמין לך ברגע שתאושר על ידי אחד מהאדמינים</h2>
    @endif
@endsection