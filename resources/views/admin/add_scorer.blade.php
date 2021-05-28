@extends('layouts.home')


@section('script')
<script>
    function addScorer() {
        $('#success_printer').html('');
        const id = $('#id_input').val();
        const name = $('#name_input').val();
        const team_id = $('#team_selection').val();
        $.ajax({
            type: 'POST',
            url: '/admin/add-scorer',
            contentType: 'application/json',
            data: JSON.stringify({
                id,
                name,
                team_id,
            }),
            dataType: 'json',
            success: function (data) {
                $('#success_printer').html(data);
            },
            error: function(data) {
                if (data.responseText !== undefined){
                    toastr["error"](data.responseText);
                } else {
                    toastr["error"](data.responseJSON.message);
                }
            }
        });
    }

</script>
@endsection


<?php
    $teams = \App\Team::all(['id', 'name', 'crest_url'])->sortBy('name');
?>
@section('content')



    <h1>Add player to scorers table</h1>
    @csrf
    <div style="font-size: 20px;">
        <div>
            <label for="id_input">External ID</label>
            <input id="id_input" type="number">
        </div>
        <div>
            <label for="id_input">Name</label>
            <input id="name_input" type="text">
        </div>
        <div>
            <label for="team_selection">Team</label>
            <select id="team_selection">
                @foreach($teams as $team)
                    <option value="{{$team->id}}">
                        {{$team->name}}
                    </option>
                @endforeach
            </select>
        </div>
        <button class="btn btn-primary" onClick="addScorer()">שלח</button>
    </div>
    <div id="success_printer"></div>

@endsection
