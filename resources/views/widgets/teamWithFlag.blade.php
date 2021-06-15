<?php
    $crest_url = $crest_url ?? '';
    $name = $name ?? '';
    $align_left = $align_left ?? false;
    $isBetWinner = $bet_is_winner ?? false;
    $isMatchWinner = $match_is_winner ?? false;
?>

<div class="team-and-flag {{$align_left ? 'left-aligned' : ''}}">
    <div class=flag-wrapper>
        <img class="team_flag" src="{{$crest_url}}">
    </div>
    <span class="team_with_flag-span {{$isBetWinner ? "underlined" : ''}} {{$isMatchWinner ? "bolded" : ''}}">{{$name}}</span>
</div>