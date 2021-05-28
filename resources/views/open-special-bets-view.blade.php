@extends('layouts.home')

@php
    $topScorerDropdownTitle = "----בחר מלך שערים----";
    $teamSelectionTitle = "----בחר קבוצה----";
    $scorersList = \App\Scorer::all(['external_id as id', 'name', 'team_id'])->sortBy('name')->toArray();
    $teams = \App\Team::all(['id', 'name', 'crest_url'])->sortBy('name')->toArray();
    $inputAttrMap = [
            'top_scorer' => [
                'type' => 'select',
                'title' => $topScorerDropdownTitle,
                'options' => $scorersList,
            ],
            'winner' => [
                'type' => 'select',
                'title' => $teamSelectionTitle,
                'options' => $teams,
            ],
            'runner_up' => [
                'type' => 'select',
                'title' => $teamSelectionTitle,
                'options' => $teams,
            ],
            'offensive_team' => [
                'type' => 'select',
                'title' => $teamSelectionTitle,
                'options' => $teams,
            ],
            'mvp' => [
                'type' => 'text',
            ],
            'most_assists' => [
                'type' => 'text',
            ],
        ];  
@endphp

@section('script')
<style>
    .left-to-right  { direction: ltr; text-align: left;}
    .betContent {display: table-cell;}
    .betContent .inputWrapper {
        display: flex;
        flex-direction: column;
        width: fit-content;
        width: -moz-fit-content;
    }
    .betContent .inputWrapper > * {
        margin-bottom: 10px;
    }
    .betContent .btn {
        margin-bottom: 10px;
    }
    .currentBetWrapper > span{
        margin-left: 3px;
        margin-right: 3px;
        font-weight: 700;
    }
    h6{
        margin-top: 3px;
        color: #444
    }
</style>
<script type="text/javascript">


    function sendBet(betId) {
        const top_scorer_bet_id = "{{ \App\SpecialBets\SpecialBet::getBetTypeIdByName('top_scorer') }}";
        const offensive_team_bet_id = "{{ \App\SpecialBets\SpecialBet::getBetTypeIdByName('offensive_team') }}";
        const champions_bet_id = "{{ \App\SpecialBets\SpecialBet::getBetTypeIdByName('winner') }}";
        const runner_up_scorer_bet_id = "{{ \App\SpecialBets\SpecialBet::getBetTypeIdByName('runner_up') }}";
        const teamSelectionBetIds = [runner_up_scorer_bet_id, champions_bet_id, offensive_team_bet_id]
        const selectionBetIds = [
            ...teamSelectionBetIds,
            top_scorer_bet_id
        ]
        const isTopScorerBet = betId == top_scorer_bet_id;

        let value;
        if (selectionBetIds.indexOf(betId) > -1){
            const input = $(`#${betId}_select_input`);
            value = input.val();
            if (value == "no_value") {
                let optionEntity = isTopScorerBet ? 'player' : 'team';
                toastr["error"](`No ${optionEntity} was selected`);
                return;
            }
        } else {
            const input = $(`.special_bet_input[data-bet-id='${betId}']`);
            value = input.val();
        }

        $.ajax({
            type: 'POST',
            url: '/user/update',
            contentType: 'application/json',
            data: JSON.stringify({
                bets: [{
                    type: {{ \App\Enums\BetTypes::SpecialBet }},
                    data: {
                        type_id: betId,
                        value: {answer: value},
                    }
                }]
            }),
            dataType: 'json',
            success: function (data) {
                let teams = Object.values(@json($teams));
                let newVal = value;
                let currentBetHtml = newVal;
                if (teamSelectionBetIds.indexOf(betId) > -1){
                    let team = teams.find((team)=>team.id == value)
                    const wrapper = $(`#bet_${betId}_current_bet`).find('.team-and-flag');
                    wrapper.find('.team_flag').attr('src', team.crest_url);
                    wrapper.find('span').html(team.name);
                } else if (isTopScorerBet){
                    let scorers = Object.values(@json($scorersList));
                    let scorer = scorers.find((s)=>s.id == value)
                    let team = teams.find((team)=>team.id == scorer.team_id)
                    const wrapper = $(`#bet_${betId}_current_bet`).find('.team-and-flag');
                    wrapper.find('.team_flag').attr('src', team.crest_url);
                    wrapper.find('span').html(scorer.name);
                }
                else {
                    $(`#bet_${betId}_current_bet`).children('span').first().html(currentBetHtml);
                }
                $(`#bet_${betId}_current_bet`).removeClass('hidden');
                $("#save-bet-" + betId).removeClass("btn-primary").addClass("btn-success");
            },
            error: function(data) {
                toastr["error"](data.responseJSON.message);
            }
        });
    }

    function inputChange(betId){
        $("#save-bet-" + betId).removeClass("btn-success").addClass("btn-primary");
    }

    function onSelectInputChange(id){
        inputChange(id)
    }

</script>
@endsection

@section('content')
    @if(\App\Group::areBetsOpen())
    <div class="row" style="margin-right: -10px; margin-left: -10px;">
        <h2>הימורים מיוחדים</h2>
        @foreach($bets as $i => $specialBet)
            @php
                $bet = $specialBet->bet;
                $specialBetId = $specialBet->getID();
                $betName = $specialBet->getName();
                $inputAttrs = $inputAttrMap[$betName];
                $playerCustomInputNote = "נא להכניס את השם המלא של השחקן";
            @endphp
            <div class="col-xs-12 col-md-9 col-lg-7" style="float: right; border-radius: 5px; border: #000 1px solid; margin-bottom: 25px; padding: 10px;">
                <h3 style="text-align: center;">{{$specialBet->getTitle()}}</h3>
                <span style="position: absolute; top: 10px; right: 15px;">{{$specialBetId}}</span>
                <div class="betContent">
                    <div class="inputWrapper">
                    @if ($inputAttrs['type'] == 'select')
                        <select id="{{$specialBetId}}_select_input" onChange="onSelectInputChange({{$specialBetId}})" class="form-select form-select-lg mb-3">
                            <option value="no_value" selected>{{$inputAttrs['title']}}</option>
                            @foreach($inputAttrs['options'] as $option_data)
                                <option class="left-to-right" value="{{$option_data['id']}}">
                                    {{$option_data['name']}}
                                </option>
                            @endforeach
                        </select>
                    @else
                        <input class="special_bet_input from-control" onfocus="inputChange({{$specialBetId}})" style="margin-bottom: 0px;" type="text" data-bet-id="{{$specialBetId}}">
                        <h6>{{$playerCustomInputNote}}</h6>
                    @endif
                    </div>
                    <button id="save-bet-{{$specialBetId}}" onClick="sendBet('{{$specialBetId}}')" type="button" class="btn btn-primary">שלח</button>
                    <div id="bet_{{$specialBetId}}_current_bet" class="currentBetWrapper flex-row {{!$bet ? "hidden" : ''}}">
                    <u>הימור נוכחי</u>: " <span>
                            @if ($bet)
                            {!! $specialBet->formatDescription($bet->getData('answer')) !!}
                            @else
                                @include('widgets.teamWithFlag')
                            @endif
                        </span> "
                    </div>
                </div>
            </div>
            
        @endforeach
    </div>

    @else
    <h2>נסגרו ההימורים! לא ניתן לעדכן הימורים אלה</h2>
    @endif

@endsection