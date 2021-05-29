@extends('layouts.home')


@section('content')
    <div class="all-ltr" style="margin-bottom: 30px;">
        <h2 style="direction: ltr; text-align: left;">Tools:</h2>
        <a href="/admin/users-to-confirm">Users To Confirm</a><br>
        <a href="/admin/confirmed-users">Confirmed Users</a><br>
        <a href="/admin/add-scorer">Add player to scorers table</a><br>
    </div>
@endsection
