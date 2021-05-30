@extends('layouts.home')

@section('script')
<script>
    function callAjax(url, data = {}, method="POST"){
        $.ajax({
            type: method,
            url: url,
            contentType: 'application/json',
            data: JSON.stringify(data),
            dataType: 'json',
            success: function (data) {
                console.log("callAjax success_data", data)
                toastr["success"](data);
            },
            error: function(data) {
                console.log("callAjax error_data", data)
                if (data.responseText.endsWith('DONE')){
                    toastr["success"](data.responseText);
                    return;
                }
                toastr["error"](data.responseJSON.message);
            }
        });
    }
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
    function formatCustomAnswers(){
        let from_name = prompt("Enter the name you want to remove");
        let to_name = prompt("Enter the name you want to replace it");
        if ( from_name != null && to_name != null ) {
            callAjax('/admin/format-custom-answers', {from_name, to_name}, 'PUT')
        }
    }
    function calcSpecialBet(){
        let bet_name = prompt("Enter the special bet name");
        if ( bet_name != null ) {
            window.location = `/admin/calc-special-bet/${bet_name}`;
        }
    }
    function calcSingleMatch(){
        let match_id = prompt("Enter match_id");
        if ( match_id != null ) {
            window.location = `/admin/complete-match/${match_id}`;
        }
    }
</script>
@endsection


@section('content')
    <div class="all-ltr" style="margin-bottom: 30px;">
        <h2 style="direction: ltr; text-align: left;">Tools:</h2><br>
        <a href="/admin/users-to-confirm">Users To Confirm</a><br>
        <a href="/admin/confirmed-users">Confirmed Users</a><br>
        <br>
        <a href="/admin/add-scorer">Add player to scorers table</a><br>
        <a href="/admin/remove-irrelevant-scorers">Remove irrelevant players from scorers table</a><br>
        <a href="javascript:formatCustomAnswers()">Replace special bets custom answer (on mvp & most_assists) [input params]</a><br>
        <br>
        <a href="/admin/calc-special-bets">Calculate all special bets</a><br>
        <a href="javascript:calcSpecialBet()">Calculate special bet of single type [input params]</a><br>
        <a href="javascript:calcSingleMatch()">Calculate single match bets [input params]</a><br>
        <a href="/admin/calculate-group-ranks">Calculate all group-rank bets</a><br>
        <br>
        <a href="/admin/fetch-games">Fetch matches from API</a><br>
        <a href="/admin/fetch-scorers">Fetch scorers from API</a><br>
        <a href="/admin/fetch-standings">Fetch standings from API</a><br>
        <br>
        <a href="javascript:decopmleteMatch()">Remove match result [input params]</a><br>
        <a href="javascript:copmleteMatch()">Complete match result [input params]</a><br>
        <a href="javascript:flipMatchBet()">Flip match bet [input params]</a><br>
    </div>
@endsection
