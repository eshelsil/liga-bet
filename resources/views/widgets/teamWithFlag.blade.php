<?php
    $crest_url = $crest_url ?? '';
    $name = $name ?? '';
    $align_left = $align_left ?? false;
?>

<div class="team-and-flag {{$align_left ? 'left-aligned' : ''}}">
    <div class=flag-wrapper>
        <img class="team_flag" src="{{$crest_url}}">
    </div>
    <span>{{$name}}</span>
</div>