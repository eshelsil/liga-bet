@extends('layouts.home')

@section('script')
<script>
    
    function decopmleteMatch(){
        let match_id = prompt("Enter match ID:");
        if (match_id != null) {
            window.location = `/admin/decomplete-match/${match_id}`;
        }
        return false;
    }
    function copmleteMatch(){
        let match_id = prompt("Enter match ID:");
        let score_home = prompt("Enter score home:");
        let score_away = prompt("Enter score away:");
        if ( match_id != null && score_home != null && score_away != null ) {
            window.location = `/admin/complete-match/${match_id}/${score_home}/${score_away}`;
        }
    }
    function flipMatchBet(){
        let match_id = prompt("Enter match ID:");
        let user_id = prompt("Enter user ID:");
        if ( match_id != null && user_id != null ) {
            window.location = `/admin/flip-bets/${match_id}/${user_id}`;
        }
    }
    
</script>
@endsection


@section('content')
    <div class="all-ltr" style="margin-bottom: 30px;">
        <h2 style="direction: ltr; text-align: left;">Tools:</h2>
        <a href="/admin/users-to-confirm">Users To Confirm</a><br>
        <a href="/admin/confirmed-users">Confirmed Users</a><br>
        <a href="/admin/add-scorer">Add player to scorers table</a><br>
        <a href="/admin/remove-irrelevant-scorers">Remove irrelevant players from scorers table</a><br>
        <a href="/admin/calc-special-bets">Calculate all special bets</a><br>
        <a href="/admin/calculate-group-ranks">Calculate all group-rank bets</a><br>
        <a href="/admin/fetch-games">Fetch matches from API</a><br>
        <a href="/admin/fetch-scorers">Fetch scorers from API</a><br>
        <a href="/admin/fetch-standings">Fetch standings from API</a><br>
        <a href="javascript:decopmleteMatch()">Remove match result</a><br>
        <a href="javascript:copmleteMatch()">Complete match result</a><br>
        <a href="javascript:flipMatchBet()">Flip match bet</a><br>
    </div>
@endsection
