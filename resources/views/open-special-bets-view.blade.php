@extends('layouts.home')

@php
    $topScorerDropdownTitle = "----בחר מלך שערים----";
    $teamSelectionTitle = "----בחר קבוצה----";
    $topScorerDefaultBets = config('tournamentData.topScorerBets');
    $teams = \App\Team::all(['id', 'name', 'crest_url'])->sortBy('name')->toArray();
    $inputAttrMap = [
            'top_scorer' => [
                'type' => count($topScorerDefaultBets) > 0 ? 'select' : 'text',
                'title' => $topScorerDropdownTitle,
                'options' => $topScorerDefaultBets,
                'has_custom' => true,
            ],
            'winner' => [
                'type' => 'select',
                'title' => $teamSelectionTitle,
                'options' => $teams,
                'has_custom' => false,
            ],
            'runner_up' => [
                'type' => 'select',
                'title' => $teamSelectionTitle,
                'options' => $teams,
                'has_custom' => false,
            ],
            'offensive_team' => [
                'type' => 'select',
                'title' => $teamSelectionTitle,
                'options' => $teams,
                'has_custom' => false,
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
        ]
        if (@json($inputAttrMap)['top_scorer']['type'] === 'select'){
            selectionBetIds.push(top_scorer_bet_id);
        }
        const isTopScorerBet = betId == top_scorer_bet_id;

        let betValue, value, name, id=null;
        if (selectionBetIds.indexOf(betId) > -1){
            const input = $(`#${betId}_select_input`);
            value = input.val();
            if (value == 'custom'){
                name = $(`.special_bet_custom_input_wrapper[data-bet-id='${betId}']`).children('input').val();
            } else if (value !== "no_value") {
                id = value;
                let options = isTopScorerBet ? @json($topScorerDefaultBets) : Object.values(@json($teams));
                name = options.find((opt)=>{ return opt.id == id})['name'];
            } else {
                let optionEntity = isTopScorerBet ? 'player' : 'team';
                toastr["error"](`No ${optionEntity} was selected`);
                return;
            }

            betValue = isTopScorerBet ?
            {
                player_name: name,
                player_id: id,
            } : {
                answer: id
            };
        } else {
            const input = $(`.special_bet_input[data-bet-id='${betId}']`);
            value = input.val();
            if (isTopScorerBet){
                betValue = {player_name: value};
            } else {
                betValue = {answer: value};
            }
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
                        value: betValue,
                    }
                }]
            }),
            dataType: 'json',
            success: function (data) {
                let newVal = name !== undefined ? name : value;
                let currentBetHtml = newVal;
                if (teamSelectionBetIds.indexOf(betId) > -1){
                    let teams = Object.values(@json($teams));
                    let team = teams.find((team)=>team.id == value)
                    const wrapper = $(`#bet_${betId}_current_bet`).find('.team-and-flag');
                    wrapper.find('.team_flag').attr('src', team.crest_url);
                    wrapper.find('span').html(team.name);

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
        const input = $(`#${id}_select_input`);
        const custom_text_input  = $(`.special_bet_custom_input_wrapper[data-bet-id='${id}']`);
        if (custom_text_input.length == 0){
            return
        }
        const enable_custom_input = input.val() === 'custom';
        if (enable_custom_input){
            custom_text_input.attr('hidden', false)
        } else {
            custom_text_input.attr('hidden', true)
        }
    }

</script>
@endsection

@section('content')
    @if(\App\Group::areBetsOpen())
    <div class="row" style="margin-right: -10px; margin-left: -10px;">
        <h2>הימורים לטווח רחוק</h2>
        @foreach($bets as $i => $specialBet)
            @php
                $bet = $specialBet->bet;
                $specialBetId = $specialBet->getID();
                $betName = $specialBet->getName();
                $inputAttrs = $inputAttrMap[$betName];
                $playerCustomInputNote = "נא להכניס את השם המלא של השחקן";
            @endphp
            <div class="col-xs-12 col-md-9 col-lg-7" style="float: right; border-radius: 5px; border: #000 1px solid; margin-bottom: 25px; padding: 10px;">
                <h5 style="text-align: center;">{{$specialBet->getTitle()}}</h5>
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
                            @if($inputAttrs['has_custom'])
                                <option value="custom">אחר...</option>
                            @endif
                        </select>
                        @if($inputAttrs['has_custom'])
                            <div class="special_bet_custom_input_wrapper" data-bet-id="{{$specialBetId}}" hidden>
                                <input class="from-control" type="text">
                                <h6>{{$playerCustomInputNote}}</h6>
                            </div>
                        @endif
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