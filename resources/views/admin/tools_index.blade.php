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
    function setNameOfUser(){
        let username = prompt("Enter the USERNAME of user");
        let new_name = prompt("Enter the new name you want to set");
        if ( username != null && new_name != null ) {
            callAjax('/admin/user-set-name', {username, new_name})
        }
    }
    function sendGlobalNotification(){
        let title = prompt("Enter the title");
        let body = prompt("Enter the body");
        if ( title != null && body != null ) {
            callAjax('/admin/send-global-notification', {
                "title": title,
                "body": body,
            })
        }
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
    function copmleteKoMatch(){
        let match_id = prompt("Enter match ID:");
        let score_home = prompt("Enter score home:");
        let score_away = prompt("Enter score away:");
        let isAwayWinner;
        if (score_home === score_away){
            isAwayWinner = prompt("Enter isAwayWinner param (0 - if home_team won | 1 - if away_team won)");
            if (["1", "0"].indexOf(isAwayWinner) === -1){
                toastr["error"](`isAwayWinner must be one of [0,1] | Got: ${isAwayWinner}`);
                return
            }
        }
        if ( match_id != null && score_home != null && score_away != null ) {
            isAwayWinner = isAwayWinner ?? '';
            window.location = `/admin/complete-match/${match_id}/${score_home}/${score_away}/${isAwayWinner}`;
        }
    }
    function flipMatchBet(){
        let match_id = prompt("Enter match ID:");
        let user_id = prompt("Enter user ID:");
        if ( match_id != null && user_id != null ) {
            window.location = `/admin/flip-bets/${match_id}/${user_id}`;
        }
    }
    function switchGroups(){
        let group_a_ext_id = prompt("Enter external ID of the first group [example: \"GROUP_X\"]:");
        let group_b_ext_id = prompt("Enter external ID of the second group [example: \"GROUP_X\"]:");
        if ( group_a_ext_id != null && group_b_ext_id != null ) {            
            window.location = `/admin/danger-switch-groups/${group_a_ext_id}/${group_b_ext_id}`;
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
    function getTableIDs(){
        let name = prompt("Enter table name");
        if ( name != null ) {
            window.location = `/debug/get-table-ids/${name}`;
        }
    }
    function getFullTable(){
        let name = prompt("Enter table name");
        if ( name != null ) {
            window.location = `/debug/get-full-table/${name}`;
        }
    }
    function createNewRankState(){
        callAjax('/admin/create-rank-row', {}, 'POST')
    }
    function fixLastRankState(){
        callAjax('/admin/update-last-rank-row', {}, 'POST')
    }
    function removeLastRankState(){
        callAjax('/admin/delete-last-rank-row', {}, 'POST')
    }
    function createMonkey(){
        callAjax('/admin/create-monkey-user', {}, 'POST')
    }
    function deleteUser(){
        let username = prompt("Enter the USERNAME of the user you want to delete");
        let withBets = prompt("Would you like to delete all user bets? (type \"yes\" for TRUE anything else for FALSE)");
        if ( username != null && withBets !== null ) {
            let deleteBets = String(withBets).toLowerCase() == "yes";
            let removeBetsMsg = deleteBets ? "and all of his bets"
                                : "without removing his bets";
            let confirm = prompt(`You are about to delete user "${username}" ${removeBetsMsg}.
            Are you sure?
            (type \"yes\" to confirm)`);
            if (String(confirm).toLowerCase() === "yes"){
                callAjax('/admin/delete-user', { username, should_delete_bets: deleteBets}, 'DELETE')
            }
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
        <a href="javascript:sendGlobalNotification()">Send Global Notifications</a><br>
        <br>
        <a href="javascript:createMonkey()">Create a monkey user (if not exists)</a><br>
        <a href="javascript:setNameOfUser()">Update user's name [input params]</a><br>
        <a href="javascript:deleteUser()">[DANGER] Delete a user [input params]</a><br>
        <br>
        <a href="/admin/add-scorer">Add player to scorers table</a><br>
        <a href="/admin/remove-irrelevant-scorers">Remove irrelevant players from scorers table</a><br>
        <a href="javascript:formatCustomAnswers()">Replace special bets custom answer (on mvp & most_assists) [input params]</a><br>
        <br>
        <a href="javascript:createNewRankState()">Update ranking by creating new state</a><br>
        <a href="javascript:fixLastRankState()">[DANGER] Update ranking by squashing current state to last state</a><br>
        <a href="javascript:removeLastRankState()">[DANGER] Remove last ranking state</a><br>
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
        <a href="javascript:copmleteMatch()">Complete groups-stage-match result [input params]</a><br>
        <a href="javascript:copmleteKoMatch()">Complete knockout-match result [input params]</a><br>
        <a href="javascript:decopmleteMatch()">Remove match result [input params]</a><br>
        <a href="javascript:flipMatchBet()">[DANGER] Flip match bet [input params]</a><br>
        <a href="javascript:switchGroups()">[DANGER] Switch between 2 groups (group-rank-bets & belonging-teams) [input params]</a><br>
        <br>
        <a href="javascript:getTableIDs()">Get all IDs from table [input params]</a><br>
        <a href="javascript:getFullTable()">Get full table data [input params]</a><br>
        <a href="/debug/scorers-simple-data">Get scorers: [id, external_id, name]</a><br>
        <a href="/debug/special-bets-values/mvp">Get mvp bet values</a><br>
        <a href="/debug/special-bets-values/most_assists">Get most_assists bet values</a><br>
        <a href="/debug/special-bets-values/top_scorer">Get top_scorer bet values</a><br>
    </div>
@endsection
