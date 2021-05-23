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
                @foreach($group->teams as $index => $team)
                    @include('widgets.teamWithFlag', $team)
                @endforeach
                
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
                @endphp
                @if ($bet)
                    <li class="list-group-item row">
                        <div class="col-sm-4 pull-right">{{ $user->name }}</div>
                        <div class="col-sm-7 pull-right">
                        @foreach (range(1,4) as $position)
                            @php
                                $bet_team_id = $bet->getData($position);
                                $bet_team = $group->teams->find($bet_team_id);
                            @endphp
                            <div class="flex-row">
                                <span>({{$position}}) </span>
                                @include('widgets.teamWithFlag', $bet_team)
                            </div>
                        @endforeach
                        </div>
                    </li>
                @endif
                @endforeach
            </ul>        
        </div>
    </div>
</div>
@endforeach
</tbody>
</table>

@endsection