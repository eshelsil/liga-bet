<?php
    $crest_url = $crest_url ?? '';
    $name = $name ?? '';
    $align_left = $align_left ?? false;
    $isUnderlined = $is_underlined ?? false;
    $isBold = $is_bold ?? false;
    $isWinnerBg = $is_winner_bg ?? false;
    $isLoserBg = $is_loser_bg ?? false;
?>

<div class="team-and-flag {{$align_left ? 'left-aligned' : ''}}">
    <div class=flag-wrapper>
        <img class="team_flag" src="{{$crest_url}}">
    </div>
    <span class="team_with_flag-span {{$isLoserBg ? "bet-loser-bg" : ''}} {{$isWinnerBg ? "bet-winner-bg" : ''}} {{$isUnderlined ? "underlined" : ''}} {{$isBold ? "bolded" : ''}}">{{$name}}</span>
</div>