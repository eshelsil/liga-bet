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
                                    <a data-toggle="collapse" href="#collapserank-{{$row->rank}}">{{$row->name}}</a>
                                </h4>
                            </div>
                            <div class="col-sm-2 pull-right">{{$row->total_score}}</div>
                        </div>
                        <div id="collapserank-{{$row->rank}}" class="panel-collapse collapse">
                            <ul class="list-group">
                                <li class="list-group-item row">
                                    <div class="col-sm-2 pull-right">ניקוד</div>
                                    <div class="col-sm-10 pull-right">הימור</div>
                                </li>
                                @foreach($row->bets->filter(function ($bet) { return $bet->score > 0; }) as $bet)
                                    <?php
                                        /** @var App\Bet $bet */
                                        /** @var App\Match $match */
                                        /** @var \Illuminate\Database\Eloquent\Collection $matches */
                                        $betEntity = null;
                                        switch ($bet->type) {
                                            case \App\Enums\BetTypes::Game:
                                                $match = $matches->first(function($match) use ($bet) { return $match->id == $bet->type_id; });
                                                $betDescription = __("teams.{$match->team_home_id}") . " ({$bet->getData("result-home")}) - " . __("teams.{$match->team_away_id}") . " ({$bet->getData("result-away")})";
                                        }
                                    ?>
                                    <li class="list-group-item row">
                                        <div class="col-sm-2 pull-right">{{ $bet->score }}</div>
                                        <div class="col-sm-10 pull-right">{{ $betDescription }}</div>
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