@extends('layouts.home')

@section('content')
    <div class="row float-right">
        <h1>הימורים לטווח רחוק</h1>
        <div class="float-right">
            <ul class="nav nav-tabs float-right">
                @foreach($specialBets as $index => $specialBet)
                    <li class="float-right {{$index == 0 ? 'active' : ''}}">
                    <a data-toggle="tab" href="#special-bet-wrapper-{{$specialBet->getID()}}">
                        {{$specialBet->getTitle()}}
                    </a>
                </li>
                @endforeach
            </ul>

            <div class="tab-content" style="margin-top: 25px;">
                @foreach($specialBets as $index => $specialBet)
                <?php
                    $betId = $specialBet->getID();
                    $betTitle = $specialBet->getTitle();
                ?>
                <div id="special-bet-wrapper-{{$betId}}" class="tab-pane fade {{$index == 0 ? 'active in' : ''}}" style="padding: 20px;">
                    <h3 class="text-center">{{$betTitle}}</h3>
                    <ul class="list-group">
                        <li class="list-group-item row" style="background: #d2d2d2;">
                            <div class="col-sm-5 pull-right">הימור</div>
                            <div class="col-sm-5 pull-right">מהמרים</div>
                        </li>
                        <?php
                            $relevantBets = $bets->where('type_id', $betId);
                            $usersByBetValue = [];
                            foreach($relevantBets as $bet){
                                $answer = $bet->getAnswer();
                                if (!array_key_exists($answer, $usersByBetValue)){
                                    $usersByBetValue[$answer] = [];
                                }
                                array_push($usersByBetValue[$answer], $bet->user);
                            }
                            $usersByBetValue = collect($usersByBetValue)->sort(function ($a, $b) {
                                return count($b) - count($a);
                            })->toArray();
                        ?>
                        @foreach ($usersByBetValue as $betValue => $users)                        
                            <?php
                                $betters = array_map(function($u){
                                    return $u->name;
                                }, $users);
                                $bettersDescription = implode('<br>', $betters);
                            ?>
                            <li class="list-group-item row">
                                <div class="col-sm-5 pull-right">{!! $specialBet->formatDescription($betValue) !!}</div>
                                <div class="col-sm-5 pull-right">{!! $bettersDescription !!}</div>
                            </li>
                        @endforeach

                    </ul>
                </div>
                @endforeach
            </div>
        </div>
    </div>

@endsection