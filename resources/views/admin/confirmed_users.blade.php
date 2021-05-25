@extends('layouts.home')

@section('script')
<script>
    function showResetPassForm(userId){
        window.location = `/admin/reset-password/${userId}`;
    }

    function setPermission(userId, permission) {
        $.ajax({
            type: 'POST',
            url: '/admin/set-permission',
            contentType: 'application/json',
            data: JSON.stringify({
                permission: permission,
                user_id: userId,
            }),
            dataType: 'json',
            success: function (data) {
                window.location.reload();
            },
            error: function(data) {
                toastr["error"](data.responseJSON.message);
            }
        });
    }
    function makeAdmin(userId){
        return setPermission(userId, 2)
    }

    function makeRegularUser(userId){
        return setPermission(userId, 1)
    }
</script>
@endsection

@section('content')
            <h1>משתמשים ממתינים לאישור</h1>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th class="col-xs-4">שם</th>
                        <th class="col-xs-3">שם משתמש</th>
                        <th class="col-xs-3">הרשאות</th>
                        <th class="col-xs-1">פעולות</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($users as $user)
                    <tr class="user_{{$user->id}}">
                        <td class="">{{$user->name}}</td>
                        <td class="">{{$user->username}}</td>
                        <td class="">{{$user->isAdmin() ? "Admin" : "User"}}</td>
                        <td class="">
                            @if($user->isAdmin())
                            <button class="btn btn-sm btn-danger" onclick="makeRegularUser({{ $user->id }})" id="confirm_user_button">הסר הרשאות אדמין</button>
                            @else
                            <button class="btn btn-sm btn-success" onclick="makeAdmin({{ $user->id }})" id="confirm_user_button">הפוך לאדמין</button>
                            @endif
                            <button class="btn btn-sm btn-secondary" onclick="showResetPassForm({{ $user->id }})" id="confirm_user_button">שנה סיסמה</button>
                        </td>
                    <tr>
                    @endforeach
                </tbody>
            </table>
@endsection