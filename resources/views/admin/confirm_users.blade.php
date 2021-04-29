@extends('layouts.home')

@section('script')
<script>
    function showResetPassForm(userId){
        window.location = `/admin/reset-password/${userId}`;
    }
    function confirmUser(userId) {
        $.ajax({
            type: 'POST',
            url: '/admin/set-permission',
            contentType: 'application/json',
            data: JSON.stringify({
                permission: 1,
                user_id: userId,
            }),
            dataType: 'json',
            success: function (data) {
                $(`.user_${userId}`).css('display', 'none');
            },
            error: function(data) {
                toastr["error"](data.responseJSON.message);
            }
        });

    }
</script>
@endsection

@section('content')
            <h1>משתמשים ממתינים לאישור</h1>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th class="col-sm-4">שם</th>
                        <th class="col-sm-3">שם משתמש</th>
                        <th class="col-sm-2">נוצר</th>
                        <th class="col-sm-2">שונה</th>
                        <th class="col-sm-1">פעולות</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($users_to_confirm as $user)
                    <tr class="user_{{$user->id}}">
                        <td class="">{{$user->name}}</td>
                        <td class="">{{$user->username}}</td>
                        <td class="">{{$user->created_at}}</td>
                        <td class="">{{$user->updated_at}}</td>
                        <td class="">
                            <button class="btn btn-primary" onclick="confirmUser({{ $user->id }})" id="confirm_user_button">אשר</button>
                            <button class="btn btn-sm btn-secondary" onclick="showResetPassForm({{ $user->id }})" id="confirm_user_button">שנה סיסמה</button>
                        </td>
                    <tr>
                    @endforeach
                </tbody>
            </table>
@endsection