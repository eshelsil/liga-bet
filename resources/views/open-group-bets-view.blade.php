@extends('layouts.home')

@section('script')
  <style>
  .sortable li { cursor: pointer; margin: 0 3px 3px 3px; padding: 0.4em; padding-left: 1.5em;}
  .sortable > li { cursor: pointer; display: flex; align-items: center; justify-content: start;}
  .sortable li span { position: absolute; margin-left: -1.3em; }
  ol.currentBet li{
    margin-bottom:3px;
  }

  </style>
  
  <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
    <script type="text/javascript">
    $( function() {
        $( ".sortable" ).sortable();
        $( ".sortable" ).disableSelection();
        
    } );
    
    function sendBet(groupId) {
        let list_rows = $(`ol.sortable[data-group='${groupId}']`).children('.team_row');
        let standings = {};
        list_rows.each(function(index, row){
            standings[index+1] = $(row).data('team-id');
        })
        $.ajax({
            type: 'POST',
            url: '/user/update',
            contentType: 'application/json',
            data: JSON.stringify({
                bets: [{
                    type: {{ \App\Enums\BetTypes::GroupsRank }},
                    data: {
                        type_id: groupId,
                        value: standings,
                    }
                }]
            }),
            dataType: 'json',
            success: function (data) {
                $("#save-bet-" + groupId).removeClass("btn-primary").addClass("btn-success");
            },
            error: function(data) {
                toastr["error"](data.responseJSON.message);
            }
        });
    }

    </script>
@endsection

@section('content')
        @if(\App\Group::areBetsOpen())
        <h2>הימורי בתים פתוחים</h2>
        @foreach($groupsTeamsData as $i => $groupTeamsData)
        @php
            $teams = data_get($groupTeamsData, 'teams');
            $group = $groupsByExternalId[data_get($groupTeamsData, 'group_id')];
        @endphp
        <div class="col-sm-12 col-md-9 col-lg-7" style="float: right; border-radius: 5px; border: #000 1px solid; margin-bottom: 25px; padding: 10px;">
            <h5 style="text-align: center;">{{$group->name}}</h5>
            <div class="row">
                @php
                $currentGroup = $currentBetsById[$group->id];
                $currentBet = $currentGroup->bet;
                $groupTeamsById = $currentGroup->teamsById;
                $button_label = $currentBet ? 'עדכן' : 'שלח';
                @endphp
                @if($currentBet)
                @php
                $teams_by_bet_order = [];
                foreach(json_decode($currentBet->data) as $position => $teamId){
                    array_push($teams_by_bet_order, $teams->find($teamId));
                }
                $teams = $teams_by_bet_order;
                @endphp
                <div class="col-sm-5" >
                        <h6>הימור נוכחי:</h6>
                        <ol class="currentBet">
                        @foreach(json_decode($currentBet->data) as $index => $teamId)
                        @php
                        $teamData = $groupTeamsById[$teamId];

                        @endphp
                        <li style="font-size: 80%;">
                            @include('widgets.teamWithFlag', $teamData)
                        </li>
                        @endforeach
                        </ol>
                </div>
                <div  class="col-sm-7">
                @else
                <div class="col-sm-12">
                @endif
                    <ol class="sortable" data-group="{{$group->id}}">
                        @foreach($teams as $team_data)
                            <div class="team_row" data-team-id="{{$team_data->id}}">
                                <li class="bg-info">
                                    <img class="team_flag larger no-border" src="{{$team_data->crest_url}}">
                                    <span style="position:relative;">{{$team_data->name}}</span>
                                </li>
                            </div>
                                @endforeach
                    </ol>
                    <div style="padding-right:40px;">
                        <button id="save-bet-{{$group->id}}" onClick="sendBet('{{$group->id}}')" type="button" class="btn btn-primary">{{$button_label}}</button>
                    </div>
                </div>
            </div>
        </div>
        
        @endforeach

        @else
        <h2>נסגרו הימורי הבתים! לא ניתן לעדכן הימורים אלה</h2>
        @endif

@endsection