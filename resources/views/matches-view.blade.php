@extends('layouts.home')

@section('content')
    <h1>רשימת משחקים</h1>
    <div class="float-right">
        <ul class="nav nav-tabs float-right"  style="padding-right: 0px;">
            <li class="float-right active">
                <a data-toggle="tab" href="#ongoing-games">
                    משחקים נוכחיים
                </a>
            </li>
            <li class="float-right">
                <a data-toggle="tab" href="#done-games">
                    משחקים שנגמרו
                </a>
            </li>
        </ul>
    </div>
    <div class="tab-content" style="margin-top: 25px;">
        <div id="ongoing-games" class="tab-pane fade active in" style="padding-top: 35px;">
            @include('matches-view-content', [
                "teamsByExtId" => $teamsByExtId,
                "matches" => $current_matches,
                "with_api_fetch_button" => true,
            ])
        </div>
        <div id="done-games" class="tab-pane fade active in" style="padding-top: 35px;">
            @include('matches-view-content', [
                "teamsByExtId" => $teamsByExtId,
                "matches" => $done_matches,
            ])
        </div>
    </div>
@endsection