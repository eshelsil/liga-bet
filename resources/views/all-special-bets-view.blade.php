@extends('layouts.home')

@section('content')
    <div class="row">
        <h1>הימורים לטווח רחוק</h1>
        <div class="float-right">
            <ul class="nav nav-tabs" style="padding-right: 0px;">
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
                <div id="special-bet-wrapper-{{$betId}}" class="tab-pane fade {{$index == 0 ? 'active in' : ''}}" style="padding: 10px;">
                    <h3 class="text-center">{{$betTitle}}</h3>
                    <div class="float-right">
                        <ul class="nav nav-tabs float-right"  style="padding-right: 0px;">
                            <li class="float-right active">
                                <a data-toggle="tab" href="#by-bet-{{$betId}}">
                                    לפי הימור
                                </a>
                            </li>
                            <li class="float-right">
                                <a data-toggle="tab" href="#by-user-{{$betId}}">
                                    לפי משתמש
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div class="tab-content" style="margin-top: 25px;">
                        <div id="by-bet-{{$betId}}" class="tab-pane fade active in" style="padding-top: 35px;">
                            <ul class="list-group" style="padding-right: 0px;">
                                <li class="list-group-item row full-row" style="background: #d2d2d2;">
                                    <div class="col-xs-5 pull-right">הימור</div>
                                    <div class="col-xs-5 pull-right">מהמרים</div>
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
                                    <li class="list-group-item row full-row">
                                        <div class="col-xs-5 pull-right">{!! $specialBet->formatDescription($betValue) !!}</div>
                                        <div class="col-xs-5 pull-right">{!! $bettersDescription !!}</div>
                                    </li>
                                @endforeach
        
                            </ul>
                        </div>
                        <div id="by-user-{{$betId}}" class="tab-pane fade" style="padding-top: 35px;">
                            <?php
                                    $usersWithBets = [];
                                    foreach($usersByBetValue as $betValue => $users){
                                        foreach ($users as $user) {
                                            $user->betValue = $betValue;
                                            $usersWithBets[] = $user;
                                        }
                                    }
                                ?>
                            <ul class="list-group" style="padding-right: 0px;">
                                <li class="list-group-item row full-row" style="background: #d2d2d2;">
                                    <div class="col-xs-5 pull-right">שם</div>
                                    <div class="col-xs-5 pull-right">הימור</div>
                                </li>
                                @foreach($usersWithBets as $user)
                                <li class="list-group-item row full-row">
                                    <div class="col-xs-5 pull-right">{{$user->name}}</div>
                                    <div class="col-xs-5 pull-right">{!! $specialBet->formatDescription($user->betValue) !!}</div>
                                </li>
                                @endforeach
                            </ul>
                        </div>
                    </div>

                    
                </div>
                @endforeach
            </div>
        </div>
    </div>

@endsection