@extends('layouts.home')

@section('content')
    <h1>רשימת משחקים</h1>

    @foreach($matches as $match)
        <?php
            $home_team = $teamsByExtId[$match->team_home_id];
            $away_team = $teamsByExtId[$match->team_away_id];
        ?>
        <h3>
            <div>
                 {{ DateTime::createFromFormat("U", $match->start_time)->setTimezone(new DateTimeZone("Asia/Jerusalem"))->format("Y/m/d H:i") }}
            </div>
            <table>
                <tbody>
                    <tr class="flex-row center-items">
                        <td class="around-huge-flag">
                            @include('widgets.teamWithFlag', $home_team)
                        </td>
                        <td style="padding: 5px;">
                            -
                        </td>
                        <td class="around-huge-flag">
                            @include('widgets.teamWithFlag', $away_team)
                        </td>
                    </tr>
                </tbody>
            </table>
        </h3>

        <div class="float-right">
            <ul class="nav nav-tabs float-right">
                <li class="float-right active">
                    <a data-toggle="tab" href="#by-bet-{{$match->getID()}}">
                        לפי הימור
                    </a>
                </li>
                <li class="float-right">
                    <a data-toggle="tab" href="#by-user-{{$match->getID()}}">
                        לפי משתמש
                    </a>
                </li>
            </ul>
        </div>
        <div class="tab-content" style="margin-top: 25px; margin-bottom: 70px;">
            <div id="by-bet-{{$match->getID()}}" class="tab-pane fade active in" style="padding: 20px;">
                <table class="table">
                    <thead>
                        <tr>
                            <td class="admin">מזהה מוכר</td>
                            <th class="col-sm-6">תוצאה</th>
                            <th class="col-sm-6">מהמרים</th>
                        </tr>
                    </thead>
                    <tbody>
                    <?php
                        $bettersByBetValue = [];
                        foreach($match->getBets() as $bet){
                            $betVal = "".$bet->getData("result-away").":".$bet->getData("result-home");
                            if (!array_key_exists($betVal, $bettersByBetValue)){
                                $bettersByBetValue[$betVal] = [];
                            }
                            $bettersByBetValue[$betVal][] = $bet->user->name;
                        }
                        $bettersByBetValue = collect($bettersByBetValue)->sort(function ($a, $b) {
                            return count($b) - count($a);
                        })->toArray();
                    ?>
                    @foreach($bettersByBetValue as $betVal => $names)
                        <tr>
                            <td class="admin">{{$bet->user->id}}</td>
                            <td>{{$betVal}}</td>
                            <td>{!! implode('<br>', $names) !!}</td>
                        </tr>
                    @endforeach
                    </tbody>
                </table>
            </div>
            <div id="by-user-{{$match->getID()}}" class="tab-pane fade" style="padding: 20px;">
                <table class="table">
                    <thead>
                        <tr>
                            <td class="admin">מזהה מוכר</td>
                            <th class="col-sm-6">שם</th>
                            <th class="col-sm-6">תוצאה</th>
                        </tr>
                    </thead>
                    <tbody>
                    @foreach($match->getBets() as $bet)
                        <tr>
                            <td class="admin">{{$bet->user->id}}</td>
                            <td>{{$bet->user->name}}</td>
                            <td>{{$bet->getData("result-away")}}:{{$bet->getData("result-home")}}</td>
                        </tr>
                    @endforeach
                    </tbody>
                </table>
            </div>
        </div>

        
    @endforeach
@endsection