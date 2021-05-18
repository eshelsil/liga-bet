@extends('layouts.home')

@section('content')
    <h1>הימורי בתים</h1>
    <div class="row">
        <div class="col-sm-4 pull-right">בית</div>
        <div class="col-sm-7 pull-right">קבוצות</div>
    </div>
@foreach($groups as $group)
<div class="panel-group" style="margin-bottom: 0;">
    <div class="panel panel-default">
        <div class="panel-heading row" style="margin-right: 0;margin-left: 0;">
            <div class="col-sm-4 pull-right">
                <h4 class="panel-title">
                    <a data-toggle="collapse" href="#collapserank-{{$group->id}}">{{$group->name}}</a>
                </h4></div>
            <div class="col-sm-7 pull-right">
                <?php
                    $teamsDescription = "" ;
                    foreach($group->teams as $index => $team){
                        $flag_html = "<img style='margin-left: 5px;' src=\"$team->crest_url\" width='15' height='15'>";
                        $teamsDescription .= $flag_html .$team->name;
                        if ($index < 3){
                            $teamsDescription .= "<br>";
                        }
                    }
                    echo($teamsDescription);
                ?>
            </div>
        </div>
        <div id="collapserank-{{$group->id}}" class="panel-collapse collapse">
            <ul style="margin-left: 20px;">
                <li class="list-group-item row" style="background: #d2d2d2;">
                    <div class="col-sm-4 pull-right">שם</div>
                    <div class="col-sm-7 pull-right">הימור</div>
                </li>
                @foreach($usersWhoBet as $user)
                @php    
                    $bet = $user->bets->where('type_id', $group->id)->first();
                    if (!$bet){
                        continue;
                    }
                    $betDescription = "" ;
                    foreach(range(1, 4) as $position){
                        $bet_team_id = $bet->getData($position);
                        $bet_team = $group->teams->find($bet_team_id);
                        $flag_html = "<img style='margin-left: 5px;' src=\"$bet_team->crest_url\" width='15' height='15'>";
                        $betDescription .= "($position) ". $flag_html . $bet_team->name;
                        if ($position < 4){
                            $betDescription .= "<br>";
                        }
                    }
                @endphp
                <li class="list-group-item row">
                    <div class="col-sm-4 pull-right">{{ $user->name }}</div>
                    <div class="col-sm-7 pull-right">{!! $betDescription !!}</div>
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