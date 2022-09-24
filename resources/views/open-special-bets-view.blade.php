@extends('layouts.home')

@php
    $topScorerDropdownTitle = "בחר שחקן";
    $teamSelectionTitle = "בחר קבוצה";
    $teamsCollection = \App\Team::all(['id', 'name', 'crest_url']);
    $scorersList = \App\Player::all(['external_id as id', 'name', 'team_id'])->sortBy('name')
                ->map(function($p) use ($teamsCollection){
                    $p->crest_url = $teamsCollection->find($p->team_id)->crest_url;
                    return $p;
                })->toArray();
    $teams = $teamsCollection->sortBy('name')->toArray();
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
        .left-to-right {
            direction: ltr;
            text-align: left;
        }

        .betContent {
            display: table-cell;
        }

        .betContent .inputWrapper {
            display: flex;
            flex-direction: column;
            width: fit-content;
            width: -moz-fit-content;
        }

        .betContent .inputWrapper > * {
            margin-bottom: 10px;
        }

        .betContent button.btn {
            margin-bottom: 10px;
        }

        .betContent button.btn.dropdown-toggle {
            margin-bottom: 0px;
        }

        .currentBetWrapper > span {
            margin-left: 3px;
            margin-right: 3px;
            font-weight: 700;
        }

        h6 {
            margin-top: 3px;
            color: #444
        }
    </style>
    <script type="text/javascript">


        function sendBet(betId) {
            const top_scorer_bet_id = "{{ \App\SpecialBets\SpecialBet::getByType('top_scorer')->id }}";
            const offensive_team_bet_id = "{{ \App\SpecialBets\SpecialBet::getByType('offensive_team')->id }}";
            const champions_bet_id = "{{ \App\SpecialBets\SpecialBet::getByType('winner')->id }}";
            const runner_up_scorer_bet_id = "{{ \App\SpecialBets\SpecialBet::getByType('runner_up')->id }}";
            const teamSelectionBetIds = [runner_up_scorer_bet_id, champions_bet_id, offensive_team_bet_id]
            const selectionBetIds = [
                ...teamSelectionBetIds,
                top_scorer_bet_id
            ]
            const isTopScorerBet = betId == top_scorer_bet_id;

            let value;
            if (selectionBetIds.indexOf(betId) > -1) {
                const input = $(`#hiddenInput-${betId}`);
                value = input.val();
                if (value == "no_op") {
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
                    if (teamSelectionBetIds.indexOf(betId) > -1) {
                        let team = teams.find((team) => team.id == value)
                        const wrapper = $(`#bet_${betId}_current_bet`).find('.team-and-flag');
                        wrapper.find('.team_flag').attr('src', team.crest_url);
                        wrapper.find('span').html(team.name);
                    } else if (isTopScorerBet) {
                        let scorers = Object.values(@json($scorersList));
                        let scorer = scorers.find((s) => s.id == value)
                        let team = teams.find((team) => team.id == scorer.team_id)
                        const wrapper = $(`#bet_${betId}_current_bet`).find('.team-and-flag');
                        wrapper.find('.team_flag').attr('src', team.crest_url);
                        wrapper.find('span').html(scorer.name);
                    } else {
                        $(`#bet_${betId}_current_bet`).children('span').first().html(currentBetHtml);
                    }
                    $(`#bet_${betId}_current_bet`).removeClass('hidden');
                    $("#save-bet-" + betId).removeClass("btn-primary").addClass("btn-success");
                },
                error: function (data) {
                    toastr["error"](data.responseJSON.message);
                }
            });
        }

        function inputChange(betId) {
            $("#save-bet-" + betId).removeClass("btn-success").addClass("btn-primary");
        }

        function selectOption(betId, option_id) {
            const input = $(`#hiddenInput-${betId}`);
            input.val(option_id);
            const option_el = $(`#dropdownOption-${betId}-${option_id}`);
            const dropdown_title_el = $(`#dropdownMenuTitle-${betId}`);
            dropdown_title_el.html(option_el.html());
            inputChange(betId);
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
                    $betName = $specialBet->type;
                    $inputAttrs = $inputAttrMap[$betName];
                    $playerCustomInputNote = "נא להכניס את השם המלא של השחקן";
                @endphp
                <div class="col-xs-12 col-md-9 col-lg-7"
                     style="float: right; border-radius: 5px; border: #000 1px solid; margin-bottom: 25px; padding: 10px;">
                    <h3 style="text-align: center;">{{$specialBet->title}}</h3>
                    <span style="position: absolute; top: 10px; right: 15px;">{{$specialBetId}}</span>
                    <div class="betContent">
                        <div class="inputWrapper">
                            @if ($inputAttrs['type'] == 'select')
                                <input id="hiddenInput-{{$specialBetId}}" value="no_op" hidden>
                                <div class="dropdown dropdown-menu-right dropdown-input">
                                    <button class="btn btn-default dropdown-toggle" type="button"
                                            id="dropdownMenu-{{$specialBetId}}" data-toggle="dropdown"
                                            aria-haspopup="true" aria-expanded="false">
                                        <div id="dropdownMenuTitle-{{$specialBetId}}"
                                             style="display: inline-block;">{{$inputAttrs['title']}}</div>
                                        <span class="caret"></span>
                                    </button>
                                    <ul class="dropdown-menu dropdown-menu-right"
                                        aria-labelledby="dropdownMenu-{{$specialBetId}}">
                                        @foreach($inputAttrs['options'] as $option_data)
                                            <li id="dropdownOption-{{$specialBetId}}-{{$option_data['id']}}"
                                                onclick="selectOption({{$specialBetId}}, {{$option_data['id']}})">
                                                @include('widgets.teamWithFlag', array_merge(['align_left' => true], $option_data))
                                            </li>
                                        @endforeach
                                    </ul>
                                </div>
                            @else
                                <input class="special_bet_input from-control" onfocus="inputChange({{$specialBetId}})"
                                       style="margin-bottom: 0px;" type="text" data-bet-id="{{$specialBetId}}">
                                <h6>{{$playerCustomInputNote}}</h6>
                            @endif
                        </div>
                        <button id="save-bet-{{$specialBetId}}" onClick="sendBet('{{$specialBetId}}')" type="button"
                                class="btn btn-primary">שלח
                        </button>
                        <div id="bet_{{$specialBetId}}_current_bet"
                             class="currentBetWrapper flex-row {{!$bet ? "hidden" : ''}}">
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