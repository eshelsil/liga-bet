<?php
    $crest_url = $crest_url ?? '';
    $name = $name ?? '';
?>

<div class="team-and-flag">
    <div class=flag-wrapper>
        <img class="team_flag" src="{{$crest_url}}">
    </div>
    <span>{{$name}}</span>
</div>